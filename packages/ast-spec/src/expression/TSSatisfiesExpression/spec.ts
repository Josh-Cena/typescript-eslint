import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Expression } from '../../unions/Expression';
import type { TypeNode } from '../../unions/TypeNode';

/**
 * ```
 * expression satisfies Type
 * ```
 */
export interface TSSatisfiesExpression extends BaseNode {
  type: AST_NODE_TYPES.TSSatisfiesExpression;
  /**
   * The left-hand side value-space expression.
   */
  expression: Expression;
  /**
   * The right-hand side type-space type expression.
   */
  typeAnnotation: TypeNode;
}
