// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { CorrelationStatus } from './correlation-status';

export class CorrelatedSequence {
  public readonly correlationStatus: CorrelationStatus;
  public readonly comparisonUnitList1: readonly ComparisonUnitToken[] | null;
  public readonly comparisonUnitList2: readonly ComparisonUnitToken[] | null;

  constructor(
    comparisonUnitList1: readonly ComparisonUnitToken[] | null,
    comparisonUnitList2: readonly ComparisonUnitToken[] | null,
    correlationStatus: CorrelationStatus,
  ) {
    this.correlationStatus = correlationStatus;
    this.comparisonUnitList1 = comparisonUnitList1;
    this.comparisonUnitList2 = comparisonUnitList2;
  }

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
