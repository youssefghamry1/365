import * as XLSX from 'xlsx';
import { CalendarDayRow, ClientProfile } from '../types';

/**
 * Generate and download genuine Excel workbook with:
 * Sheet 1: Content Calendar (365 rows, 13 required columns)
 * Sheet 2: Client Profile (all business & visual identity data)
 */
export function exportCalendarToExcel(
  rows: CalendarDayRow[],
  client: ClientProfile,
  fileName: string = 'تقويم_المحتوى_المصري_365_يوم.xlsx'
) {
  const wb = XLSX.utils.book_new();

  // 1. Build Sheet 1: Content Calendar
  // Headers in Arabic and English as specified
  const calendarHeaders = [
    'Day Number (رقم اليوم)',
    'Date (التاريخ)',
    'Weekday (اسم اليوم)',
    'Occasion (المناسبة والحدث)',
    'Occasion Category (تصنيف المناسبة)',
    'Content Idea (فكرة المحتوى)',
    'Content Description (وصف تفصيلي للفكرة)',
    'Company Description (وصف الشركة)',
    'Visual Identity (الهوية البصرية)',
    'Final AI Prompt (البرومبت النهائي المدمج لتوليد الصورة)',
    'Suggested Caption (اقتراح الكابشن)',
    'Marketing Objective (الهدف التسويقي)',
    'Publishing Status (حالة النشر)',
    'Tie-in Method (طريقة ربط الفكرة بمجال العميل)',
  ];

  const calendarData = [
    calendarHeaders,
    ...rows.map((row) => [
      row.dayNumber,
      row.date,
      row.weekday,
      row.occasion,
      row.categoryLabel,
      row.contentIdea,
      row.contentDescription,
      row.companyDescription,
      row.visualIdentity,
      row.finalAiPrompt,
      row.suggestedCaption,
      row.marketingObjective,
      row.publishingStatus,
      row.tieInMethod,
    ]),
  ];

  const wsCalendar = XLSX.utils.aoa_to_sheet(calendarData);

  // Set column widths for comfortable viewing in Excel
  wsCalendar['!cols'] = [
    { wch: 12 }, // Day Number
    { wch: 14 }, // Date
    { wch: 12 }, // Weekday
    { wch: 32 }, // Occasion
    { wch: 24 }, // Category
    { wch: 32 }, // Content Idea
    { wch: 45 }, // Description
    { wch: 35 }, // Company Desc
    { wch: 35 }, // Visual Identity
    { wch: 55 }, // AI Prompt
    { wch: 50 }, // Suggested Caption
    { wch: 25 }, // Objective
    { wch: 20 }, // Status
    { wch: 35 }, // Tie-in
  ];

  // 2. Build Sheet 2: Client Profile
  const clientProfileData = [
    ['عنصر الملف (Field Name)', 'القيمة والمعطيات (Client Data)', 'الوصف والتعليمات (Instructions)'],
    ['اسم الشركة (Company Name)', client.companyName, 'الاسم التجاري الرسمي للشركة أو البراند'],
    ['مجال الشركة (Industry)', client.industry, 'القطاع أو التخصص المهني'],
    ['وصف الخدمات (Services Description)', client.services, 'تفاصيل الخدمات المقدمة للعملاء'],
    ['المنتجات (Products)', client.products, 'المنتجات أو العروض والباقات الأساسية'],
    ['الجمهور المستهدف (Target Audience)', client.targetAudience, 'الشريحة المستهدفة في مصر والقدرة الشرائية'],
    ['الموقع الجغرافي (Geographic Location)', client.location, 'الفروع أو نطاق التغطية والمحافظات'],
    ['نقاط التميز (USPs)', client.usps, 'القيمة الفريدة وما يميز البراند عن المنافسين'],
    ['الهوية البصرية (Visual Identity Style)', client.visualIdentity, 'النمط الفني والتوجه التصميمي المقترح'],
    ['اللون الأساسي (Primary Color)', client.primaryColor, 'كود اللون الأساسي Hex Code'],
    ['اللون الثانوي (Secondary Color)', client.secondaryColor, 'كود اللون الثانوي Hex Code'],
    ['لون التمييز (Accent Color)', client.accentColor, 'كود لون التمييز والجذب Hex Code'],
    ['لون الخلفية (Background Color)', client.backgroundColor, 'كود لون الخلفية العام Hex Code'],
    ['الخطوط المستخدمة (Typography)', client.typography, 'الخطوط العربية والإنجليزية المعتمدة للتصاميم'],
    ['أسلوب التواصل (Tone of Voice)', client.toneOfVoice, 'نبرة الصوت وطريقة التخاطب مع الجمهور المصري'],
    ['الشعار (Logo Instructions)', client.logoInstructions, 'تعليمات وحيز وضع الشعار في التصاميم'],
    ['بيانات التواصل (Contact Info & CTAs)', client.contactData, 'الخط الساخن، واتساب، الروابط، والموقع الإلكتروني'],
    ['الهدف التسويقي (Primary Marketing Goal)', client.marketingGoal, 'الهدف الأساسي للحساب (مبيعات، ثقة، انتشار)'],
    ['الكلمات الممنوعة (Forbidden Words)', client.forbiddenWords, 'الخطوط الحمراء والكلمات المحظور استخدامها'],
    ['تعليمات إضافية (Special Instructions)', client.specialInstructions, 'أي توجيهات استراتيجية أو ملاحظات خاصة'],
  ];

  const wsClient = XLSX.utils.aoa_to_sheet(clientProfileData);
  wsClient['!cols'] = [
    { wch: 35 },
    { wch: 60 },
    { wch: 45 },
  ];

  // Append sheets to workbook
  XLSX.utils.book_append_sheet(wb, wsCalendar, 'Content Calendar');
  XLSX.utils.book_append_sheet(wb, wsClient, 'Client Profile');

  // Trigger browser download
  XLSX.writeFile(wb, fileName);
}

/**
 * Generate Excel binary buffer (for JSZip packing)
 */
export function getCalendarExcelBuffer(
  rows: CalendarDayRow[],
  client: ClientProfile
): Uint8Array {
  const wb = XLSX.utils.book_new();

  const calendarHeaders = [
    'Day Number (رقم اليوم)',
    'Date (التاريخ)',
    'Weekday (اسم اليوم)',
    'Occasion (المناسبة والحدث)',
    'Occasion Category (تصنيف المناسبة)',
    'Content Idea (فكرة المحتوى)',
    'Content Description (وصف تفصيلي للفكرة)',
    'Company Description (وصف الشركة)',
    'Visual Identity (الهوية البصرية)',
    'Final AI Prompt (البرومبت النهائي المدمج لتوليد الصورة)',
    'Suggested Caption (اقتراح الكابشن)',
    'Marketing Objective (الهدف التسويقي)',
    'Publishing Status (حالة النشر)',
    'Tie-in Method (طريقة ربط الفكرة بمجال العميل)',
  ];

  const calendarData = [
    calendarHeaders,
    ...rows.map((row) => [
      row.dayNumber,
      row.date,
      row.weekday,
      row.occasion,
      row.categoryLabel,
      row.contentIdea,
      row.contentDescription,
      row.companyDescription,
      row.visualIdentity,
      row.finalAiPrompt,
      row.suggestedCaption,
      row.marketingObjective,
      row.publishingStatus,
      row.tieInMethod,
    ]),
  ];

  const wsCalendar = XLSX.utils.aoa_to_sheet(calendarData);
  wsCalendar['!cols'] = [
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
    { wch: 32 },
    { wch: 24 },
    { wch: 32 },
    { wch: 45 },
    { wch: 35 },
    { wch: 35 },
    { wch: 55 },
    { wch: 50 },
    { wch: 25 },
    { wch: 20 },
    { wch: 35 },
  ];

  const clientProfileData = [
    ['عنصر الملف (Field Name)', 'القيمة والمعطيات (Client Data)', 'الوصف والتعليمات (Instructions)'],
    ['اسم الشركة (Company Name)', client.companyName, 'الاسم التجاري الرسمي للشركة أو البراند'],
    ['مجال الشركة (Industry)', client.industry, 'القطاع أو التخصص المهني'],
    ['وصف الخدمات (Services Description)', client.services, 'تفاصيل الخدمات المقدمة للعملاء'],
    ['المنتجات (Products)', client.products, 'المنتجات أو العروض والباقات الأساسية'],
    ['الجمهور المستهدف (Target Audience)', client.targetAudience, 'الشريحة المستهدفة في مصر والقدرة الشرائية'],
    ['الموقع الجغرافي (Geographic Location)', client.location, 'الفروع أو نطاق التغطية والمحافظات'],
    ['نقاط التميز (USPs)', client.usps, 'القيمة الفريدة وما يميز البراند عن المنافسين'],
    ['الهوية البصرية (Visual Identity Style)', client.visualIdentity, 'النمط الفني والتوجه التصميمي المقترح'],
    ['اللون الأساسي (Primary Color)', client.primaryColor, 'كود اللون الأساسي Hex Code'],
    ['اللون الثانوي (Secondary Color)', client.secondaryColor, 'كود اللون الثانوي Hex Code'],
    ['لون التمييز (Accent Color)', client.accentColor, 'كود لون التمييز والجذب Hex Code'],
    ['لون الخلفية (Background Color)', client.backgroundColor, 'كود لون الخلفية العام Hex Code'],
    ['الخطوط المستخدمة (Typography)', client.typography, 'الخطوط العربية والإنجليزية المعتمدة للتصاميم'],
    ['أسلوب التواصل (Tone of Voice)', client.toneOfVoice, 'نبرة الصوت وطريقة التخاطب مع الجمهور المصري'],
    ['الشعار (Logo Instructions)', client.logoInstructions, 'تعليمات وحيز وضع الشعار في التصاميم'],
    ['بيانات التواصل (Contact Info & CTAs)', client.contactData, 'الخط الساخن، واتساب، الروابط، والموقع الإلكتروني'],
    ['الهدف التسويقي (Primary Marketing Goal)', client.marketingGoal, 'الهدف الأساسي للحساب (مبيعات، ثقة، انتشار)'],
    ['الكلمات الممنوعة (Forbidden Words)', client.forbiddenWords, 'الخطوط الحمراء والكلمات المحظور استخدامها'],
    ['تعليمات إضافية (Special Instructions)', client.specialInstructions, 'أي توجيهات استراتيجية أو ملاحظات خاصة'],
  ];

  const wsClient = XLSX.utils.aoa_to_sheet(clientProfileData);
  wsClient['!cols'] = [
    { wch: 35 },
    { wch: 60 },
    { wch: 45 },
  ];

  XLSX.utils.book_append_sheet(wb, wsCalendar, 'Content Calendar');
  XLSX.utils.book_append_sheet(wb, wsClient, 'Client Profile');

  const excelOutput = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(excelOutput);
}
