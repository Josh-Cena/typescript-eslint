import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Expression } from '../../unions/Expression';

/**
 * Short-circuiting logical expressions: `??`, `&&`, or `||`.
 */
export interface LogicalExpression extends BaseNode {
  type: AST_NODE_TYPES.LogicalExpression;
  operator: '??' | '&&' | '||';
  left: Expression;
  right: Expression;
}
