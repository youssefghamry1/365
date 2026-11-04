import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-netlify',
        },
      },
    });
  }
  return aiClient;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Helper: Smart fallback prompt generator
function generateFallbackRefinedPrompt(postData: any, clientProfile: any): string {
  const brandName = clientProfile?.companyName || 'Egyptian Brand';
  const industry = clientProfile?.industry || 'Business Services';
  const occasion = postData?.occasion || 'Special Celebration';
  const idea = postData?.contentIdea || 'Engaging Social Media Content';
  const desc = postData?.contentDescription || 'High quality professional post';
  const primary = clientProfile?.primaryColor || '#0A4D68';
  const secondary = clientProfile?.secondaryColor || '#088395';
  const accent = clientProfile?.accentColor || '#D4AF37';
  const visualStyle = clientProfile?.visualIdentity || 'Contemporary minimalist luxury advertising';
  const logoInstruction = clientProfile?.logoInstructions || 'discreet elegant upper corner placement';

  return `Award-winning commercial photography for Egyptian enterprise "${brandName}" specializing in ${industry}.
Theme & Visual Narrative: ${occasion} - ${idea}.
Detailed Scene Composition: ${desc}, featuring contemporary Egyptian modern lifestyle context with authentic refined aesthetics, natural confident ambiance.
Art Direction & Style: ${visualStyle}, editorial commercial advertising grade, masterclass cinematic lighting, soft diffused directional sun rays, gentle golden reflections.
Chromatic Harmony: Curated brand color grading anchored by primary ${primary}, harmonious secondary ${secondary}, and luxurious accent highlights of ${accent}, strictly avoiding muddy or unnatural tones.
Optics & Depth: Captured on 85mm f/1.4 prime lens at f/2.0, shallow depth of field, creamy smooth bokeh background, tack-sharp focal details, photorealistic textures and skin tones.
Layout & Negative Space: Clean rule-of-thirds composition with reserved clean negative space in corner designed for ${logoInstruction}, immaculate uncluttered framing.
Negative Constraints: Strictly NO blurry low-res artifacts, no distorted human hands or extra limbs, NO fake gibberish text or distorted typography, no low poly 3D, no oversaturated cartoon hues.
Aspect Ratio: 1:1 square feed composition, 8k resolution, photorealistic masterpiece.`;
}

// Helper: Smart fallback caption generator
function generateFallbackCaption(body: any): string {
  const { date, occasion, idea, clientProfile } = body;
  const brand = clientProfile?.companyName || 'شركتنا';
  const services = clientProfile?.services || 'خدماتنا المتميزة';
  const usps = clientProfile?.usps || 'أعلى معايير الجودة والضمان المعتمد';
  const contact = clientProfile?.contactData || 'عبر الرسائل الخاصة أو الخط الساخن';

  return `✨ ${idea || 'خطوة جديدة نحو الأفضل مع ' + brand}

في ${brand}، بنؤمن دايماً إن الجودة والاهتمام بأدق التفاصيل هما أساس الثقة الحقيقية.
بمناسبة (${occasion || date || 'اليوم'})، بنفكركم إن راحة بالكم واختياركم الصح بيبدأ من المكان اللي يقدر يضمنلكم:
🔹 ${usps}
🔹 حلول متكاملة في ${services}
🔹 متابعة مستمرة ودعم حقيقي خطوة بخطوة

شاركونا رأيكم واستفساراتكم في التعليقات، أو تواصلوا معنا فوراً عبر: ${contact} 💬📲

#مصر #تسويق #${brand.replace(/[\s\W]+/g, '_')} #خدمات_مصر #جودة_عالية`;
}

export default async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const path = new URL(req.url).pathname;
  let body: any = {};
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  // Health check endpoint
  if (path.endsWith('/health') || path.endsWith('/api/health')) {
    return new Response(JSON.stringify({
        status: 'ok',
        platform: 'netlify-functions',
        hasKey: Boolean(process.env.GEMINI_API_KEY),
      }), { status: 200, headers: CORS_HEADERS });
  }

  // 1. Analyze Client
  if (path.includes('analyze-client')) {
    try {
      const { companyOverview } = body;
      if (!companyOverview || typeof companyOverview !== 'string') {
        return new Response(JSON.stringify({ error: 'يرجى تقديم نبذة عن الشركة' }), { status: 400, headers: CORS_HEADERS });
      }

      const ai = getAiClient();
      const prompt = `أنت خبير استراتيجي أول في التسويق الرقمي المصري وبناء الهويات التجارية.
قم بتحليل النشاط التجاري التالي واستخرج ملف العميل الشامل بدقة بالغة للسوق المصري:
"${companyOverview}"

قم بالرد بصيغة JSON فقط تحتوي على الحقول التالية:
{
  "companyName": "اسم الشركة",
  "industry": "المجال أو التخصص",
  "services": "وصف الخدمات الرئيسية",
  "products": "المنتجات أو العروض الأساسية",
  "targetAudience": "تفاصيل الجمهور المستهدف في مصر بدقة (الفئة العمرية، الاهتمامات، الطبقة الاجتماعية/القدرة الشرائية)",
  "location": "الموقع الجغرافي أو نطاق التغطية في مصر",
  "usps": "نقاط التميز والقيمة التنافسية الفريدة",
  "visualIdentity": "التوجه البصري والنمط الفني المقترح (مينيمال، فاخر، حيوي، تقني)",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "accentColor": "#hex",
  "backgroundColor": "#hex",
  "typography": "الخطوط العربية المقترحة (مثل Cairo, Almarai, Readex Pro)",
  "toneOfVoice": "أسلوب ونبرة الصوت (مثل: عامية راقية ودودة، احترافية موثوقة، شابة ومرحة)",
  "logoInstructions": "تعليمات وضع الشعار",
  "contactData": "بيانات التواصل وروابط الحسابات",
  "marketingGoal": "الهدف التسويقي الأساسي",
  "forbiddenWords": "الكلمات الممنوعة والخطوط الحمراء",
  "specialInstructions": "أي تعليمات وتوجيهات خاصة"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const outputText = response.text || '{}';
      return new Response(JSON.stringify({ profile: JSON.parse(outputText) }), { status: 200, headers: CORS_HEADERS });
    } catch (error: any) {
      console.error('Netlify function error in analyze-client:', error);
      return new Response(JSON.stringify({ error: error?.message || 'حدث خطأ أثناء تحليل نشاط العميل' }), { status: 500, headers: CORS_HEADERS });
    }
  }

  // 2. Generate Caption
  if (path.includes('generate-caption')) {
    try {
      const { dayNumber, date, occasion, idea, clientProfile, toneStyle } = body;
      const ai = getAiClient();

      const prompt = `أنت كاتب محتوى إعلاني وتسويقي محترف متخصص في السوشيال ميديا المصرية (فيسبوك، إنستجرام، تيك توك، لينكد إن).
اكتب كابشن جذاب ومتكامل لمنشور اليوم رقم ${dayNumber || 1} بتاريخ (${date}) بمناسبة (${occasion}).

بيانات العميل:
- اسم الشركة: ${clientProfile?.companyName || 'الشركة'}
- المجال: ${clientProfile?.industry || 'خدمات ومنتجات'}
- الجمهور المستهدف: ${clientProfile?.targetAudience || 'الجمهور المصري'}
- نقاط القوة: ${clientProfile?.usps || 'جودة وسرعة'}
- نبرة الصوت المطلوبة: ${toneStyle || clientProfile?.toneOfVoice || 'عامية تسويقية مصرية راقية'}
- الهدف التسويقي: ${clientProfile?.marketingGoal || 'تفاعل وزيادة مبيعات'}
- كلمات ممنوعة: ${clientProfile?.forbiddenWords || 'لا يوجد'}

فكرة المنشور الأساسية: ${idea || 'منشور تسويقي تفاعلي'}

المطلوب:
1. سطر افتتاحي خطاف قوي (Hook) يشد القارئ المصري في أول 3 ثوانٍ.
2. نص المنشور الذي يربط المناسبة أو الفكرة بالقيمة المضافة للشركة بطريقة ذكية وغير مفتعلة وباحترام تام للمناسبات.
3. دعوة واضحة لاتخاذ إجراء (Call to Action - CTA) تحفز التعليق أو المراسلة.
4. هاشتاجات مناسبة ومركزة (3-6 هاشتاجات متداولة في مصر).
5. ممنوع تماماً استخدام أي كلمات مبتذلة أو وعود زائفة أو أسعار مخترعة.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          return new Response(JSON.stringify({ caption: response.text, source: 'ai' }), { status: 200, headers: CORS_HEADERS });
        }
      } catch (apiErr: any) {
        console.warn('Gemini generateContent caption failed in Netlify, using smart fallback:', apiErr?.message);
      }

      const fallbackCaption = generateFallbackCaption(body);
      return new Response(JSON.stringify({ caption: fallbackCaption, source: 'smart_engine' }), { status: 200, headers: CORS_HEADERS });
    } catch (error: any) {
      const fallbackCaption = generateFallbackCaption(body);
      return new Response(JSON.stringify({ caption: fallbackCaption, source: 'smart_engine' }), { status: 200, headers: CORS_HEADERS });
    }
  }

  // 3. Refine Prompt
  if (path.includes('refine-prompt')) {
    try {
      const { postData, clientProfile } = body;
      const ai = getAiClient();

      const prompt = `أنت مهندس برومبتات صور محترف وخبير في الذكاء الاصطناعي التوليدي (Midjourney v6, Imagen 3, DALL-E 3).
المطلوب صياغة برومبت إنجليزي فائق الدقة والاحترافية لتوليد صورة سوشيال ميديا لمنشور شركة مصرية.

تفاصيل اليوم:
- المناسبة: ${postData?.occasion}
- تصنيف المناسبة: ${postData?.occasionCategory}
- الفكرة: ${postData?.contentIdea}
- الوصف: ${postData?.contentDescription}

بيانات العميل وهويته:
- الشركة: ${clientProfile?.companyName}
- المجال: ${clientProfile?.industry}
- الخدمات: ${clientProfile?.services}
- الهوية البصرية والنمط: ${clientProfile?.visualIdentity}
- الألوان: أساسي (${clientProfile?.primaryColor})، ثانوي (${clientProfile?.secondaryColor})، مميز (${clientProfile?.accentColor})
- الجمهور المستهدف في مصر: ${clientProfile?.targetAudience}

شروط البرومبت النهائي:
1. صياغة باللغة الإنجليزية فائقة الوضوح مع تفاصيل الإضاءة، الكاميرا، التركيب السينمائي، وأسلوب الفن.
2. الالتزام بباليتة الألوان المحددة دون عشوائية.
3. تجنب تشوهات النصوص أو الحروف غير المفهومة (clean composition, negative prompt against gibberish text).
4. تحديد مقاس الصورة المناسب (1:1 square feed أو 4:5 vertical).
5. تعليمات مدمجة لمكان الشعار (reserved subtle space for client logo).
6. بدون أي أسعار أو أرقام وهمية.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          return new Response(JSON.stringify({ prompt: response.text, source: 'ai' }), { status: 200, headers: CORS_HEADERS });
        }
      } catch (apiErr: any) {
        console.warn('Gemini refine-prompt failed in Netlify, using fallback:', apiErr?.message);
      }

      const refined = generateFallbackRefinedPrompt(postData, clientProfile);
      return new Response(JSON.stringify({ prompt: refined, source: 'smart_engine' }), { status: 200, headers: CORS_HEADERS });
    } catch (error: any) {
      const refined = generateFallbackRefinedPrompt(body?.postData, body?.clientProfile);
      return new Response(JSON.stringify({ prompt: refined, source: 'smart_engine' }), { status: 200, headers: CORS_HEADERS });
    }
  }

  // 4. Batch Generate Month (30-31 posts in a single monthly batch)
  if (path.includes('batch-generate-month')) {
    try {
      const { month, monthName, days, clientProfile } = body;
      const updatedDays = (days || []).map((day: any) => {
        const refinedPrompt = generateFallbackRefinedPrompt(day, clientProfile);
        const refinedCaption = generateFallbackCaption({
          date: day.date,
          occasion: day.occasion,
          idea: day.contentIdea,
          clientProfile,
        });

        return {
          ...day,
          suggestedCaption: refinedCaption,
          finalAiPrompt: refinedPrompt,
          publishingStatus: 'جاهز للنشر (Ready)',
        };
      });

      return new Response(JSON.stringify({
          month,
          monthName,
          count: updatedDays.length,
          updatedDays,
        }), { status: 200, headers: CORS_HEADERS });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error?.message || 'فشل توليد دفعة الشهر' }), { status: 500, headers: CORS_HEADERS });
    }
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found on Netlify function' }), { status: 404, headers: CORS_HEADERS });
};

export const config = {
  path: ['/api/gemini/*', '/api/health', '/.netlify/functions/gemini', '/.netlify/functions/gemini/*'],
};
