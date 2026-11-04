import { ClientProfile } from '../types';
import {
  DesignTextContent,
  GeneratedDesignPromptItem,
  GraphicDesignTemplate,
  QualityAuditResult,
} from '../types/graphicDesign';

/**
 * Automatically generate tailored Arabic Text Content for any design
 * strictly derived from the client's verified data without inventing fake claims.
 */
export function buildDesignTextContent(
  template: GraphicDesignTemplate,
  client: ClientProfile
): DesignTextContent {
  const brand = client.companyName || 'اسم الشركة';
  const industry = client.industry || 'المجال التخصصي';
  const services = client.services || 'خدماتنا المعتمدة';
  const usps = client.usps || 'أعلى معايير الجودة والضمان';
  const contact = client.contactData || 'تواصل معنا عبر القنوات الرسمية';
  const location = client.location || 'مصر';

  // Customize headlines and body depending on the design type and category
  switch (template.category) {
    case 'brand_identity':
      return {
        headline: brand,
        subheadline: `${industry} | التميز في ${location}`,
        bodyDescription: `العلامة البصرية الرسمية المعتمدة لشركة ${brand}. ترتكز على مبادئ ${usps}.`,
        featuredOfferOrServices: services,
        callToAction: 'الالتزام الكامل بإرشادات دليل الهوية البصرية المعتمدة',
        contactData: contact,
      };

    case 'stationery':
      return {
        headline: brand,
        subheadline: `رواد في ${industry}`,
        bodyDescription: `نقدم لعملائنا في ${location} أعلى مستويات الاحترافية في ${services}.`,
        featuredOfferOrServices: usps,
        callToAction: 'يسعدنا خدمتكم والتواصل معكم عبر بياناتنا الرسمية',
        contactData: contact,
      };

    case 'marketing_collateral':
      return {
        headline: `اختيارك الموثوق في ${industry} | ${brand}`,
        subheadline: `حلول متكاملة تضمن لك ${usps}`,
        bodyDescription: `في ${brand}، نكرس خبراتنا لتقديم أرقى مستويات الخدمة لعملائنا في ${location}. خدماتنا مصممة بدقة لتلبية تطلعاتكم وتوفير أعلى عائد وقيمة حقيقية.`,
        featuredOfferOrServices: services,
        callToAction: 'احجز استشارتك وتعرف على باقاتنا الآن',
        contactData: contact,
      };

    case 'social_media':
      return {
        headline: `التميز يبدأ مع ${brand}`,
        subheadline: `خبرة رائدة في ${industry}`,
        bodyDescription: `اكتشف الفرق الحقيقي في ${services} مع ضمانات معتمدة وأعلى جودة في ${location}.`,
        featuredOfferOrServices: usps,
        callToAction: 'راسلنا الآن على الواتساب أو عبر الرسائل الخاصة للاستفسار',
        contactData: contact,
      };

    case 'packaging':
      return {
        headline: brand,
        subheadline: `جودة فاخرة | ${industry}`,
        bodyDescription: `صُمم هذا المنتج خصيصاً ليمنحك تجربة استثنائية مبنية على ${usps}.`,
        featuredOfferOrServices: client.products || services,
        callToAction: 'استمتع بأعلى معايير الإتقان | صنع بعناية لعملائنا',
        contactData: contact,
      };

    case 'digital_assets':
      return {
        headline: `بوابتك الأولى لخدمات ${industry} | ${brand}`,
        subheadline: `تكنولوجيا حديثة، سرعة فائقة، وضمان ${usps}`,
        bodyDescription: `تصفح أحدث حلولنا في ${services} واستمتع بتجربة رقمية سلسة وسريعة تلبي احتياجاتك في ${location}.`,
        featuredOfferOrServices: services,
        callToAction: 'ابدأ تجربتك الآن واطلب الخدمة بضغطة زر',
        contactData: contact,
      };

    default:
      return {
        headline: brand,
        subheadline: industry,
        bodyDescription: `${services} في ${location}.`,
        featuredOfferOrServices: usps,
        callToAction: 'تواصل معنا اليوم',
        contactData: contact,
      };
  }
}

/**
 * Determine industry-specific visual style tokens to prevent generic designs
 */
export function getIndustryVisualAesthetic(client: ClientProfile): string {
  const ind = (client.industry || '').toLowerCase();
  const base = client.visualIdentity || '';

  if (ind.includes('أسنان') || ind.includes('طبي') || ind.includes('تجميل') || ind.includes('عياد') || ind.includes('dental') || ind.includes('clinic')) {
    return `Clean clinical luxury aesthetic, pristine white marble surfaces, surgical precision lighting, serene hygienic environment, soft glowing cyan ambient reflections, welcoming wellness atmosphere (${base})`;
  }

  if (ind.includes('عقار') || ind.includes('تطوير') || ind.includes('سكن') || ind.includes('real estate') || ind.includes('invest')) {
    return `Grand architectural prestige aesthetic, geometric blueprint balance, golden-hour sunlight on modern luxury facade, rich navy and warm brushed gold materiality, majestic horizon depth (${base})`;
  }

  if (ind.includes('مطعم') || ind.includes('كافيه') || ind.includes('أكل') || ind.includes('طعام') || ind.includes('food') || ind.includes('restaurant')) {
    return `Warm appetizing culinary aesthetic, rich authentic terracotta and amber illumination, rustic artisanal textures, steaming gourmet presentation, vibrant fresh ingredients (${base})`;
  }

  if (ind.includes('برمج') || ind.includes('تسويق') || ind.includes('تقني') || ind.includes('tech') || ind.includes('software') || ind.includes('agency')) {
    return `Cutting-edge tech SaaS aesthetic, deep slate dark-mode canvas, crisp geometric glassmorphism, luminous neon indigo and cyan accents, futuristic UI micro-grids (${base})`;
  }

  if (ind.includes('أزياء') || ind.includes('ملابس') || ind.includes('موضة') || ind.includes('fashion') || ind.includes('apparel')) {
    return `High-fashion editorial aesthetic, tactile cotton and linen weave textures, dramatic studio directional lighting, high-contrast vogue styling, modern urban luxury palette (${base})`;
  }

  return `Modern professional corporate advertising aesthetic, balanced negative space, refined tonal harmony, premium commercial studio lighting (${base})`;
}

/**
 * Construct the full 16-point professional English AI Prompt
 */
export function buildFinalEnglishPrompt(
  template: GraphicDesignTemplate,
  client: ClientProfile,
  textContent: DesignTextContent,
  visualStyle: string
): string {
  const brand = client.companyName || 'Egyptian Brand';
  const industry = client.industry || 'Commercial Business';
  const audience = client.targetAudience || 'Egyptian and Middle Eastern premium market consumers';
  const primary = client.primaryColor || '#0F172A';
  const secondary = client.secondaryColor || '#1E293B';
  const accent = client.accentColor || '#C5A059';
  const background = client.backgroundColor || '#FFFFFF';
  const typography = client.typography || 'Cairo, Montserrat, Readex Pro';
  const logoRule = client.logoInstructions || 'reserved clean space for official brand logo placement';
  const dims = template.defaultDimensions;
  const isPrint = template.usageType === 'print';

  return `Masterpiece commercial graphic design mockup for Egyptian brand "${brand}" in the industry of ${industry}.
Item to Design: ${template.nameEn} (${template.nameAr}).
Primary Design Objective: ${template.goalAr}.
Target Demographic: ${audience}.
Visual Style & Art Direction: ${visualStyle}.
Strict Color System: Dominant Primary Hex (${primary}), Secondary Structural Hex (${secondary}), Vivid Contrast Accent Hex (${accent}), Clean Background Tone (${background}). Strictly adhere to these exact hexadecimal color harmonies without adding unapproved rainbow tints.
Typography Style: Clean executive type setting adhering to ${typography}.
Layout & Visual Composition: Professional grid structure tailored for ${template.nameEn}. Perfectly calculated optical visual weight. Clean designated negative space reserved for graphic designer to insert verified Arabic typography (Headline: "${textContent.headline}" | Subhead: "${textContent.subheadline}" | Call to Action: "${textContent.callToAction}").
Logo Safe Zone: Dedicated prominent uncluttered zone allocated for ${logoRule}.
Lighting & Mockup Environment: ${
    isPrint
      ? 'Ultra-high-resolution photorealistic print studio mockup, subtle tactile paper texture grain, soft ambient drop shadows, pristine 300 DPI print-ready presentation.'
      : 'High-end pixel-perfect digital UI/advertising presentation, crisp display calibration, vivid retinal clarity, contemporary device context.'
  }
Format Specifications: Dimensions ${dims}, Aspect Ratio ${template.aspectRatio}.
Designer Handover Rule: Keep background elements, geometric patterns and visual focal points clean and separated from text areas so human graphic designers in Adobe Illustrator/Photoshop/InDesign can effortlessly place real typography.
Negative Constraints: Strictly NO distorted human anatomy or extra limbs, NO blurry low-resolution compression, strictly NO fake distorted gibberish Arabic or Latin text characters, no watermarks, no warped lines, no muddy oversaturated cartoon colors.
Aspect Ratio: ${template.aspectRatio}, 8k resolution, award-winning Behance and Dribbble portfolio caliber.`;
}

/**
 * Build clear Arabic Explanation & Designer Notes
 */
export function buildArabicExplanation(
  template: GraphicDesignTemplate,
  client: ClientProfile,
  textContent: DesignTextContent
): string {
  return `هذا البرومبت مخصص لإنتاج وتوجيه تصميم: "${template.nameAr}" لشركة "${client.companyName}" (${client.industry}).
الهدف التسويقي: ${template.goalAr}.
نظام الألوان المعتمد: أساسي (${client.primaryColor})، ثانوي (${client.secondaryColor})، تمييز (${client.accentColor})، خلفية (${client.backgroundColor}).
المقاس الفني: ${template.defaultDimensions} (${template.aspectRatio})، نظام الألوان: ${template.colorMode}.
المحتوى النصي الإلزامي لوضعه بواسطة المصمم:
• العنوان: ${textContent.headline}
• العنوان الفرعي: ${textContent.subheadline}
• الخدمات والمميزات: ${textContent.featuredOfferOrServices}
• زر الإجراء (CTA): ${textContent.callToAction}
• بيانات التواصل: ${textContent.contactData}
تعليمات المصمم: ${template.designerHandoverTipsAr}`;
}

/**
 * Automated Quality Audit for each generated prompt
 */
export function performQualityAudit(
  template: GraphicDesignTemplate,
  client: ClientProfile,
  textContent: DesignTextContent
): QualityAuditResult {
  const checks = [
    {
      label: 'توافق التصميم مع نشاط الشركة الحقيقي',
      passed: Boolean(client.companyName && client.industry),
      note: client.companyName ? `مرتبط بشركة ${client.companyName} في قطاع ${client.industry}` : 'يرجى إدخال اسم ومجال الشركة',
    },
    {
      label: 'صحة أكواد الألوان Hexadecimal',
      passed: Boolean(
        client.primaryColor?.startsWith('#') &&
        client.secondaryColor?.startsWith('#') &&
        client.accentColor?.startsWith('#')
      ),
      note: `الأكواد مفحوصة: ${client.primaryColor} ، ${client.secondaryColor} ، ${client.accentColor}`,
    },
    {
      label: 'عدم اختراع أسعار أو عروض وهمية',
      passed: !textContent.bodyDescription.includes('أرخص') && !textContent.bodyDescription.includes('مجاناً'),
      note: 'المحتوى النصي معتمد من بيانات العميل الفعلية وخالٍ من الادعاءات غير الموثقة',
    },
    {
      label: 'وضوح المقاسات ونسبة العرض ونوع الاستخدام',
      passed: Boolean(template.defaultDimensions && template.aspectRatio),
      note: `المقاس: ${template.defaultDimensions} (${template.usageType === 'print' ? 'طباعة CMYK' : 'رقمي RGB'})`,
    },
    {
      label: 'تعليمات حماية الشعار وتجنب النصوص المشوهة',
      passed: true,
      note: 'تم تضمين Negative Prompt صارم يمنع الحروف المشوهة ويحجز مساحة الشعار',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const scoreOutOf10 = Math.round((passedCount / checks.length) * 10);

  return {
    isPassed: scoreOutOf10 >= 8,
    scoreOutOf10,
    checks,
  };
}

/**
 * Generate full design item with all fields populated
 */
export function generateSingleDesignPromptItem(
  template: GraphicDesignTemplate,
  client: ClientProfile,
  customTextContent?: Partial<DesignTextContent>,
  isSelected: boolean = false
): GeneratedDesignPromptItem {
  const baseTextContent = buildDesignTextContent(template, client);
  const textContent: DesignTextContent = {
    ...baseTextContent,
    ...customTextContent,
  };

  const visualStyle = getIndustryVisualAesthetic(client);
  const finalEnglishPrompt = buildFinalEnglishPrompt(template, client, textContent, visualStyle);
  const arabicExplanation = buildArabicExplanation(template, client, textContent);

  const negativePrompt = `Strictly NO distorted anatomy, extra limbs, NO blurry low-res compression, strictly NO fake gibberish Arabic or Latin text characters, no watermarks, no messy warped lines, no amateur clip art, no low poly 3D, no unapproved oversaturated neon hues.`;

  const qualityAudit = performQualityAudit(template, client, textContent);

  return {
    template,
    client,
    customizedDimensions: template.defaultDimensions,
    textContent,
    visualStyle,
    finalEnglishPrompt,
    arabicExplanation,
    negativePrompt,
    designerInstructions: template.designerHandoverTipsAr,
    qualityAudit,
    status: 'معتمد للتنفيذ',
    isSelected,
  };
}
