import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import * as ts from 'typescript';

import type {
  InferMessageIdsTypeFromRule,
  InferOptionsTypeFromRule,
} from '../util';
import { createRule, getModifiers, getParserServices } from '../util';
import { getESLintCoreRule } from '../util/getESLintCoreRule';

const baseRule = getESLintCoreRule('dot-notation');

export type Options = InferOptionsTypeFromRule<typeof baseRule>;
export type MessageIds = InferMessageIdsTypeFromRule<typeof baseRule>;

export default createRule<Options, MessageIds>({
  name: 'dot-notation',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce dot notation whenever possible',
      recommended: 'stylistic',
      extendsBaseRule: true,
      requiresTypeChecking: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowKeywords: {
            description: 'Whether to allow keywords such as ["class"]`.',
            type: 'boolean',
            default: true,
          },
          allowPattern: {
            description: 'Regular expression of names to allow.',
            type: 'string',
            default: '',
          },
          allowPrivateClassPropertyAccess: {
            description:
              'Whether to allow accessing class members marked as `private` with array notation.',
            type: 'boolean',
            default: false,
          },
          allowProtectedClassPropertyAccess: {
            description:
              'Whether to allow accessing class members marked as `protected` with array notation.',
            type: 'boolean',
            default: false,
          },
          allowIndexSignaturePropertyAccess: {
            description:
              'Whether to allow accessing properties matching an index signature with array notation.',
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: baseRule.meta.fixable,
    hasSuggestions: baseRule.meta.hasSuggestions,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [
    {
      allowPrivateClassPropertyAccess: false,
      allowProtectedClassPropertyAccess: false,
      allowIndexSignaturePropertyAccess: false,
      allowKeywords: true,
      allowPattern: '',
    },
  ],
  create(context, [options]) {
    const rules = baseRule.create(context);
    const services = getParserServices(context);

    const allowPrivateClassPropertyAccess =
      options.allowPrivateClassPropertyAccess;
    const allowProtectedClassPropertyAccess =
      options.allowProtectedClassPropertyAccess;
    const allowIndexSignaturePropertyAccess =
      (options.allowIndexSignaturePropertyAccess ?? false) ||
      tsutils.isCompilerOptionEnabled(
        services.program.getCompilerOptions(),
        'noPropertyAccessFromIndexSignature',
      );

    return {
      MemberExpression(node: TSESTree.MemberExpression): void {
        if (
          (allowPrivateClassPropertyAccess ||
            allowProtectedClassPropertyAccess ||
            allowIndexSignaturePropertyAccess) &&
          node.computed
        ) {
          // for perf reasons - only fetch symbols if we have to
          const propertySymbol =
            services.getSymbolAtLocation(node.property) ??
            services
              .getTypeAtLocation(node.object)
              .getNonNullableType()
              .getProperties()
              .find(
                propertySymbol =>
                  node.property.type === AST_NODE_TYPES.Literal &&
                  propertySymbol.escapedName === node.property.value,
              );
          const modifierKind = getModifiers(
            propertySymbol?.getDeclarations()?.[0],
          )?.[0].kind;
          if (
            (allowPrivateClassPropertyAccess &&
              modifierKind === ts.SyntaxKind.PrivateKeyword) ||
            (allowProtectedClassPropertyAccess &&
              modifierKind === ts.SyntaxKind.ProtectedKeyword)
          ) {
            return;
          }
          if (
            propertySymbol === undefined &&
            allowIndexSignaturePropertyAccess
          ) {
            const objectType = services.getTypeAtLocation(node.object);
            const indexType = objectType
              .getNonNullableType()
              .getStringIndexType();
            if (indexType !== undefined) {
              return;
            }
          }
        }
        rules.MemberExpression(node);
      },
    };
  },
});
