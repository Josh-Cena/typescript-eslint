import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { Decorator } from '../../special/Decorator/spec';
import type { TSTypeAnnotation } from '../../special/TSTypeAnnotation/spec';

interface IdentifierBase extends BaseNode {
  type: AST_NODE_TYPES.Identifier;
  name: string;
  typeAnnotation: TSTypeAnnotation | undefined;
  optional: boolean;
  decorators: Decorator[];
}

/**
 * An identifier used to create a binding, e.g. in a variable declaration,
 * parameter declaration, or a catch clause.
 */
export interface IdentifierBinding extends IdentifierBase {}

/**
 * An identifier used elsewhere, e.g. in an expression, object property key
 */
export interface IdentifierExpression extends BaseNode {
  typeAnnotation: undefined;
  optional: false;
  decorators: [];
}

export type Identifier = IdentifierBinding | IdentifierExpression;
