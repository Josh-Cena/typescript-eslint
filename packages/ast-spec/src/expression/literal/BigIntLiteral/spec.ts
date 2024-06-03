import type { LiteralBase } from '../../../base/LiteralBase';

export interface BigIntLiteral extends LiteralBase {
  value: bigint | null;
  /**
   * String representation of the BigInt value, without the `n` suffix.
   */
  bigint: string;
}
