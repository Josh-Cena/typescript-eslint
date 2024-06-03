import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Expression } from '../../unions/Expression';

export interface ImportExpression extends BaseNode {
  type: AST_NODE_TYPES.ImportExpression;
  /**
   * The first "argument" of the `import()` call
   */
  source: Expression;
  /**
   * The second "argument" of the `import()` call
   */
  attributes: Expression | null;
}
