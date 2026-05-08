// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { ComparisonUnitTokenString } from './comparison-unit-token-string';

export class ComparisonUnitTokenRegex extends ComparisonUnitToken {
  public readonly tokenRegex: RegExp;

  constructor(tokenRegex: RegExp, data?: unknown) {
    super(data);
    this.tokenRegex = tokenRegex;
  }

  toFormattedString(indent: number): string {
    return ' '.repeat(indent) + `ComparisonUnitToken: >${this.tokenRegex}<\n`;
  }

  getShortString(): string {
    return 'Regex:' + this.tokenRegex.toString();
  }

  isMatch(other: ComparisonUnitToken): boolean {
    if (other == null) {
      return false;
    }
    if (other instanceof ComparisonUnitTokenString) {
      return this.tokenRegex.test(other.tokenString);
    }
    throw new Error(`Cannot compare ${this.getShortString()} and ${other.getShortString()}`);
  }
}
