import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { TSTypeParameterInstantiation } from '../../special/TSTypeParameterInstantiation/spec';
import type { CallExpressionArgument } from '../../unions/CallExpressionArgument';
import type { Expression } from '../../unions/Expression';

export interface CallExpression extends BaseNode {
  type: AST_NODE_TYPES.CallExpression;
  /**
   * The function that is being called. Can be any expression - for example,
   * `(a || b)()`
   */
  callee: Expression;
  /**
   * Function call arguments. Can be either expressions or spread elements.
   */
  arguments: CallExpressionArgument[];
  /**
   * Type arguments. For example `foo<number, string>()`
   */
  typeArguments: TSTypeParameterInstantiation | undefined;

  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined;
  /**
   * Whether it's an optional chain call. `foo?.()`
   */
  optional: boolean;
}
