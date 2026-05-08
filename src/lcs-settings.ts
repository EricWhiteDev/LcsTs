// Copyright (c) Docugami, Inc. All rights reserved.

export interface LcsSettings {
  readonly detailThreshold: number;
  readonly findCommonAtBeginning: boolean;
  readonly findCommonAtBeginningThreshold: number;
  readonly findCommonAtEnd: boolean;
  readonly findCommonAtEndThreshold: number;
  readonly fastFindSearchLength: number;
  readonly fastFindSearchMatch: number;
}

const defaultSettings: LcsSettings = {
  detailThreshold: 3,
  findCommonAtBeginning: true,
  findCommonAtBeginningThreshold: 10,
  findCommonAtEnd: false,
  findCommonAtEndThreshold: 10,
  fastFindSearchLength: 12,
  fastFindSearchMatch: 6,
};

export function createLcsSettings(overrides?: Partial<LcsSettings>): LcsSettings {
  return { ...defaultSettings, ...overrides };
}
