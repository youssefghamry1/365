import { ClientProfile } from '../types';

/**
 * Generates an executive, print-ready Brand Book / Client Profile HTML Document
 * supporting RTL Arabic, crisp typography, brand color swatches, and high-res print/PDF output.
 */
export function generateProfilePrintHtml(client: ClientProfile): string {
  const primaryColor = client.primaryColor || '#0A4D68';
  const secondaryColor = client.secondaryColor || '#088395';
  const accentColor = client.accentColor || '#D4AF37';
  const backgroundColor = client.backgroundColor || '#F5F5F7';
  const todayDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>ملف العميل والهوية البصرية - ${client.companyName || 'الشركة'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px;
    }
    .header-card {
      border: 2px solid ${primaryColor};
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      position: relative;
    }
    .header-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor});
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .brand-subtitle {
      font-size: 14px;
      color: #64748b;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    .meta-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      background-color: #e2e8f0;
      color: #334155;
    }
    .badge-primary {
      background-color: ${primaryColor}15;
      color: ${primaryColor};
      border: 1px solid ${primaryColor}40;
    }
    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: ${primaryColor};
      margin: 28px 0 14px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title .num-badge {
      display: inline-flex;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background-color: ${primaryColor};
      color: white;
      font-size: 13px;
      font-weight: 900;
      align-items: center;
      justify-content: center;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .field-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 13.5px;
      color: #1e293b;
      font-weight: 600;
      white-space: pre-line;
    }
    /* Color Palette */
    .color-palette-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 10px;
    }
    .color-chip-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      background: white;
      text-align: center;
    }
    .color-chip-preview {
      height: 52px;
      width: 100%;
    }
    .color-chip-info {
      padding: 8px;
      font-size: 11px;
    }
    .color-chip-name {
      font-weight: 700;
      color: #334155;
    }
    .color-chip-hex {
      font-family: monospace;
      color: #64748b;
      font-weight: 600;
      direction: ltr;
    }
    .footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body {
        margin: 0;
      }
      .page-container {
        padding: 0;
        max-width: 100%;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <div class="header-card">
      <h1 class="brand-title">${client.companyName || 'دليل الهوية البصرية وملف العميل'}</h1>
      <p class="brand-subtitle">${client.industry || 'قطاع الأعمال والخدمات'} • جمهورية مصر العربية</p>
      
      <div class="meta-badges">
        <span class="badge badge-primary">تاريخ الإصدار: ${todayDate}</span>
        <span class="badge">المرجع المعتمد للذكاء الاصطناعي والتصميم</span>
        <span class="badge">نظام إنتاج 365 بوست + 80 تصميم</span>
      </div>
    </div>

    <!-- 1. Business Info -->
    <div class="section-title">
      <span class="num-badge">1</span>
      <span>بيانات النشاط التجاري (Business Information)</span>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="field-label">اسم الشركة أو العلامة</div>
        <div class="field-value">${client.companyName || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">المجال الرئيسي والتخصص</div>
        <div class="field-value">${client.industry || '—'}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="field-label">وصف النشاط التجاري</div>
        <div class="field-value">${client.companyOverview || client.industry || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">الخدمات الرئيسية</div>
        <div class="field-value">${client.services || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">المنتجات أو العروض</div>
        <div class="field-value">${client.products || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">الموقع الجغرافي ونطاق التغطية</div>
        <div class="field-value">${client.location || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">معلومات وقنوات التواصل</div>
        <div class="field-value">${client.contactData || '—'}</div>
      </div>
    </div>

    <!-- 2. Target Audience -->
    <div class="section-title">
      <span class="num-badge">2</span>
      <span>دراسة الجمهور المستهدف (Target Audience Analysis)</span>
    </div>
    <div class="grid-2">
      <div class="card" style="grid-column: span 2;">
        <div class="field-label">تفاصيل الجمهور المستهدف</div>
        <div class="field-value">${client.targetAudience || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">الفئات العمرية والديموغرافيا</div>
        <div class="field-value">${client.audienceAge || 'جميع الفئات المهتمة بجودة الخدمات'}</div>
      </div>
      <div class="card">
        <div class="field-label">الموقع الجغرافي للجمهور</div>
        <div class="field-value">${client.audienceLocation || client.location || 'مصر والمنطقة'}</div>
      </div>
      <div class="card">
        <div class="field-label">الاحتياجات والمشكلات التي يواجهها الجمهور</div>
        <div class="field-value">${client.audienceNeeds || client.audienceProblems || 'البحث عن خدمات موثوقة ذات جودة عالية'}</div>
      </div>
      <div class="card">
        <div class="field-label">دوافع اتخاذ القرار وسلوك الشراء</div>
        <div class="field-value">${client.decisionTriggers || 'الثقة، التوصيات الإيجابية، القيمة التنافسية'}</div>
      </div>
    </div>

    <!-- Page Break for Clean Professional Print -->
    <div class="page-break"></div>

    <!-- 3. Competitive Advantage -->
    <div class="section-title">
      <span class="num-badge">3</span>
      <span>نقاط التميز والميزة التنافسية (Competitive Advantage & USPs)</span>
    </div>
    <div class="grid-2">
      <div class="card" style="grid-column: span 2;">
        <div class="field-label">المميزات التنافسية والقيمة المضافة (USPs)</div>
        <div class="field-value">${client.usps || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">نقاط القوة الأساسية</div>
        <div class="field-value">${client.strengths || client.usps || 'فريق متخصص وأعلى معايير الجودة والضمان'}</div>
      </div>
      <div class="card">
        <div class="field-label">أسباب اختيار الشركة والتفضيل</div>
        <div class="field-value">${client.reasonsToChoose || 'الالتزام والخبرة العملية والنتائج الملموسة'}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="field-label">الرسائل التسويقية الأساسية</div>
        <div class="field-value">${client.coreMarketingMessages || 'شريكك الأول لتحقيق أعلى نتائج وضمان راحة بالك'}</div>
      </div>
    </div>

    <!-- 4. Marketing Strategy -->
    <div class="section-title">
      <span class="num-badge">4</span>
      <span>الاستراتيجية التسويقية ونبرة الصوت (Marketing Strategy)</span>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="field-label">الأهداف التسويقية</div>
        <div class="field-value">${client.marketingGoal || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">نبرة الصوت وأسلوب التواصل</div>
        <div class="field-value">${client.toneOfVoice || '—'}</div>
      </div>
      <div class="card">
        <div class="field-label">المنصات المستهدفة</div>
        <div class="field-value">${client.targetPlatforms || 'فيسبوك، إنستجرام، لينكد إن، تيك توك، واتساب'}</div>
      </div>
      <div class="card">
        <div class="field-label">عبارات الدعوة لاتخاذ إجراء (Call to Action)</div>
        <div class="field-value">${client.callToActions || 'تواصل معنا الآن، احجز استشارتك، اطلب عرض السعر'}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="field-label">الكلمات والعبارات المحظورة (الخطوط الحمراء)</div>
        <div class="field-value" style="color: #b91c1c;">${client.forbiddenWords || 'لا توجد كلمات محظورة محددة'}</div>
      </div>
    </div>

    <!-- 5. Visual Identity -->
    <div class="section-title">
      <span class="num-badge">5</span>
      <span>الهوية البصرية والألوان (Visual Identity & Colors)</span>
    </div>

    <div class="card" style="margin-bottom: 14px;">
      <div class="field-label">النمط والتوجه الفني العام للتصميمات</div>
      <div class="field-value">${client.visualIdentity || '—'}</div>
    </div>

    <div class="color-palette-grid">
      <div class="color-chip-card">
        <div class="color-chip-preview" style="background-color: ${primaryColor};"></div>
        <div class="color-chip-info">
          <div class="color-chip-name">اللون الأساسي</div>
          <div class="color-chip-hex">${primaryColor}</div>
        </div>
      </div>
      <div class="color-chip-card">
        <div class="color-chip-preview" style="background-color: ${secondaryColor};"></div>
        <div class="color-chip-info">
          <div class="color-chip-name">اللون الثانوي</div>
          <div class="color-chip-hex">${secondaryColor}</div>
        </div>
      </div>
      <div class="color-chip-card">
        <div class="color-chip-preview" style="background-color: ${accentColor};"></div>
        <div class="color-chip-info">
          <div class="color-chip-name">لون التمييز</div>
          <div class="color-chip-hex">${accentColor}</div>
        </div>
      </div>
      <div class="color-chip-card">
        <div class="color-chip-preview" style="background-color: ${backgroundColor}; border-bottom: 1px solid #e2e8f0;"></div>
        <div class="color-chip-info">
          <div class="color-chip-name">لون الخلفية</div>
          <div class="color-chip-hex">${backgroundColor}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 14px;">
      <div class="card">
        <div class="field-label">الخطوط المعتمدة</div>
        <div class="field-value">${client.typography || 'Cairo, Montserrat'}</div>
      </div>
      <div class="card">
        <div class="field-label">تعليمات وضع الشعار والأمان البصري</div>
        <div class="field-value">${client.logoInstructions || 'وضع الشعار في الزاوية العلوية بمساحة أمان كافية'}</div>
      </div>
    </div>

    ${
      client.customFields && client.customFields.length > 0
        ? `
      <div class="section-title">
        <span class="num-badge">+</span>
        <span>حقول وملاحظات إضافية مخصصة</span>
      </div>
      <div class="grid-2">
        ${client.customFields
          .map(
            (cf) => `
          <div class="card">
            <div class="field-label">${cf.label} (${cf.section})</div>
            <div class="field-value">${cf.value}</div>
          </div>
        `
          )
          .join('')}
      </div>
      `
        : ''
    }

    <!-- Footer -->
    <div class="footer">
      ملف موحد صادر عن نظام إنتاج 365 بوست وإدارة الهوية البصرية • تم إنشاء الوثيقة في ${todayDate} • جميع الحقوق محفوظة لـ ${client.companyName || 'الشركة'}.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers native browser Print / Save as PDF modal
 */
export function exportProfilePdf(client: ClientProfile) {
  const html = generateProfilePrintHtml(client);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    // Fallback: create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 2000);
      }, 500);
    }
  }
}
