import { describe, it, expect } from 'vitest';
import { compare, createLcsSettings, CorrelationStatus } from '../src/index';

function tokenize(input: string): string[] {
  return input.match(/\w+|[^\w\s]/g) ?? [];
}

describe('Lcs', () => {
  it.each([
    {
      testId: '010001',
      before: 'This is a test.',
      after: 'This is test.',
      detailThreshold: 1,
      expectedInserted: 0,
      expectedDeleted: 1,
    },
    {
      testId: '010002',
      before: 'This is test.',
      after: 'This is a test.',
      detailThreshold: 1,
      expectedInserted: 1,
      expectedDeleted: 0,
    },
    {
      testId: '010003',
      before: 'Video provides a powerful way. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document.',
      after: 'Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. Type a keyword to search online for the video that best fits your document.',
      detailThreshold: 1,
      expectedInserted: 2,
      expectedDeleted: 1,
    },
    {
      testId: '010004',
      before: 'Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document.',
      after: 'Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document.',
      detailThreshold: 1,
      expectedInserted: 0,
      expectedDeleted: 0,
    },
    {
      testId: '010005',
      before: 'Video provides a powerful way to help 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document. To make your document look professionally produced, Word provides header, footer, cover page, and text box designs that complement each other. For example, you can add a matching cover page, header, and sidebar. Click Insert and then choose the elements you want from the different galleries. Themes and styles also help keep your document coordinated. When you click Design and choose a new Theme, the pictures, charts, and SmartArt graphics change to match your new theme. When you apply styles, your headings change to match the new theme. 1000 1010 1020 1030 1040 1050 1060 1070 1080 1090 1100 1110 1120 1130 1140 1150 Save time in Word with new buttons that show up where you need them.',
      after: 'Video provides a powerful way to help 200 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document. To make your document look professionally produced, Word provides header, footer, cover page, and text box designs that complement each other. For example, you can add a matching cover page, header, and sidebar. Click Insert and then choose the elements you want from the different galleries. Themes and styles also help keep your document coordinated. When you click Design and choose a new Theme, the pictures, charts, and SmartArt graphics change to match your new theme. When you apply styles, your headings change 2000 2010 2020 2030 2040 2050 2060 2070 2080 2090 2100 2110 2120 2130 2140 2150 to match the new theme. Save time in Word with new buttons that show up where you need them.',
      detailThreshold: 1,
      expectedInserted: 2,
      expectedDeleted: 2,
    },
    {
      testId: '010006',
      before: 'Video provides a powerful way to help 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 you prove your point. When you click Online xxx Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document. To make your document look professionally produced, Word provides header, footer, cover page, and text box designs that complement each other. For example, you can add a matching cover page, header, and sidebar. Click Insert and then choose the elements you want from the different galleries. Themes and styles also help keep your document coordinated. When you click Design and choose a new Theme, the pictures, charts, and SmartArt graphics change to match your new theme. When you apply styles, your headings change to match the new theme. 1000 1010 1020 1030 1040 1050 1060 1070 1080 1090 1100 1110 1120 1130 1140 1150 Save time in Word with new buttons that show up where you need them.',
      after: 'Video provides a powerful way to help 200 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 you prove your point. When you click Online Video, you yyy can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document. To make your document look professionally produced, Word provides header, footer, cover page, and text box designs that complement each other. For example, you can add a matching cover page, header, and sidebar. Click Insert and then choose the elements you want from the different galleries. Themes and styles also help keep your document coordinated. When you click Design and choose a new Theme, the pictures, charts, and SmartArt graphics change to match your new theme. When you apply styles, your headings change 2000 2010 2020 2030 2040 2050 2060 2070 2080 2090 2100 2110 2120 2130 2140 2150 to match the new theme. Save time in Word with new buttons that show up where you need them.',
      detailThreshold: 1,
      expectedInserted: 3,
      expectedDeleted: 3,
    },
  ])('$testId', ({ before, after, detailThreshold, expectedInserted, expectedDeleted }) => {
    const settings = createLcsSettings({ detailThreshold });
    const beforeTokens = tokenize(before);
    const afterTokens = tokenize(after);
    const result = compare(beforeTokens, afterTokens, settings);

    const insertedCount = result.filter(r => r.correlationStatus === CorrelationStatus.Inserted).length;
    const deletedCount = result.filter(r => r.correlationStatus === CorrelationStatus.Deleted).length;

    expect(insertedCount).toBe(expectedInserted);
    expect(deletedCount).toBe(expectedDeleted);
  });
});
