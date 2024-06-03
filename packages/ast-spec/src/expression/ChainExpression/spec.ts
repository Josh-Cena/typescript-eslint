import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { ChainElement } from '../../unions/ChainElement';

/**
 * An expression that contains an optional chain somewhere. It does not mean
 * `expression.optional` is true, for example:
 * ```
 * a?.().b
 * ```
 */
export interface ChainExpression extends BaseNode {
  type: AST_NODE_TYPES.ChainExpression;
  expression: ChainElement;
}
