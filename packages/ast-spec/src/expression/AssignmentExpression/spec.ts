import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { AssignmentTarget } from '../../unions/AssignmentTarget';
import type { Expression } from '../../unions/Expression';
import type { ValueOf } from '../../utils';
import type { AssignmentOperatorToText } from './AssignmentOperatorToText';

export * from './AssignmentOperatorToText';

export interface AssignmentExpression extends BaseNode {
  type: AST_NODE_TYPES.AssignmentExpression;
  operator: ValueOf<AssignmentOperatorToText>;
  left: AssignmentTarget;
  right: Expression;
}
