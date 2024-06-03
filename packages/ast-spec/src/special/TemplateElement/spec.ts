import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';

interface TemplateElementBase extends BaseNode {
  type: AST_NODE_TYPES.TemplateElement;
  value: {
    /**
     * String value, without rendering escape sequences.
     */
    raw: string;
    /**
     * String value, with escape sequences rendered.
     */
    cooked: string;
  };
  /**
   * Whether this is the tail of the template literal.
   */
  tail: boolean;
}

export interface TemplateElementNonTail extends TemplateElementBase {
  tail: false;
}

export interface TemplateElementTail extends TemplateElementBase {
  tail: true;
}

export type TemplateElement = TemplateElementNonTail | TemplateElementTail;
