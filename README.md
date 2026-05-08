# LcsTs — Longest Common Subsequence in TypeScript

LcsTs is a TypeScript implementation of the Longest Common Subsequence (LCS) algorithm. It compares two token sequences and returns correlated subsequences describing which runs are equal, inserted, or deleted.

## Documentation

Full API reference is published at **[ericwhitedev.github.io/LcsTs](https://ericwhitedev.github.io/LcsTs/)**.

To build the documentation locally:

```bash
npm run docs
```

Output is written to `docs/api/`. Open `docs/api/index.html` in a browser.

## Quick Start

```typescript
import { compare, createLcsSettings, CorrelationStatus } from '@ericwhitedev/lcsts';

const result = compare(
  ['the', 'quick', 'brown', 'fox'],
  ['the', 'slow', 'brown', 'dog'],
  createLcsSettings(),
);

for (const seq of result) {
  switch (seq.correlationStatus) {
    case CorrelationStatus.Equal:
      console.log('Equal:', seq.comparisonUnitList1!.map(t => t.getShortString()));
      break;
    case CorrelationStatus.Deleted:
      console.log('Deleted:', seq.comparisonUnitList1!.map(t => t.getShortString()));
      break;
    case CorrelationStatus.Inserted:
      console.log('Inserted:', seq.comparisonUnitList2!.map(t => t.getShortString()));
      break;
  }
}
// Equal:    ['the']
// Deleted:  ['quick']
// Inserted: ['slow']
// Equal:    ['brown']
// Deleted:  ['fox']
// Inserted: ['dog']
```

## Custom Tokens

For advanced matching, subclass `ComparisonUnitToken` or use the built-in `ComparisonUnitTokenRegex`:

```typescript
import {
  ComparisonUnitTokenString,
  ComparisonUnitTokenRegex,
  compare,
  createLcsSettings,
} from '@ericwhitedev/lcsts';

const tokens1 = [
  new ComparisonUnitTokenString('hello'),
  new ComparisonUnitTokenString('42'),
];

const tokens2 = [
  new ComparisonUnitTokenString('hello'),
  new ComparisonUnitTokenRegex(/^\d+$/),
];

const result = compare(tokens1, tokens2, createLcsSettings());
// Both tokens match — 'hello' === 'hello', and '42' matches /^\d+$/
```

## Settings

Use `createLcsSettings()` to get sensible defaults, or pass overrides:

```typescript
const settings = createLcsSettings({
  detailThreshold: 5,
  findCommonAtBeginning: true,
  findCommonAtEnd: true,
});
```

| Setting | Default | Description |
|---|---|---|
| `detailThreshold` | `3` | Minimum common-subsequence length to count as a match |
| `findCommonAtBeginning` | `true` | Look for a common prefix before the full algorithm |
| `findCommonAtBeginningThreshold` | `10` | Minimum prefix length to accept |
| `findCommonAtEnd` | `false` | Look for a common suffix before the full algorithm |
| `findCommonAtEndThreshold` | `10` | Minimum suffix length to accept |
| `fastFindSearchLength` | `12` | Positions to scan during the fast-find optimisation |
| `fastFindSearchMatch` | `6` | Consecutive matches required for fast-find to succeed |

## License

MIT © Eric White
