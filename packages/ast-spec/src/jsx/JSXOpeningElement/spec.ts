import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { TSTypeParameterInstantiation } from '../../special/TSTypeParameterInstantiation/spec';
import type { JSXTagNameExpression } from '../../unions/JSXTagNameExpression';
import type { JSXAttribute } from '../JSXAttribute/spec';
import type { JSXSpreadAttribute } from '../JSXSpreadAttribute/spec';

interface JSXOpeningElementBase extends BaseNode {
  type: AST_NODE_TYPES.JSXOpeningElement;
  typeArguments: TSTypeParameterInstantiation | undefined;

  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined;

  selfClosing: boolean;
  name: JSXTagNameExpression;
  attributes: (JSXAttribute | JSXSpreadAttribute)[];
}

export interface JSXOpeningElementSelfClosing extends JSXOpeningElementBase {
  selfClosing: true;
}

export interface JSXOpeningElementNonSelfClosing extends JSXOpeningElementBase {
  selfClosing: false;
}

export type JSXOpeningElement =
  | JSXOpeningElementSelfClosing
  | JSXOpeningElementNonSelfClosing;
