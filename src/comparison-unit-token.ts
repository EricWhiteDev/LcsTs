// Copyright (c) Docugami, Inc. All rights reserved.

/**
 * Abstract base class for tokens used in longest-common-subsequence comparison.
 *
 * @remarks
 * Subclass `ComparisonUnitToken` to define how individual tokens are matched.
 * Two built-in implementations are provided:
 * {@link ComparisonUnitTokenString} (exact string equality with bullet-character
 * normalisation) and {@link ComparisonUnitTokenRegex} (regular-expression matching).
 *
 * Each token may carry an optional {@link data} payload that is preserved
 * through comparison but does not affect matching.
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
export abstract class ComparisonUnitToken {
  /** Optional user-defined payload attached to this token. */
  public readonly data: unknown;

  /**
   * Creates a new token with an optional data payload.
   *
   * @param data - Arbitrary data to associate with this token.
   */
  constructor(data?: unknown) {
    this.data = data;
  }

  /**
   * Returns a formatted string representation of this token, indented by the
   * specified number of spaces.
   *
   * @param indent - Number of leading spaces.
   * @returns A formatted, human-readable string.
   */
  abstract toFormattedString(indent: number): string;

  /**
   * Returns a short, unformatted string identifying this token.
   *
   * @returns A concise string label.
   */
  abstract getShortString(): string;

  /**
   * Determines whether this token matches another token.
   *
   * @param other - The token to compare against.
   * @returns `true` if the tokens are considered equivalent.
   */
  abstract isMatch(other: ComparisonUnitToken): boolean;
}
