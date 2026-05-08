// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { ComparisonUnitTokenRegex } from './comparison-unit-token-regex';

const bulletConversionMap = new Map<string, string>([
  ['\uf0b7', '\u2022'],
  ['\uf0d8', '\u27a2'],
  ['\uf0a7', '\u25aa'],
  ['\uf076', '\u2756'],
  ['\uf0fc', '\u2713'],
]);

export class ComparisonUnitTokenString extends ComparisonUnitToken {
  public readonly tokenString: string;

  constructor(tokenString: string, data?: unknown) {
    super(data);
    this.tokenString = tokenString;
  }

  toFormattedString(indent: number): string {
    return ' '.repeat(indent) + `ComparisonUnitToken: >${this.tokenString}<\n`;
  }

  getShortString(): string {
    return this.tokenString;
  }

  isMatch(other: ComparisonUnitToken): boolean {
    if (other == null) {
      return false;
    }
    if (other instanceof ComparisonUnitTokenString) {
      if (this.tokenString.length !== 1 || other.tokenString.length !== 1) {
        return this.tokenString === other.tokenString;
      }
      const leftChar = this.tokenString[0];
      const rightChar = other.tokenString[0];
      if (leftChar === rightChar) {
        return true;
      }
      const converted = bulletConversionMap.get(leftChar);
      if (converted !== undefined) {
        return converted === rightChar;
      }
      return false;
    }
    if (other instanceof ComparisonUnitTokenRegex) {
      return other.tokenRegex.test(this.tokenString);
    }
    throw new Error(`Cannot compare ${this.getShortString()} and ${other.getShortString()}`);
  }
}
