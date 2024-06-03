import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Expression } from '../../unions/Expression';

export interface ConditionalExpression extends BaseNode {
  type: AST_NODE_TYPES.ConditionalExpression;
  /**
   * The condition expression (first)
   */
  test: Expression;
  /**
   * Expression evaluated when condition is truthy (second)
   */
  consequent: Expression;
  /**
   * Expression evaluated when condition is falsy (third)
   */
  alternate: Expression;
}
