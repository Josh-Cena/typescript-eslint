import type { AST_NODE_TYPES } from '../ast-node-types';
import type { BaseNode } from './BaseNode';

export interface LiteralBase extends BaseNode {
  type: AST_NODE_TYPES.Literal;
  /**
   * The raw text of the literal. Strings have the quotes, bigint has the n, etc.
   */
  raw: string;
  /**
   * Parsed value of the literal. May be `null` if either the literal is null
   * or invalid.
   */
  value: RegExp | bigint | boolean | number | string | null;
}
