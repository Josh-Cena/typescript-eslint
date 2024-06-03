import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Identifier } from '../Identifier/spec';

/**
 * `import.meta`, `new.target`, etc.
 */
export interface MetaProperty extends BaseNode {
  type: AST_NODE_TYPES.MetaProperty;
  /**
   * Will be a keyword such as `import` or `new`.
   */
  meta: Identifier;
  property: Identifier;
}
