import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { FunctionBase } from '../../base/FunctionBase';

/**
 * Used to "declare" a function expression. For example:
 * ```
 * class A {
 *   x();
 * }
 */
export interface TSEmptyBodyFunctionExpression extends FunctionBase {
  type: AST_NODE_TYPES.TSEmptyBodyFunctionExpression;
  body: null;
  id: null;
}
