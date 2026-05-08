// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { ComparisonUnitTokenRegex } from './comparison-unit-token-regex';

/** @internal */
const bulletConversionMap = new Map<string, string>([
  ['\uf0b7', '\u2022'],
  ['\uf0d8', '\u27a2'],
  ['\uf0a7', '\u25aa'],
  ['\uf076', '\u2756'],
  ['\uf0fc', '\u2713'],
]);

/**
 * A {@link ComparisonUnitToken} that matches by string equality.
 *
 * @remarks
 * Two `ComparisonUnitTokenString` instances match when their
 * {@link tokenString} values are identical. For single-character strings,
 * private-use-area bullet characters (e.g. `\uF0B7`) are normalised to their
 * Unicode equivalents (e.g. `\u2022`) before comparison.
 *
 * When compared against a {@link ComparisonUnitTokenRegex}, the regex is
 * tested against this token's string.
 *
 * @example
 * ```typescript
 * const a = new ComparisonUnitTokenString('hello');
 * const b = new ComparisonUnitTokenString('hello');
 * console.log(a.isMatch(b)); // true
 * ```
 *
 * @category Class and Type Reference
 */
export class ComparisonUnitTokenString extends ComparisonUnitToken {
  /** The string value of this token. */
  public readonly tokenString: string;

  /**
   * Creates a new string-based comparison token.
   *
   * @param tokenString - The string value for this token.
   * @param data - Optional user-defined payload.
   */
  constructor(tokenString: string, data?: unknown) {
    super(data);
    this.tokenString = tokenString;
  }

  /**
   * Returns a formatted string representation of this token.
   *
   * @param indent - Number of leading spaces.
   * @returns A formatted, human-readable string.
   */
  toFormattedString(indent: number): string {
    return ' '.repeat(indent) + `ComparisonUnitToken: >${this.tokenString}<\n`;
  }

  /**
   * Returns the raw token string.
   *
   * @returns The {@link tokenString} value.
   */
  getShortString(): string {
    return this.tokenString;
  }

  /**
   * Determines whether this token matches another token.
   *
   * @remarks
   * Matching rules depend on the type of `other`:
   * - {@link ComparisonUnitTokenString}: exact string equality, with
   *   single-character bullet normalisation.
   * - {@link ComparisonUnitTokenRegex}: tests the regex against this
   *   token's string.
   *
   * @param other - The token to compare against.
   * @returns `true` if the tokens are considered equivalent.
   * @throws Error if `other` is an unsupported token type.
   */
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
