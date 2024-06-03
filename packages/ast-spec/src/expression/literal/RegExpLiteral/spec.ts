import type { LiteralBase } from '../../../base/LiteralBase';

export interface RegExpLiteral extends LiteralBase {
  /**
   * Is `null` when the regular expression is invalid.
   */
  value: RegExp | null;
  regex: {
    /**
     * The text that comes between the slashes.
     */
    pattern: string;
    /**
     * The text that comes after the second slash.
     */
    flags: string;
  };
}
