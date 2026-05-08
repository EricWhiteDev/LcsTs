// Copyright (c) Docugami, Inc. All rights reserved.

/**
 * Configuration options for the LCS comparison algorithm.
 *
 * @remarks
 * These settings control the behaviour of the {@link compare} function,
 * including optimisation thresholds and edge-case handling. Use
 * {@link createLcsSettings} to create an instance with sensible defaults.
 *
 * @category Class and Type Reference
 */
export interface LcsSettings {
  /** Minimum common-subsequence length to be considered a real match. */
  readonly detailThreshold: number;
  /** Whether to look for a common prefix before running the full algorithm. */
  readonly findCommonAtBeginning: boolean;
  /** Minimum prefix length required to accept a common-beginning match. */
  readonly findCommonAtBeginningThreshold: number;
  /** Whether to look for a common suffix before running the full algorithm. */
  readonly findCommonAtEnd: boolean;
  /** Minimum suffix length required to accept a common-end match. */
  readonly findCommonAtEndThreshold: number;
  /** Number of positions to scan during the fast-find optimisation pass. */
  readonly fastFindSearchLength: number;
  /** Number of consecutive matches required for the fast-find pass to succeed. */
  readonly fastFindSearchMatch: number;
}

/** @internal */
const defaultSettings: LcsSettings = {
  detailThreshold: 3,
  findCommonAtBeginning: true,
  findCommonAtBeginningThreshold: 10,
  findCommonAtEnd: false,
  findCommonAtEndThreshold: 10,
  fastFindSearchLength: 12,
  fastFindSearchMatch: 6,
};

/**
 * Creates an {@link LcsSettings} object, merging any overrides with the
 * built-in defaults.
 *
 * @param overrides - Optional partial settings to override the defaults.
 * @returns A complete {@link LcsSettings} instance.
 *
 * @example
 * ```typescript
 * const settings = createLcsSettings({ detailThreshold: 5 });
 * ```
 */
export function createLcsSettings(overrides?: Partial<LcsSettings>): LcsSettings {
  return { ...defaultSettings, ...overrides };
}
