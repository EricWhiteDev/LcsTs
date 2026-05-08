// Copyright (c) Docugami, Inc. All rights reserved.

export abstract class ComparisonUnitToken {
  public readonly data: unknown;

  constructor(data?: unknown) {
    this.data = data;
  }

  abstract toFormattedString(indent: number): string;
  abstract getShortString(): string;
  abstract isMatch(other: ComparisonUnitToken): boolean;
}
