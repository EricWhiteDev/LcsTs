// Copyright (c) Docugami, Inc. All rights reserved.

/**
 * Describes the relationship between two subsequences after comparison.
 *
 * @remarks
 * Each {@link CorrelatedSequence} carries a `CorrelationStatus` that indicates
 * whether its tokens were found in both inputs ({@link Equal}), only in the
 * first input ({@link Deleted}), only in the second input ({@link Inserted}),
 * or have not yet been classified ({@link Unknown}).
 *
 * @category Class and Type Reference
 */
export enum CorrelationStatus {
  /** The subsequence has not yet been classified by the algorithm. */
  Unknown = 'Unknown',
  /** The subsequence exists only in the second token list. */
  Inserted = 'Inserted',
  /** The subsequence exists only in the first token list. */
  Deleted = 'Deleted',
  /** The subsequence is common to both token lists. */
  Equal = 'Equal',
}
