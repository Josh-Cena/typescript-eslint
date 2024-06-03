import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Expression } from '../../unions/Expression';

export interface YieldStarExpression extends BaseNode {
  type: AST_NODE_TYPES.YieldExpression;
  delegate: true;
  argument: Expression;
}

export interface YieldPlainExpression extends BaseNode {
  type: AST_NODE_TYPES.YieldExpression;
  delegate: false;
  argument: Expression | undefined;
}

export type YieldExpression = YieldStarExpression | YieldPlainExpression;
