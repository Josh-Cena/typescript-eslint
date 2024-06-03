import type { AST_NODE_TYPES } from '../../ast-node-types';
import type { BaseNode } from '../../base/BaseNode';
import type { TSTypeAnnotation } from '../../special/TSTypeAnnotation/spec';
import type { TSTypeParameterDeclaration } from '../../special/TSTypeParameterDeclaration/spec';
import type { BlockStatement } from '../../statement/BlockStatement/spec';
import type { Expression } from '../../unions/Expression';
import type { Parameter } from '../../unions/Parameter';

interface ArrowFunctionExpressionBase extends BaseNode {
  type: AST_NODE_TYPES.ArrowFunctionExpression;
  /**
   * Always false. It is here so people can handle FunctionExpression and
   * ArrowFunctionExpression uniformly.
   */
  generator: false;
  /**
   * Always null. It is here so people can handle FunctionExpression and
   * ArrowFunctionExpression uniformly.
   */
  id: null;
  /**
   * Parameters of the function.
   */
  params: Parameter[];
  /**
   * The body of an arrow function can either be a block or a single expression.
   */
  body: BlockStatement | Expression;
  /**
   * Whether the arrow function is async.
   */
  async: boolean;
  /**
   * Whether the arrow function has a single expression as its body.
   */
  expression: boolean;
  /**
   * Return type of the function, if declared.
   */
  returnType: TSTypeAnnotation | undefined;
  /**
   * Type parameters of the function, if declared. If present, must be non-empty.
   */
  typeParameters: TSTypeParameterDeclaration | undefined;
}

export interface ArrowFunctionExpressionBlock
  extends ArrowFunctionExpressionBase {
  body: BlockStatement;
  expression: false;
}

export interface ConciseArrowFunctionExpression
  extends ArrowFunctionExpressionBase {
  body: Expression;
  expression: true;
}

export type ArrowFunctionExpression =
  | ArrowFunctionExpressionBlock
  | ConciseArrowFunctionExpression;
