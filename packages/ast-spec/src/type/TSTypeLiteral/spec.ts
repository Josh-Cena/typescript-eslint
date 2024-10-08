import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { TypeElement } from '../../unions/TypeElement';

export interface TSTypeLiteral extends BaseNode {
  members: TypeElement[];
  type: AST_NODE_TYPES.TSTypeLiteral;
}
