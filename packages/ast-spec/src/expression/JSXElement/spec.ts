import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { JSXClosingElement } from '../../jsx/JSXClosingElement/spec';
import type {
  JSXOpeningElement,
  JSXOpeningElementSelfClosing,
  JSXOpeningElementNonSelfClosing,
} from '../../jsx/JSXOpeningElement/spec';
import type { JSXChild } from '../../unions/JSXChild';

interface JSXElementBase extends BaseNode {
  type: AST_NODE_TYPES.JSXElement;
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}

export interface JSXElementSelfClosing extends JSXElementBase {
  openingElement: JSXOpeningElementSelfClosing;
  closingElement: null;
  children: [];
}

export interface JSXElementNonSelfClosing extends JSXElementBase {
  openingElement: JSXOpeningElementNonSelfClosing;
  closingElement: JSXClosingElement;
}

export type JSXElement = JSXElementSelfClosing | JSXElementNonSelfClosing;
