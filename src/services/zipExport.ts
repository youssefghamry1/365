import JSZip from 'jszip';
import { CalendarDayRow, ClientProfile } from '../types';
import { getCalendarExcelBuffer } from './excelExport';
import {
  generatePromptsPlainText,
  generatePromptsWordHtml,
  generateUserGuideMarkdown,
} from './docExport';

/**
 * Trigger a browser file download from Blob
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download complete delivery ZIP file containing:
 * 1. Excel (.xlsx) with Sheet 1 (365 days) and Sheet 2 (Client Profile)
 * 2. Word (.doc) with Master Prompts Library
 * 3. Text (.txt) with Master Prompts Library
 * 4. User Guide (.md) with instructions
 */
export async function downloadFullSystemZip(
  rows: CalendarDayRow[],
  client: ClientProfile,
  zipFileName: string = 'حزمة_نظام_إنتاج_365_بوست_مصر.zip'
): Promise<void> {
  const zip = new JSZip();

  // 1. Generate Excel binary buffer
  const excelBuffer = getCalendarExcelBuffer(rows, client);
  zip.file('تقويم_المحتوى_المصري_365_يوم.xlsx', excelBuffer);

  // 2. Generate Word document (.doc)
  const wordContent = generatePromptsWordHtml(client);
  zip.file('مكتبة_البرومبتات_الأساسية_العشرة.doc', '\ufeff' + wordContent, {
    binary: false,
  });

  // 3. Generate TXT document (.txt)
  const txtContent = generatePromptsPlainText(client);
  zip.file('مكتبة_البرومبتات_الأساسية.txt', '\ufeff' + txtContent, {
    binary: false,
  });

  // 4. Generate User Guide (.md)
  const guideContent = generateUserGuideMarkdown(client);
  zip.file('دليل_الاستخدام_والتشغيل.md', '\ufeff' + guideContent, {
    binary: false,
  });

  // Generate ZIP file blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  // Trigger download
  downloadBlob(zipBlob, zipFileName);
}

/**
 * Download individual files helper
 */
export function downloadSingleFile(
  type: 'word' | 'txt' | 'guide',
  client: ClientProfile
) {
  if (type === 'word') {
    const content = generatePromptsWordHtml(client);
    const blob = new Blob(['\ufeff' + content], {
      type: 'application/msword;charset=utf-8',
    });
    downloadBlob(blob, 'مكتبة_البرومبتات_الأساسية_العشرة.doc');
  } else if (type === 'txt') {
    const content = generatePromptsPlainText(client);
    const blob = new Blob(['\ufeff' + content], {
      type: 'text/plain;charset=utf-8',
    });
    downloadBlob(blob, 'مكتبة_البرومبتات_الأساسية.txt');
  } else if (type === 'guide') {
    const content = generateUserGuideMarkdown(client);
    const blob = new Blob(['\ufeff' + content], {
      type: 'text/markdown;charset=utf-8',
    });
    downloadBlob(blob, 'دليل_الاستخدام_والتشغيل.md');
  }
}
