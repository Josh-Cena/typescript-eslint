import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Statement } from '../../unions/Statement';

export interface StaticBlock extends BaseNode {
  body: Statement[];
  type: AST_NODE_TYPES.StaticBlock;
}
