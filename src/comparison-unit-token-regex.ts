// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { ComparisonUnitTokenString } from './comparison-unit-token-string';

/**
 * A {@link ComparisonUnitToken} that matches using a regular expression.
 *
 * @remarks
 * When compared against a {@link ComparisonUnitTokenString}, the regex stored
 * in {@link tokenRegex} is tested against the other token's string value.
 * Comparing against another `ComparisonUnitTokenRegex` is not supported.
 *
 * @example
 * ```typescript
 * const re = new ComparisonUnitTokenRegex(/^\d+$/);
 * const str = new ComparisonUnitTokenString('42');
 * console.log(re.isMatch(str)); // true
 * ```
 *
 * @category Class and Type Reference
 */
export class ComparisonUnitTokenRegex extends ComparisonUnitToken {
  /** The regular expression used for matching. */
  public readonly tokenRegex: RegExp;

  /**
   * Creates a new regex-based comparison token.
   *
   * @param tokenRegex - The regular expression for this token.
   * @param data - Optional user-defined payload.
   */
  constructor(tokenRegex: RegExp, data?: unknown) {
    super(data);
    this.tokenRegex = tokenRegex;
  }

  /**
   * Returns a formatted string representation of this token.
   *
   * @param indent - Number of leading spaces.
   * @returns A formatted, human-readable string.
   */
  toFormattedString(indent: number): string {
    return ' '.repeat(indent) + `ComparisonUnitToken: >${this.tokenRegex}<\n`;
  }

  /**
   * Returns a short label prefixed with `Regex:`.
   *
   * @returns A concise string identifying this regex token.
   */
  getShortString(): string {
    return 'Regex:' + this.tokenRegex.toString();
  }

  /**
   * Determines whether this regex matches another token.
   *
   * @remarks
   * Only {@link ComparisonUnitTokenString} is supported as a comparison target.
   * The regex is tested against the other token's string value.
   *
   * @param other - The token to compare against.
   * @returns `true` if the regex matches the other token's string.
   * @throws Error if `other` is not a {@link ComparisonUnitTokenString}.
   */
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
