import { MASTER_PROMPTS_LIBRARY } from '../data/promptsLibrary';
import { ClientProfile } from '../types';

/**
 * Generate formatted Plain Text (.txt) of all 10 Master Prompts
 */
export function generatePromptsPlainText(client?: ClientProfile): string {
  let output = `================================================================================
مكتبة البرومبتات الأساسية العشرة لإنتاج وإدارة 365 بوست سوشيال ميديا
نظام تقويم المحتوى المصري السنوي والبرومبتات الذكية المدمجة
================================================================================

`;

  if (client?.companyName) {
    output += `الشركة الحالية المطبقة: ${client.companyName} (${client.industry})\n\n`;
  }

  MASTER_PROMPTS_LIBRARY.forEach((item) => {
    output += `--------------------------------------------------------------------------------\n`;
    output += `[برومبت رقم ${item.number}] : ${item.title}\n`;
    output += `التصنيف: ${item.category} | الهدف: ${item.objective}\n`;
    output += `الأدوات الموصى بها: ${item.targetTools.join(' ، ')}\n`;
    output += `طريقة الاستخدام: ${item.usageInstructions}\n\n`;
    output += `المتغيرات المطلوب تعبئتها:\n`;
    item.inputVariables.forEach((v) => {
      output += `  * ${v.key} : ${v.label} (مثال: ${v.placeholder})\n`;
    });
    output += `\nنص البرومبت للنسخ:\n"""\n${item.promptTemplate}\n"""\n\n`;
  });

  return output;
}

/**
 * Generate Rich Word Document (.doc) content for Master Prompts Library
 */
export function generatePromptsWordHtml(client?: ClientProfile): string {
  const brandTitle = client?.companyName ? ` - ${client.companyName}` : '';

  let html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>مكتبة البرومبتات الأساسية العشرة${brandTitle}</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    direction: rtl;
    text-align: right;
    margin: 40px;
    background-color: #ffffff;
    color: #1e293b;
    line-height: 1.7;
  }
  .header-box {
    background: linear-gradient(135deg, #0f172a, #1e3a8a);
    color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 30px;
    text-align: center;
  }
  .header-box h1 {
    margin: 0 0 10px 0;
    font-size: 26pt;
    color: #f8fafc;
  }
  .header-box p {
    margin: 0;
    font-size: 13pt;
    color: #93c5fd;
  }
  .prompt-card {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 35px;
    background-color: #f8fafc;
    page-break-inside: avoid;
  }
  .prompt-badge {
    display: inline-block;
    background-color: #2563eb;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 10pt;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .prompt-title {
    font-size: 16pt;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
  }
  .meta-table {
    width: 100%;
    margin-bottom: 16px;
    font-size: 10pt;
    border-collapse: collapse;
  }
  .meta-table td {
    padding: 6px 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  .meta-label {
    font-weight: bold;
    color: #475569;
    width: 25%;
  }
  .prompt-box {
    background-color: #ffffff;
    border: 1px solid #94a3b8;
    border-right: 5px solid #2563eb;
    padding: 16px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 11pt;
    white-space: pre-wrap;
    direction: rtl;
    text-align: right;
    color: #0f172a;
    line-height: 1.6;
  }
</style>
</head>
<body>

<div class="header-box">
  <h1>مكتبة البرومبتات الأساسية العشرة</h1>
  <p>نظام إنتاج وإدارة 365 منشور سنوي للسوشيال ميديا بالذكاء الاصطناعي (السوق المصري)</p>
  ${client?.companyName ? `<p style="margin-top:10px; color:#fbbf24;">مخصصة لشركة: <strong>${client.companyName}</strong> (${client.industry})</p>` : ''}
</div>

<p>تحتوي هذه الوثيقة على البرومبتات العشرة الإلزامية لتشغيل نظام إنتاج المحتوى السنوي. تم تصميم هذه البرومبتات لتتوافق بدقة مع نماذج الذكاء الاصطناعي التوليدية المتقدمة (مثل ChatGPT Plus, Gemini 3.8 / Pro, Claude 3.7 Sonnet, Midjourney v6).</p>
`;

  MASTER_PROMPTS_LIBRARY.forEach((item) => {
    html += `
<div class="prompt-card">
  <span class="prompt-badge">برومبت رقم ${item.number} | ${item.category}</span>
  <h2 class="prompt-title">${item.title}</h2>
  
  <table class="meta-table">
    <tr>
      <td class="meta-label">الهدف الاستراتيجي:</td>
      <td>${item.objective}</td>
    </tr>
    <tr>
      <td class="meta-label">الأدوات المناسبة:</td>
      <td>${item.targetTools.join(' • ')}</td>
    </tr>
    <tr>
      <td class="meta-label">إرشادات الاستخدام:</td>
      <td>${item.usageInstructions}</td>
    </tr>
  </table>

  <h4 style="margin: 10px 0 6px 0; color: #1e293b;">نص البرومبت الجاهز للنسخ والتخصيص:</h4>
  <div class="prompt-box">${escapeHtml(item.promptTemplate)}</div>
</div>
`;
  });

  html += `
<div style="text-align:center; font-size:10pt; color:#64748b; margin-top:40px; border-top:1px solid #cbd5e1; padding-top:15px;">
  تم الإنشاء بنجاح بواسطة نظام إنتاج 365 بوست سوشيال ميديا | التقويم المصري الذكي
</div>
</body>
</html>`;

  return html;
}

/**
 * Generate Comprehensive User Guide Markdown (.md)
 */
export function generateUserGuideMarkdown(client?: ClientProfile): string {
  return `# دليل تشغيل واستخدام نظام إنتاج 365 بوست سوشيال ميديا
## التقويم المصري السنوي والأتمتة الذكية للمحتوى والبرومبتات

مرحباً بك في نظامك المتكامل لإنتاج 365 منشوراً سنوياً لمواقع التواصل الاجتماعي في مصر (فيسبوك، إنستجرام، تيك توك، ولينكد إن).

---

## أولاً: محتويات حزمة التسليم

تحتوي هذه الحزمة على الملفات التالية:
1. **ملف الإكسل الأساسي (\`تقويم_المحتوى_المصري_365_يوم.xlsx\`):**
   - **الورقة 1 (Content Calendar):** تحتوي على 365 صفاً مستقلاً، يغطي كل يوم من أيام السنة بالتواريخ، والمناسبات المصرية، وتصنيف المناسبة، وفكرة المحتوى، والوصف، وبرومبت الصورة المدمج، واقتراح الكابشن، والهدف التسويقي، وحالة النشر.
   - **الورقة 2 (Client Profile):** تحتوي على بيانات الشركة، والخدمات، والمنتجات، والجمهور المستهدف، ونقاط التميز، والهوية البصرية بالأكواد HEX، وأسلوب التواصل.
2. **ملف Word لمكتبة البرومبتات (\`مكتبة_البرومبتات_الأساسية_العشرة.doc\`):** يحتوي على البرومبتات الـ 10 الأساسية منسقة بصرياً للطباعة والمشاركة مع فريق العمل.
3. **ملف TXT للبرومبتات (\`مكتبة_البرومبتات_الأساسية.txt\`):** نصوص البرومبتات الـ 10 خام وسريعة للنسخ الفوري.
4. **ملف تعليمات الاستخدام (\`دليل_الاستخدام_والتشغيل.md\`):** هذا الملف الإرشادي التفصيلي.

---

## ثانياً: كيفية استخدام وتخصيص النظام لأي شركة مصرية

### 1. إدخال بيانات العميل مرة واحدة (Client Profile)
- افتح ملف الإكسل وانتقل إلى ورقة **Client Profile**.
- أدخل بيانات الشركة الجديدة (الاسم، المجال، الخدمات، المنتجات، الجمهور، الألوان، أسلوب التواصل).
- بمجرد تغيير هذه البيانات في التطبيق أو الإكسل، يتم تحديث كافة الأوصاف، والكوابشن المقترحة، وبرومبتات الذكاء الاصطناعي لجميع الـ 365 يوماً دون الحاجة لتكرار كتابتها!

### 2. استعراض المناسبات المصرية
يغطي التقويم جميع المناسبات الرسمية والشعبية والدينية في مصر:
- **جميع أيام الجمعة (52 جمعة):** محتوى "جمعة مباركة" دافئ ورسائل إيجابية وسكينة.
- **المناسبات الإسلامية:** شهر رمضان المبارك، ليلة القدر، عيد الفطر، وقفة عرفات، عيد الأضحى، رأس السنة الهجرية، عاشوراء، المولد النبوي الشريف، ليلة الإسراء والمعراج، وليلة النصف من شعبان (تم تمييز التواريخ التقديرية الفلكية بوضوح لتأكيدها مع دار الإفتاء المصرية).
- **المناسبات المسيحية القبطية والغربية:** عيد الميلاد المجيد القبطي (7 يناير)، عيد الغطاس، أحد الشعانين، الجمعة العظيمة، عيد القيامة المجيد، وعيد الميلاد الغربي (25 ديسمبر).
- **المناسبات الوطنية:** عيد الشرطة وثورة 25 يناير، يوم الشهيد (9 مارس)، عيد تحرير سيناء (25 أبريل)، عيد العمال (1 مايو)، ذكرى ثورة 30 يونيو، ذكرى ثورة 23 يوليو، عيد القوات المسلحة ونصر 6 أكتوبر، عيد السويس القومي، وعيد النصر ببورسعيد.
- **المناسبات الاجتماعية:** عيد الأم، عيد الحب العالمي، عيد الحب المصري (4 نوفمبر)، يوم المرأة المصرية، شم النسيم، بداية الفصول الأربعة، ورأس السنة.
- **المواسم التجارية:** الجمعة البيضاء (White Friday)، عروض رمضان، تحضيرات الأعياد، موسم الصيف والمصايف، والعودة للمدارس.
- **الأيام العالمية المؤثرة:** اليوم العالمي للتعليم، الصحة، الإبداع والابتكار، المشاريع الصغيرة والمتوسطة، التصوير، الصحة النفسية، الجودة، ورواد الأعمال.

---

## ثالثاً: طريقة توليد صور المنشورات بالذكاء الاصطناعي

لكل يوم من الـ 365 يوماً، يحتوي العمود **Final AI Prompt** على برومبت إنجليزي فائق الدقة.
1. انسخ نص البرومبت من الإكسل أو من واجهة النظام.
2. توجه إلى أداة توليد الصور المفضلة لديك:
   - **Midjourney v6:** الصق البرومبت بعد أمر \`/imagine\`.
   - **Gemini / Imagen 3:** الصق البرومبت مباشرة لإنشاء الصورة.
   - **ChatGPT Plus / DALL-E 3:** الصق البرومبت لإنتاج الصورة في ثوانٍ.
3. تم تصميم البرومبت مسبقاً بحيث:
   - يدمج ألوان الهوية البصرية للشركة بدقة.
   - يحدد أسلوب التصوير والإضاءة المناسبة للبيئة المصرية الراقية.
   - يحجز مساحة أمان مخصصة لوضع شعار الشركة في أحد الأركان.
   - يحتوي على أوامر سلبية (Negative Prompt) لمنع الحروف المشوهة والنصوص العشوائية.

---

## رابعاً: نصائح النشر والجدولة في السوق المصري

1. **أفضل أوقات النشر في مصر:**
   - **الأحد إلى الخميس (أيام العمل):** ذروة التفاعل الأولى بين (1:00 إلى 3:00 ظهراً - استراحة الغداء)، وذروة التفاعل الكبرى بين (7:30 إلى 11:30 مساءً).
   - **الجمعة (العطلة الأسبوعية):** النشر الصباحي لمنشور الجمعة المباركة بين (9:00 إلى 11:30 صباحاً قبل صلاة الجمعة)، أو الفترة المسائية بعد (6:00 مساءً).
   - **شهر رمضان:** الفترة الذهبية الأولى بين (4:00 إلى 5:30 عصراً قبل المغرب)، والفترة الذهبية الكبرى بين (9:00 مساءً إلى 1:30 صباحاً بعد صلاة التراويح).

2. **التفاعل وإدارة التعليقات:**
   - الرد السريع على التعليقات في أول 30 دقيقة من النشر يعطي إشارة لخوارزميات فيسبوك وإنستجرام بزيادة انتشار المنشور.
   - الرد الودود باللهجة المصرية المهذبة يعزز المبيعات وثقة العميل.

---

**نظام إنتاج 365 بوست سوشيال ميديا | التقويم المصري الذكي**
جاهز للاستخدام الفوري لخدمة أي نشاط تجاري في مصر!
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
