import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { ClassBase } from '../../base/ClassBase';

export interface ClassExpression extends ClassBase {
  type: AST_NODE_TYPES.ClassExpression;
  /**
   * A class expression cannot be abstract.
   */
  abstract: false;
  /**
   * A class expression cannot have a `declare` keyword.
   */
  declare: false;
}
