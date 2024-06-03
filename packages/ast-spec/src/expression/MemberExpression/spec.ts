import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { PrivateIdentifier } from '../../special/PrivateIdentifier/spec';
import type { Expression } from '../../unions/Expression';
import type { Identifier } from '../Identifier/spec';

interface MemberExpressionBase extends BaseNode {
  type: AST_NODE_TYPES.MemberExpression;
  object: Expression;
  property: Expression | Identifier | PrivateIdentifier;
  computed: boolean;
  optional: boolean;
}

export interface MemberExpressionComputedName extends MemberExpressionBase {
  property: Expression;
  computed: true;
}

export interface MemberExpressionNonComputedName extends MemberExpressionBase {
  property: Identifier | PrivateIdentifier;
  computed: false;
}

export type MemberExpression =
  | MemberExpressionComputedName
  | MemberExpressionNonComputedName;
