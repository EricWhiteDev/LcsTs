// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { CorrelationStatus } from './correlation-status';

/**
 * A pair of token subsequences together with their {@link CorrelationStatus}.
 *
 * @remarks
 * The {@link compare} function returns an array of `CorrelatedSequence`
 * objects. Each entry describes a contiguous run of tokens that are
 * {@link CorrelationStatus.Equal | equal}, {@link CorrelationStatus.Deleted | deleted},
 * or {@link CorrelationStatus.Inserted | inserted}.
 *
 * For equal sequences both lists contain the matched tokens. For deletions
 * only {@link comparisonUnitList1} is populated; for insertions only
 * {@link comparisonUnitList2} is populated.
 *
 * @category Class and Type Reference
 */
export class CorrelatedSequence {
  /** The relationship between the two subsequences. */
  public readonly correlationStatus: CorrelationStatus;
  /** Tokens from the first input, or `null` for insertions. */
  public readonly comparisonUnitList1: readonly ComparisonUnitToken[] | null;
  /** Tokens from the second input, or `null` for deletions. */
  public readonly comparisonUnitList2: readonly ComparisonUnitToken[] | null;

  /**
   * Creates a new correlated sequence.
   *
   * @param comparisonUnitList1 - Tokens from the first input.
   * @param comparisonUnitList2 - Tokens from the second input.
   * @param correlationStatus - The correlation status for this pair.
   */
  constructor(
    comparisonUnitList1: readonly ComparisonUnitToken[] | null,
    comparisonUnitList2: readonly ComparisonUnitToken[] | null,
    correlationStatus: CorrelationStatus,
  ) {
    this.correlationStatus = correlationStatus;
    this.comparisonUnitList1 = comparisonUnitList1;
    this.comparisonUnitList2 = comparisonUnitList2;
  }

  /**
   * Returns a multi-line, human-readable representation of this sequence.
   *
   * @returns A formatted string showing the correlation status and token lists.
   */
  toString(): string {
    const lines: string[] = [];
    lines.push('CorrelatedSequence =====');
    lines.push('  CorrelatedItem =====');
    lines.push(`    correlationStatus: ${this.correlationStatus}`);
    if (this.correlationStatus === CorrelationStatus.Equal) {
      lines.push('    ComparisonUnitList =====');
      if (this.comparisonUnitList1) {
        for (const c of this.comparisonUnitList1) {
          lines.push(c.toFormattedString(6));
        }
      }
    } else {
      if (this.comparisonUnitList1) {
        lines.push('    ComparisonUnitList1 =====');
        for (const c of this.comparisonUnitList1) {
          lines.push(c.toFormattedString(6));
        }
      }
      if (this.comparisonUnitList2) {
        lines.push('    ComparisonUnitList2 =====');
        for (const c of this.comparisonUnitList2) {
          lines.push(c.toFormattedString(6));
        }
      }
    }
    return lines.join('\n');
  }
}
