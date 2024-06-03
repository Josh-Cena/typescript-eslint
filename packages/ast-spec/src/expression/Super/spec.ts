import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';

/**
 * The `super` keyword.
 */
export interface Super extends BaseNode {
  type: AST_NODE_TYPES.Super;
}
