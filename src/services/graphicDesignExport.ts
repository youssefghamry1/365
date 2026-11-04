import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { ClientProfile } from '../types';
import { GeneratedDesignPromptItem } from '../types/graphicDesign';
import { downloadBlob } from './zipExport';

export { downloadBlob };

/**
 * Build 2D array representing the 15 required columns for Graphic Designs
 */
export function buildDesignExportRows(items: GeneratedDesignPromptItem[], client: ClientProfile) {
  const headers = [
    'رقم التصميم (Design #)',
    'التصنيف (Category)',
    'اسم التصميم (Design Name)',
    'اسم العميل (Client Name)',
    'الهدف من التصميم (Design Objective)',
    'المقاس والنسبة (Dimensions & Ratio)',
    'المحتوى النصي المقترح (Text Content)',
    'الألوان وأكوادها (Color Palette HEX)',
    'الخطوط (Typography)',
    'الوصف البصري والنمط (Visual Style)',
    'البرومبت النهائي بالإنجليزية (Final AI Prompt)',
    'ترجمة وشرح البرومبت بالعربية (Arabic Translation)',
    'Negative Prompt (البرومبت السلبي)',
    'تعليمات المصمم الجرافيكي (Designer Instructions)',
    'حالة التصميم (Design Status)',
  ];

  const rows = items.map((item) => {
    const textFormatted = `العنوان: ${item.textContent.headline} | الفرعي: ${item.textContent.subheadline} | الخدمات: ${item.textContent.featuredOfferOrServices} | CTA: ${item.textContent.callToAction} | التواصل: ${item.textContent.contactData}`;
    const colorsFormatted = `أساسي: ${client.primaryColor} | ثانوي: ${client.secondaryColor} | تمييز: ${client.accentColor} | خلفية: ${client.backgroundColor}`;

    return [
      item.template.number,
      item.template.category,
      item.template.nameAr,
      client.companyName || 'العميل',
      item.template.goalAr,
      `${item.customizedDimensions} (${item.template.aspectRatio})`,
      textFormatted,
      colorsFormatted,
      client.typography || 'Cairo, Montserrat',
      item.visualStyle,
      item.finalEnglishPrompt,
      item.arabicExplanation,
      item.negativePrompt,
      item.designerInstructions,
      item.status,
    ];
  });

  return [headers, ...rows];
}

/**
 * Export selected graphic designs to Excel (.xlsx)
 */
export function exportDesignsToExcel(
  items: GeneratedDesignPromptItem[],
  client: ClientProfile,
  fileName: string = 'تصميمات_الهوية_البصرية_وبرومبتات_الجرافيك.xlsx'
) {
  const data = buildDesignExportRows(items, client);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 10 }, // Number
    { wch: 22 }, // Category
    { wch: 32 }, // Design Name
    { wch: 25 }, // Client Name
    { wch: 40 }, // Goal
    { wch: 28 }, // Dims
    { wch: 55 }, // Text
    { wch: 38 }, // Colors
    { wch: 22 }, // Fonts
    { wch: 40 }, // Style
    { wch: 65 }, // Final AI Prompt
    { wch: 50 }, // Arabic Trans
    { wch: 35 }, // Negative
    { wch: 45 }, // Designer
    { wch: 18 }, // Status
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Graphic Designs');
  XLSX.writeFile(wb, fileName);
}

/**
 * Export selected designs to CSV
 */
export function exportDesignsToCsv(
  items: GeneratedDesignPromptItem[],
  client: ClientProfile,
  fileName: string = 'تصميمات_الهوية_البصرية.csv'
) {
  const data = buildDesignExportRows(items, client);
  const csvContent = data
    .map((row) =>
      row
        .map((val) => {
          const stringVal = String(val ?? '');
          return `"${stringVal.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, fileName);
}

/**
 * Export designs to clean formatted Plain Text (.txt)
 */
export function generateDesignsPlainText(items: GeneratedDesignPromptItem[], client: ClientProfile): string {
  let output = `================================================================================
مكتبة برومبتات وتصميمات الهوية البصرية والجرافيك (${items.length} تصميم)
الشركة: ${client.companyName || 'العميل'} | المجال: ${client.industry || 'المجال'}
================================================================================\n\n`;

  items.forEach((item) => {
    output += `--------------------------------------------------------------------------------\n`;
    output += `[#${item.template.number}] ${item.template.nameAr} (${item.template.nameEn})\n`;
    output += `التصنيف: ${item.template.category} | المقاس: ${item.customizedDimensions} (${item.template.aspectRatio})\n`;
    output += `الهدف: ${item.template.goalAr}\n`;
    output += `الألوان: أساسي (${client.primaryColor})، ثانوي (${client.secondaryColor})، تمييز (${client.accentColor})\n`;
    output += `المحتوى النصي:\n  - العنوان: ${item.textContent.headline}\n  - الفرعي: ${item.textContent.subheadline}\n  - الخدمات: ${item.textContent.featuredOfferOrServices}\n  - الإجراء (CTA): ${item.textContent.callToAction}\n  - التواصل: ${item.textContent.contactData}\n\n`;
    output += `البرومبت النهائي بالإنجليزية (Ready for AI Generator):\n"""\n${item.finalEnglishPrompt}\n"""\n\n`;
    output += `البرومبت السلبي (Negative Prompt):\n${item.negativePrompt}\n\n`;
    output += `تعليمات المصمم الجرافيكي:\n${item.designerInstructions}\n\n`;
  });

  return output;
}

/**
 * Export designs to Rich Word Document (.doc)
 */
export function generateDesignsWordHtml(items: GeneratedDesignPromptItem[], client: ClientProfile): string {
  let html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>تصميمات الهوية البصرية - ${client.companyName || 'العميل'}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; margin: 30px; background-color: #fff; color: #1e293b; line-height: 1.6; }
  .header { background: #0f172a; color: #fff; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
  .header h1 { margin: 0 0 8px 0; font-size: 24pt; color: #f8fafc; }
  .header p { margin: 0; color: #38bdf8; font-size: 12pt; }
  .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 25px; background-color: #f8fafc; page-break-inside: avoid; }
  .badge { display: inline-block; background: #0284c7; color: #fff; padding: 3px 10px; border-radius: 10px; font-size: 9pt; font-weight: bold; }
  .title { font-size: 15pt; color: #0f172a; margin: 8px 0 12px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  .prompt-box { background: #0f172a; color: #fef08a; padding: 14px; border-radius: 6px; font-family: Consolas, monospace; font-size: 10pt; line-height: 1.5; direction: ltr; text-align: left; margin: 12px 0; white-space: pre-wrap; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt; }
  td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; }
  .lbl { font-weight: bold; width: 22%; color: #475569; }
</style>
</head>
<body>
<div class="header">
  <h1>ملف مواصفات وبرومبتات الهوية البصرية والتصميمات الجرافيكية</h1>
  <p>مخصص لشركة: <strong>${client.companyName || 'العميل'}</strong> | المجال: ${client.industry || 'المجال'}</p>
</div>
`;

  items.forEach((item) => {
    html += `
<div class="card">
  <span class="badge">#${item.template.number} | ${item.template.category}</span>
  <h2 class="title">${item.template.nameAr} (${item.template.nameEn})</h2>
  <table>
    <tr><td class="lbl">الهدف التسويقي:</td><td>${item.template.goalAr}</td></tr>
    <tr><td class="lbl">المقاس والاستخدام:</td><td>${item.customizedDimensions} (${item.template.aspectRatio}) | نظام: ${item.template.colorMode}</td></tr>
    <tr><td class="lbl">الألوان المعتمدة:</td><td>أساسي (${client.primaryColor})، ثانوي (${client.secondaryColor})، تمييز (${client.accentColor})</td></tr>
    <tr><td class="lbl">المحتوى النصي:</td><td><strong>${item.textContent.headline}</strong> - ${item.textContent.subheadline} | ${item.textContent.featuredOfferOrServices}</td></tr>
    <tr><td class="lbl">تعليمات المصمم:</td><td>${item.designerInstructions}</td></tr>
  </table>
  <h4 style="margin: 8px 0 4px 0; color: #0f172a;">البرومبت النهائي بالإنجليزية (Ready for AI Generator):</h4>
  <div class="prompt-box">${escapeHtml(item.finalEnglishPrompt)}</div>
</div>
`;
  });

  html += `</body></html>`;
  return html;
}

/**
 * Generate full ZIP package for Graphic Designs
 */
export async function downloadGraphicDesignsZip(
  items: GeneratedDesignPromptItem[],
  client: ClientProfile,
  zipFileName: string = 'حزمة_تصميمات_الهوية_البصرية.zip'
): Promise<void> {
  const zip = new JSZip();

  // 1. Excel File (.xlsx)
  const data = buildDesignExportRows(items, client);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 10 }, { wch: 22 }, { wch: 32 }, { wch: 25 }, { wch: 40 },
    { wch: 28 }, { wch: 55 }, { wch: 38 }, { wch: 22 }, { wch: 40 },
    { wch: 65 }, { wch: 50 }, { wch: 35 }, { wch: 45 }, { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Graphic Designs');
  const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  zip.file('تصميمات_الهوية_البصرية_وبرومبتات_الجرافيك.xlsx', excelArray);

  // 2. CSV File (.csv)
  const csvContent = data
    .map((row) =>
      row
        .map((val) => {
          const s = String(val ?? '');
          return `"${s.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\r\n');
  zip.file('تصميمات_الهوية_البصرية.csv', '\ufeff' + csvContent);

  // 3. Plain Text File (.txt)
  const txtContent = generateDesignsPlainText(items, client);
  zip.file('مكتبة_برومبتات_التصميمات.txt', '\ufeff' + txtContent);

  // 4. Word Document (.doc)
  const wordContent = generateDesignsWordHtml(items, client);
  zip.file('دليل_مواصفات_التصميمات_للمصممين.doc', '\ufeff' + wordContent);

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  downloadBlob(zipBlob, zipFileName);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
