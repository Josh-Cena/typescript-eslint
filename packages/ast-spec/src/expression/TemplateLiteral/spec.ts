import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type {
  TemplateElementNonTail,
  TemplateElementTail,
} from '../../special/TemplateElement/spec';
import type { Expression } from '../../unions/Expression';

export interface TemplateLiteral extends BaseNode {
  type: AST_NODE_TYPES.TemplateLiteral;
  /**
   * A sequence of template elements. Must have at least one, and `length` must
   * be `expressions.length + 1`.
   */
  quasis: [...TemplateElementNonTail[], TemplateElementTail];
  /**
   * A sequence of interpolated expressions. The length must be `quasis.length - 1`.
   */
  expressions: Expression[];
}
