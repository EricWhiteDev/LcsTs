// Copyright (c) Docugami, Inc. All rights reserved.

import { ComparisonUnitToken } from './comparison-unit-token';
import { ComparisonUnitTokenString } from './comparison-unit-token-string';
import { CorrelatedSequence } from './correlated-sequence';
import { CorrelationStatus } from './correlation-status';
import { LcsSettings } from './lcs-settings';

export function compare(
  tokens1: string[],
  tokens2: string[],
  settings: LcsSettings,
): readonly CorrelatedSequence[];
export function compare(
  tokens1: ComparisonUnitToken[],
  tokens2: ComparisonUnitToken[],
  settings: LcsSettings,
): readonly CorrelatedSequence[];
export function compare(
  tokens1: string[] | ComparisonUnitToken[],
  tokens2: string[] | ComparisonUnitToken[],
  settings: LcsSettings,
): readonly CorrelatedSequence[] {
  if (tokens1.length > 0 && typeof tokens1[0] === 'string') {
    const t1 = (tokens1 as string[]).map(t => new ComparisonUnitTokenString(t));
    const t2 = (tokens2 as string[]).map(t => new ComparisonUnitTokenString(t));
    return compareTokens(t1, t2, settings);
  }
  return compareTokens(
    tokens1 as ComparisonUnitToken[],
    tokens2 as ComparisonUnitToken[],
    settings,
  );
}

function compareTokens(
  tokens1: ComparisonUnitToken[],
  tokens2: ComparisonUnitToken[],
  settings: LcsSettings,
): readonly CorrelatedSequence[] {
  let correlatedSequenceList: CorrelatedSequence[] = [
    new CorrelatedSequence(
      [...tokens1],
      [...tokens2],
      CorrelationStatus.Unknown,
    ),
  ];

  while (true) {
    const unknownIndex = correlatedSequenceList.findIndex(
      c => c.correlationStatus === CorrelationStatus.Unknown,
    );

    if (unknownIndex === -1) {
      return correlatedSequenceList;
    }

    const unknown = correlatedSequenceList[unknownIndex];

    const commonBeginningEndSequence = findCommonAtBeginningAndEnd(unknown, settings);
    if (commonBeginningEndSequence !== null) {
      correlatedSequenceList = localSplice(correlatedSequenceList, unknownIndex, commonBeginningEndSequence);
      continue;
    }

    const lcsSequence = doLcsAlgorithm(unknown, settings);
    if (lcsSequence !== null) {
      correlatedSequenceList = localSplice(correlatedSequenceList, unknownIndex, lcsSequence);
      continue;
    }

    break;
  }

  return correlatedSequenceList;
}

function doLcsAlgorithm(
  unknown: CorrelatedSequence,
  settings: LcsSettings,
): CorrelatedSequence[] | null {
  const list1 = unknown.comparisonUnitList1 as ComparisonUnitToken[];
  const list2 = unknown.comparisonUnitList2 as ComparisonUnitToken[];

  if (list1.length > 0 && list2.length === 0) {
    return [new CorrelatedSequence(list1, null, CorrelationStatus.Deleted)];
  }
  if (list1.length === 0 && list2.length > 0) {
    return [new CorrelatedSequence(null, list2, CorrelationStatus.Inserted)];
  }
  if (list1.length === 0 && list2.length === 0) {
    return [];
  }

  const fastFindSequence = doFastFind(list1, list2, unknown, settings);
  if (fastFindSequence !== null) {
    return fastFindSequence;
  }

  let bestLength = 0;
  let bestI1 = -1;
  let bestI2 = -1;

  for (let i1 = 0; i1 < list1.length - bestLength; i1++) {
    for (let i2 = 0; i2 < list2.length - bestLength; i2++) {
      let length = 0;
      let testI1 = i1;
      let testI2 = i2;
      while (true) {
        if (list1[testI1].isMatch(list2[testI2])) {
          testI1++;
          testI2++;
          length++;
          if (testI1 === list1.length || testI2 === list2.length) {
            if (length > bestLength) {
              bestLength = length;
              bestI1 = i1;
              bestI2 = i2;
            }
            break;
          }
          continue;
        } else {
          if (length > bestLength) {
            bestLength = length;
            bestI1 = i1;
            bestI2 = i2;
          }
          break;
        }
      }
    }
  }

  if (bestLength < settings.detailThreshold) {
    bestLength = 0;
  }

  if (bestLength > 0) {
    return createReplacementCorrelatedSequencesFromUnknown(bestI1, bestI2, bestLength, unknown);
  }

  // No common sequence found — mark as deleted + inserted
  return [
    new CorrelatedSequence(unknown.comparisonUnitList1, null, CorrelationStatus.Deleted),
    new CorrelatedSequence(null, unknown.comparisonUnitList2, CorrelationStatus.Inserted),
  ];
}

function doFastFind(
  list1: ComparisonUnitToken[],
  list2: ComparisonUnitToken[],
  unknown: CorrelatedSequence,
  settings: LcsSettings,
): CorrelatedSequence[] | null {
  let fastFindPosition1 = -1;
  let fastFindPosition2 = -1;
  let deepBreak = false;

  const searchUpTo1 = Math.min(list1.length, settings.fastFindSearchLength);
  const searchUpTo2 = Math.min(list2.length, settings.fastFindSearchLength);

  for (let fastI1 = 0; fastI1 < searchUpTo1; fastI1++) {
    for (let fastI2 = 0; fastI2 < searchUpTo2; fastI2++) {
      let countCommon = 0;
      const maxCheck = Math.min(
        settings.fastFindSearchMatch,
        list1.length - fastI1,
        list2.length - fastI2,
      );
      for (let k = 0; k < maxCheck; k++) {
        if (list1[fastI1 + k].isMatch(list2[fastI2 + k])) {
          countCommon++;
        } else {
          break;
        }
      }

      if (countCommon === settings.fastFindSearchMatch) {
        fastFindPosition1 = fastI1;
        fastFindPosition2 = fastI2;
        deepBreak = true;
        break;
      }
    }
    if (deepBreak) {
      break;
    }
  }

  if (fastFindPosition1 !== -1) {
    let sequenceLength = 0;
    let pos1 = fastFindPosition1;
    let pos2 = fastFindPosition2;
    while (true) {
      if (!list1[pos1].isMatch(list2[pos2])) {
        break;
      }
      sequenceLength++;
      pos1++;
      pos2++;
      if (pos1 === list1.length || pos2 === list2.length) {
        break;
      }
    }

    if (sequenceLength > settings.detailThreshold) {
      return createReplacementCorrelatedSequencesFromUnknown(
        fastFindPosition1, fastFindPosition2, sequenceLength, unknown,
      );
    }
  }

  return null;
}

function createReplacementCorrelatedSequencesFromUnknown(
  startOfCommon1: number,
  startOfCommon2: number,
  lengthOfCommon: number,
  unknown: CorrelatedSequence,
): CorrelatedSequence[] {
  const list1 = unknown.comparisonUnitList1!;
  const list2 = unknown.comparisonUnitList2!;
  const result: CorrelatedSequence[] = [];

  if (startOfCommon1 !== 0 || startOfCommon2 !== 0) {
    result.push(new CorrelatedSequence(
      list1.slice(0, startOfCommon1),
      list2.slice(0, startOfCommon2),
      CorrelationStatus.Unknown,
    ));
  }

  result.push(new CorrelatedSequence(
    list1.slice(startOfCommon1, startOfCommon1 + lengthOfCommon),
    list2.slice(startOfCommon2, startOfCommon2 + lengthOfCommon),
    CorrelationStatus.Equal,
  ));

  if (
    startOfCommon1 + lengthOfCommon < list1.length ||
    startOfCommon2 + lengthOfCommon < list2.length
  ) {
    result.push(new CorrelatedSequence(
      list1.slice(startOfCommon1 + lengthOfCommon),
      list2.slice(startOfCommon2 + lengthOfCommon),
      CorrelationStatus.Unknown,
    ));
  }

  return result;
}

function localSplice(
  list: CorrelatedSequence[],
  index: number,
  newSequence: CorrelatedSequence[],
): CorrelatedSequence[] {
  return [
    ...list.slice(0, index),
    ...newSequence,
    ...list.slice(index + 1),
  ];
}

function findCommonAtBeginningAndEnd(
  unknown: CorrelatedSequence,
  settings: LcsSettings,
): CorrelatedSequence[] | null {
  const list1 = unknown.comparisonUnitList1!;
  const list2 = unknown.comparisonUnitList2!;
  const lengthToCompare = Math.min(list1.length, list2.length);

  if (settings.findCommonAtBeginning) {
    let countCommonAtBeginning = 0;
    for (let i = 0; i < lengthToCompare; i++) {
      if (list1[i].isMatch(list2[i])) {
        countCommonAtBeginning++;
      } else {
        break;
      }
    }

    if (countCommonAtBeginning < settings.findCommonAtBeginningThreshold) {
      countCommonAtBeginning = 0;
    }

    if (countCommonAtBeginning !== 0) {
      const result: CorrelatedSequence[] = [];

      result.push(new CorrelatedSequence(
        list1.slice(0, countCommonAtBeginning),
        list2.slice(0, countCommonAtBeginning),
        CorrelationStatus.Equal,
      ));

      const remainingLeft = list1.length - countCommonAtBeginning;
      const remainingRight = list2.length - countCommonAtBeginning;

      if (remainingLeft !== 0 || remainingRight !== 0) {
        result.push(new CorrelatedSequence(
          list1.slice(countCommonAtBeginning),
          list2.slice(countCommonAtBeginning),
          CorrelationStatus.Unknown,
        ));
      }

      return result;
    }
  }

  if (settings.findCommonAtEnd) {
    let countCommonAtEnd = 0;
    for (let i = 0; i < lengthToCompare; i++) {
      if (list1[list1.length - 1 - i].isMatch(list2[list2.length - 1 - i])) {
        countCommonAtEnd++;
      } else {
        break;
      }
    }

    if (countCommonAtEnd < settings.findCommonAtEndThreshold) {
      countCommonAtEnd = 0;
    }

    if (countCommonAtEnd !== 0) {
      const result: CorrelatedSequence[] = [];

      const remainingLeft = list1.length - countCommonAtEnd;
      const remainingRight = list2.length - countCommonAtEnd;

      if (remainingLeft !== 0 || remainingRight !== 0) {
        result.push(new CorrelatedSequence(
          list1.slice(0, remainingLeft),
          list2.slice(0, remainingRight),
          CorrelationStatus.Unknown,
        ));
      }

      result.push(new CorrelatedSequence(
        list1.slice(remainingLeft),
        list2.slice(remainingRight),
        CorrelationStatus.Equal,
      ));

      return result;
    }
  }

  return null;
}
