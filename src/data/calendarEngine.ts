import {
  CalendarDayRow,
  ClientProfile,
  DayTemplate,
  MarketingObjective,
  OccasionCategory,
  PublishingStatus,
} from '../types';

export const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const WEEKDAYS_AR = [
  'الخميس',
  'الجمعة',
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
];

export const CATEGORY_LABELS: Record<OccasionCategory, string> = {
  islamic: 'مناسبة إسلامية دينية',
  christian: 'مناسبة مسيحية دينية',
  national: 'مناسبة وطنية مصرية',
  social: 'مناسبة اجتماعية وثقافية',
  commercial: 'موسم تجاري واستهلاكي',
  international: 'يوم عالمي / توعوي',
  friday: 'جمعة مباركة وطاقة إيجابية',
  brand_regular: 'محتوى تسويقي وتوعوي للنشاط',
};

// Known fixed and seasonal Egyptian occasions mapped by Date "DD/MM"
interface SpecialDaySeed {
  occasion: string;
  category: OccasionCategory;
  isEstimated?: boolean;
  contentIdea: string;
  contentDescription: string;
  tieInMethod: string;
  objective: MarketingObjective;
  captionDraft: string;
  promptConcept: string;
}

const SPECIAL_DAYS_EGYPT: Record<string, SpecialDaySeed> = {
  '01/01': {
    occasion: 'رأس السنة الميلادية الجديدة وبداية عام مشرق',
    category: 'social',
    contentIdea: 'تهنئة العام الجديد + مشاركة أهداف وطموحات التطوير مع عملائنا',
    contentDescription: 'منشور تفاؤلي بمناسبة 1 يناير يهنئ المتابعين بالعام الجديد ويستعرض التزام البراند بتقديم قيمة استثنائية طوال 365 يوماً القادمة.',
    tieInMethod: 'ربط العام الجديد ببدء خطوة جديدة مع خدمات العميل وتحقيق أهداف النجاح أو الراحة أو الاستثمار.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'سنة جديدة وفرصة جديدة لتحقيق كل اللي بتتمناه! ✨ مع أول شمس في العام الجديد، في {COMPANY_NAME} بنجدد وعدنا ليكم بتقديم أعلى جودة وأفضل تجربة. سنة سعيدة مليانة نجاح وراحة بال. شاركونا في التعليقات: إيه أول هدف ناويين تحقـقوه السنة دي؟ 🎯',
    promptConcept: 'Cinematic New Year sunrise over contemporary Cairo skyline, elegant celebration with warm ambient golden light and subtle modern festive sparkles, clean corporate aesthetic',
  },
  '07/01': {
    occasion: 'عيد الميلاد المجيد القبطي (شركاء الوطن)',
    category: 'christian',
    contentIdea: 'تهنئة راقية للأخوة الأقباط بعيد الميلاد المجيد تعزز الوحدة الوطنية',
    contentDescription: 'منشور تهنئة دافئ يعبر عن المحبة والتآخي بين أبناء مصر في عيد الميلاد المجيد بأسلوب راقٍ يليق بهوية الشركة.',
    tieInMethod: 'التركيز على قيم السلام والمحبة والتضامن الإنساني مع تهنئة شركاء الوطن وفريق العمل والعملاء.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'كل عام وشركاء الوطن وإخوتنا الأقباط بألف خير بمناسبة عيد الميلاد المجيد! 🎄✨ دامت مصر دائماً نسيجاً واحداً يجمعه الود والمحبة والسلام، وأعيادنا دايماً مليانة فرحة ولمّة دافية. من أسرة {COMPANY_NAME}، نتمنى لكم ولعائلاتكم عيداً مجيداً وسعيداً. 🕊️❤️',
    promptConcept: 'Elegant warm cultural celebration of peace and unity in Egypt, warm architectural lighting with subtle festive evergreen wreath accents and golden candles, peaceful harmony',
  },
  '19/01': {
    occasion: 'عيد الغطاس المجيد',
    category: 'christian',
    contentIdea: 'تهنئة تراثية دافئة بعيد الغطاس وطقوس القلقاس والقصب التراثية المصرية',
    contentDescription: 'تسليط الضوء على العادات المصرية الأصيلة والترابط الأسري في هذا اليوم التراثي الجميل.',
    tieInMethod: 'إبراز الاهتمام بالثقافة المصرية والاحتفاء بتقاليدها العائلية الدافئة.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'عيد غطاس سعيد ومبارك على كل إخوتنا وأحبابنا! 🎋✨ زي ما اتعودنا دايماً على حلاوة طقوس اليوم ده واللمة الحلوة على القصب والقلقاس، نتمنى لكم يوم مبهج كله دفا وبركة. كل سنة ومصر كلها بخير وسعادة. ❤️',
    promptConcept: 'Authentic warm Egyptian cultural tradition, warm cozy lighting, natural table setting with traditional Egyptian elements in an upscale tasteful setting',
  },
  '24/01': {
    occasion: 'اليوم العالمي للتعليم (International Day of Education)',
    category: 'international',
    contentIdea: 'أهمية التطوير المستمر والتعليم المهني في رفع كفاءة السوق المصري',
    contentDescription: 'مشاركة معلومة تعليمية قيمة أو تسليط الضوء على استثمار الشركة في تدريب كوادرها ورفع معايير الخدمة.',
    tieInMethod: 'الربط بين تخصص الشركة ومسؤوليتها في تثقيف العميل وتقديم معلومات شفافة تساعده على اتخاذ القرار السليم.',
    objective: 'تعليم وتثقيف (Education)',
    captionDraft: 'الاستثمار في المعرفة هو الاستثمار الوحيد اللي عائده بيضاعف كل يوم! 📚💡 في اليوم العالمي للتعليم، بنفكركم إن اختيارك الصح لأي خدمة بيبدأ دايماً من فهمك ومعرفتك الدقيقة. في {COMPANY_NAME} هدفنا مش بس تقديم {SERVICES}، هدفنا نكون مستشارك الموثوق. عندك أي سؤال تقني محتار فيه؟ اسألنا في الكومنتات وهنجاوبك بالتفصيل! 👇',
    promptConcept: 'Conceptual modern visual representing continuous professional learning, sleek glowing geometric knowledge icons, modern bright office ambient in Cairo',
  },
  '25/01': {
    occasion: 'عيد الشرطة المصرية وذكرى ثورة 25 يناير',
    category: 'national',
    contentIdea: 'تحية تقدير وإجلال لتضحيات رجال الشرطة وحماة أمن الوطن وبناة الاستقرار',
    contentDescription: 'منشور وطني وقور يعبر عن الامتنان لمن يسهرون على أمن واستقرار مصر، الذي يمثل ركيزة البناء والتنمية والعمل.',
    tieInMethod: 'التأكيد على أن الأمان والاستقرار هما الأساس الذي يمكننا من الإنتاج والابتكار وخدمة عملائنا.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'تحية إجلال وتقدير لرجال الشرطة المصرية البواسل في عيدهم الـ 74 🇪🇬 رجال صدقوا ما عاهدوا الله عليه لحفظ أمن الوطن واستقراره. لولا الأمان ما كان العمل ولا البناء ولا استمرار النجاح. كل عام ومصرنا الحبيبة وشعبها العظيم في عزة وأمان واستقرار. 🦅🇪🇬',
    promptConcept: 'Solemn and prestigious national pride imagery, elegant Egyptian eagle emblem and draped Egyptian flag with warm cinematic golden hour light, majestic and respectful',
  },
  '04/02': {
    occasion: 'اليوم العالمي للسرطان والتوعية الصحية (World Cancer Day)',
    category: 'international',
    contentIdea: 'رسالة أمل ودعم لمحاربي السرطان وأهمية الكشف المبكر ونمط الحياة الصحي',
    contentDescription: 'منشور إنساني وتوعوي راقٍ يشارك فيه البراند بالمسؤولية المجتمعية والتشجيع على الفحوصات الدورية.',
    tieInMethod: 'إبراز الجانب الإنساني للبراند وحرصه على صحة وسلامة المجتمع.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'شجاعة لا تنكسر وأمل يتجدد كل صباح. 🎗️ في اليوم العالمي لمكافحة السرطان، نوجه كل التحية والدعم لأبطالنا محاربي السرطان في مصر والعالم. ونفكركم جميعاً: صحتك وصحة أحبابك هي أثمن ما تملك، والكشف المبكر هو خط الدفاع الأول. دمتم سالمين وبأتم صحة وعافية. ❤️',
    promptConcept: 'Uplifting symbolic ribbon of health and hope, gentle comforting sunlight casting warm ray, clean minimal pastel background, hopeful and dignified',
  },
  '14/02': {
    occasion: 'عيد الحب العالمي (Valentine’s Day)',
    category: 'social',
    contentIdea: 'التعبير عن الامتنان وحب عملائنا وتقديم باقة أو هدية تقدير خاصة',
    contentDescription: 'منشور احتفالي لطيف بمناسبة الفلانتين يركز على قيمة الاهتمام والشغف في تقديم الخدمة وإسعاد العملاء.',
    tieInMethod: 'تحويل مفهوم الحب إلى الإتقان والاهتمام برضا العميل وتدليله بباقة مميزة.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'الحب الحقيقي هو الاهتمام بأدق التفاصيل! ❤️ في {COMPANY_NAME}، شغفنا الأول والأخير هو راحتكم وثقتكم اللي بنعتبرها أغلى هدية. بمناسبة الفلانتين، جهزنا ليكم مفاجأة مميزة تعبر عن تقديرنا لكل عميل شاركنا رحلة النجاح. منشن لحد بتحب تدلعه النهاردة وشوف المفاجأة في أول كومنت! 🎁✨',
    promptConcept: 'Subtle and elegant Valentine celebration, refined minimalist styling, deep red and luxury gold accents, beautifully wrapped tasteful gift box with silky ribbon',
  },
  '08/03': {
    occasion: 'اليوم الدولي للمرأة (International Women’s Day)',
    category: 'international',
    contentIdea: 'تحية لملهمات النجاح وسيدات الأعمال ورائدات التغيير في مصر',
    contentDescription: 'الاحتفاء بإنجازات المرأة المصرية ودورها الرائد في المجتمع وفي بيئة العمل وقيادة المشروعات.',
    tieInMethod: 'تسليط الضوء على دور المرأة في قيادة فرق العمل أو تقديم حلول تدعم تطلعاتها وراحتها.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'وراء كل نجاح، إلهام وعزيمة وإرادة لا تعرف المستحيل. 🌸 في اليوم العالمي للمرأة، نحتفي برائدات التغيير، وصانعات الأثر، وشريكات النجاح في مصر والوطن العربي. تحية لكل سيدة تصنع الفارق يومياً بعلمها وعملها وإخلاصها. كل عام وأنتن رمز القوة والإلهام. 💫',
    promptConcept: 'Empowering and inspiring portrait concept of confident Egyptian modern businesswoman, warm uplifting office environment, natural lighting, vibrant floral touch',
  },
  '09/03': {
    occasion: 'يوم الشهيد المصري (ذكرى استشهاد الفريق عبد المنعم رياض)',
    category: 'national',
    contentIdea: 'وقفة إجلال لشهداء مصر الأبرار الذين ضحوا بأرواحهم فداءً لرفعة الوطن',
    contentDescription: 'منشور وقور يستحضر بطولات الجيش والشرطة المصرية وتضحيات الشهداء الأبرار في بناء وطن مستقر.',
    tieInMethod: 'تأكيد الالتزام بالعمل والإنتاج والإخلاص كأعظم وفاء لأرواح الشهداء.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'أحياء عند ربهم يرزقون. 🇪🇬 في يوم الشهيد المصري (9 مارس)، نقف إجلالاً وتكريماً لأرواح أبطالنا الشهداء الذين جادوا بأرواحهم لتظل مصر وطناً عزيزاً كريماً وآمناً. ستبقى تضحياتهم وساماً على صدورنا ونبراساً يدفعنا لمزيد من البناء والإخلاص في كل ما نصنع. رحم الله شهداء الوطن وحفظ مصر وشعبها. 🕊️',
    promptConcept: 'Poetic respectful memorial tribute, Egyptian flag draped over solemn monument, warm morning mist and rays of sun breaking through clouds, profound dignity',
  },
  '16/03': {
    occasion: 'يوم المرأة المصرية (ذكرى ثورة 1919)',
    category: 'national',
    contentIdea: 'تحية خاصة لبنات النيل وأيقونات الصبر والكفاح والريادة في تاريخ مصر المعاصر',
    contentDescription: 'الاحتفاء بالهوية المصرية الأصيلة لسيدات مصر وتاريخهن المشرف في الكفاح الوطني والبناء.',
    tieInMethod: 'إبراز احترام البراند للمرأة المصرية وتقدير دورها الأساسي في كل منزل ومشروع.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'بنت النيل، رمز الصبر والعزيمة والجمال الأصيل. 🇪🇬 في 16 مارس (يوم المرأة المصرية)، فخورين بكل سيدة مصرية بتسيب بصمتها في بيتها وشغلها ومجتمعها. تحية حب وامتنان لكل أم وأخت وابنة تبني مصر بأمل وإخلاص. شاركونا في التعليقات: مين السيدة المصرية اللي ألهمتك في حياتك؟ 💖',
    promptConcept: 'Authentic artistic celebration of modern Egyptian women leadership, subtle Pharaonic and lotus flower ornamental design motifs blended with modern minimal corporate layout',
  },
  '21/03': {
    occasion: 'عيد الأم في مصر + بداية فصل الربيع',
    category: 'social',
    contentIdea: 'رسالة امتنان وحب لست الحبايب + عروض وتكريم مميز للأمهات',
    contentDescription: 'أكبر مناسبة اجتماعية أسرية في مصر؛ مشاركة مشاعر البر والامتنان مع باقة اهتمام خاصة تسعد كل أم.',
    tieInMethod: 'ربط منتجات وخدمات العميل بأنها أرقى ما يمكن إهداؤه لراحة وسعادة ورعاية ست الحبايب.',
    objective: 'تحويل ومبيعات (Conversions)',
    captionDraft: 'يا ست الحبايب يا حبيبة... كل يوم وجودك في حياتنا هو العيد الحقيقي! 💐 بمناسبة عيد الأم، مهما قدمنا مش هيكفي لمسة من إيدك ودعوة من قلبك. في {COMPANY_NAME} حبينا نشارككم التقدير ده بـ {PRODUCTS} مخصصة لإسعاد ست الكل. كل سنة وكل أم مصرية بخير وصحة وتاج فوق رؤوسنا. احكولنا في الكومنتات: إيه أجمل دعوة سمعتوها من مامتكم النهاردة؟ 💖👵',
    promptConcept: 'Heartwarming modern Egyptian family scene, tender emotional moment of a loving mother receiving a luxury gift, soft pastel springtime flowers, warm sunlight pouring through terrace window',
  },
  '07/04': {
    occasion: 'اليوم العالمي للصحة (World Health Day)',
    category: 'international',
    contentIdea: 'نصائح حيوية لتعزيز الصحة والوقاية وجودة الحياة اليومية',
    contentDescription: 'تقديم نصيحة موثوقة تهم الأسرة المصرية وترتبط بالسلامة والراحة النفسية والجسدية.',
    tieInMethod: 'ربط معايير الجودة والأمان في منتجات العميل بالحفاظ على صحة وسلامة عملائه.',
    objective: 'تعليم وتثقيف (Education)',
    captionDraft: 'صحتك هي رأس مالك الحقيقي اللي ملوش بديل! 🩺🌿 في اليوم العالمي للصحة، بنفكرك إن التغييرات البسيطة في عاداتك اليومية بتعمل فرق ضخم على المدى البعيد: نوم منتظم، حركة يومية، واختيارك الدائم للمنتجات الآمنة والمعتمدة. دمتم أنتم وأحبابكم بأتم صحة وعافية. شاركنا في الكومنتات: إيه العادة الصحية اللي محافظ عليها بقالك فترة؟ 💪',
    promptConcept: 'Fresh clean wellness concept, revitalizing morning light, fresh green plant leaves, crystal clear water glass, clean high-tech medical environment',
  },
  '21/04': {
    occasion: 'اليوم العالمي للإبداع والابتكار (World Creativity Day)',
    category: 'international',
    contentIdea: 'كيف نبتكر حلولاً متطورة تسهل حياة عملائنا في مصر',
    contentDescription: 'استعراض أسلوب تفكير الشركة وكيف تطور خدماتها بشكل غير تقليدي لتوفير الوقت والمال للعميل.',
    tieInMethod: 'إبراز نقاط التميز والابتكار (USPs) التي تنفرد بها الشركة في السوق المصري.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'الإبداع مش مجرد فكرة حلوة، الإبداع هو إنك تحل مشكلة صعبة بطريقة سهلة وذكية! 💡🚀 في اليوم العالمي للإبداع والابتكار، فخورين إننا في {COMPANY_NAME} بنطور حلولنا كل يوم عشان نضمن لعملائنا تجربة مريحة وعصرية تسبق التوقعات. شوف كواليس شغلنا وابتكاراتنا عبر الرابط في البايو! ✨',
    promptConcept: 'Futuristic innovation concept, glowing holographic design interface floating above a sleek architectural workspace, inspiring creative atmosphere',
  },
  '25/04': {
    occasion: 'عيد تحرير سيناء (أرض الفيروز)',
    category: 'national',
    contentIdea: 'الاحتفال بعودة أرض الفيروز الغالية وتوجيه التحية لشجاعة الدبلوماسية والجيش المصري',
    contentDescription: 'منشور وطني فخور يحتفي بيوم 25 أبريل واستعادة سيناء كاملة، مع تسليط الضوء على مشاريع التنمية فيها.',
    tieInMethod: 'التأكيد على أن الإصرار والعمل الدؤوب يحققان أصعب الأهداف، وهو المبدأ الذي تتبناه الشركة.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'سيناء أرض الفيروز... ملحمة كفاح ورمز العزة والإرادة المصرية! 🇪🇬 في ذكرى عيد تحرير سيناء (25 أبريل)، نجدد فخرنا ببطولات رجالنا الذين استردوا كل حبة رمل بالدماء والسلام والتفاوض الصلب. كل عام ومصرنا الغالية وشعبها العظيم في عزة ورفعة ونماء. 🕊️🏜️',
    promptConcept: 'Majestic Sinai desert mountains at sunrise, glowing turquoise gemstone reflection, Egyptian flag proudly standing tall against vast dramatic sky, epic landscape photography',
  },
  '01/05': {
    occasion: 'عيد العمال العالمي والمصري (بناة مصر)',
    category: 'national',
    contentIdea: 'تحية تقدير وإجلال للأيدي المصرية الشقية العاملة التي تبني وتعمر كل شبر في الوطن',
    contentDescription: 'الاعتراف بفضل العمال وفريق العمل الداخلي والكوادر المصرية المخلصة التي تضمن جودة كل منتج وخدمة.',
    tieInMethod: 'تسليط الضوء على كواليس العمل والجهد المبذول خلف الكواليس لتقديم أعلى جودة لعملائنا.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'سواعد تبني، وقلوب تخلص، وأيادٍ شقية تصنع المستقبل! 🛠️🇪🇬 في عيد العمال (1 مايو)، نتوجه بأسمى آيات الشكر والامتنان لكل عامل مصري مخلص يسعى بشرف في كل ميادين الإنتاج. وشكر خاص لفريق عمل {COMPANY_NAME}؛ أبطالنا الحقيقيين اللي بفضل جهدهم المستمر بنقدر نقدم لكم أعلى معايير الجودة كل يوم. كل عام وأنتم سند الوطن وفخره! 👏❤️',
    promptConcept: 'Dedicated hardworking Egyptian craftsman and professional engineers, hands of expertise crafting high precision work, warm industrial golden light, dignity and pride in craftsmanship',
  },
  '05/06': {
    occasion: 'اليوم العالمي للبيئة (World Environment Day)',
    category: 'international',
    contentIdea: 'ممارسات الاستدامة والمسؤولية البيئية والترشيد في مجتمعنا',
    contentDescription: 'دعوة للحفاظ على بيئة مصر ومواردها والحد من الهدر، واستعراض الإجراءات الصديقة للبيئة في الشركة.',
    tieInMethod: 'إبراز التزام الشركة بالحفاظ على البيئة والاستدامة وجودة الحياة.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'الأرض بيتنا المشترك، وكل خطوة صغيرة بتعمل فرق كبير لمستقبل ولادنا! 🌍🌱 في اليوم العالمي للبيئة، بنشارككم خطواتنا العملية في ترشيد الموارد ودعم الحلول المستدامة. شاركونا في الكومنتات: إيه الخطوة اللي بتعملها يومياً في بيتك أو شغلك للحفاظ على البيئة؟ ♻️',
    promptConcept: 'Eco-conscious green architecture in modern Egypt, lush green plants growing on sustainable sleek solar-powered building, clear blue sky and pristine sunlight',
  },
  '21/06': {
    occasion: 'يوم الأب العالمي + بداية الانقلاب الصيفي وبداية الصيف رسمياً',
    category: 'social',
    contentIdea: 'رسالة تقدير لسند العائلة وقدوتها (الأب) + انطلاق موسم الصيف وأجواء الإجازات',
    contentDescription: 'الاحتفاء بالأب وتضحياته التي لا تنتهي، مع إشارة مبهجة لبداية فصل الصيف والشمس الساطعة في مصر.',
    tieInMethod: 'ربط دور الأب بالبحث عن الأمان والأفضل لعائلته وتوفير خدمات موثوقة تلبي طموحاته.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'السند الحقيقي، والعمود الفقري لكل بيت، والقدوة اللي بتطمنا بنظرة واحدة. 👔❤️ في يوم الأب وبداية موسم الصيف، بنقول لكل أب مصري: شكراً على تعبك وعطائك اللي ملوش حدود. منشن لوالدك وقوله كلمة حلوة من قلبك النهاردة! 👨‍👧‍👦☀️',
    promptConcept: 'Heartfelt warm moment of a father walking with his child during summer golden hour on a serene Mediterranean coastal promenade in Alexandria, warm nostalgic atmosphere',
  },
  '27/06': {
    occasion: 'اليوم العالمي للمشاريع الصغيرة والمتوسطة (World MSME Day)',
    category: 'international',
    contentIdea: 'دعم رواد الأعمال وأصحاب المشروعات في مصر ونصائح لتوسيع البيزنس',
    contentDescription: 'تسليط الضوء على أهمية المشروعات الصغيرة كعصب للاقتصاد المصري وتقديم نصائح تسويقية وتشغيلية.',
    tieInMethod: 'استعراض كيف تدعم خدمات الشركة نمو البيزنس وتسهيل أعمال الشركات الناشئة.',
    objective: 'تعليم وتثقيف (Education)',
    captionDraft: 'كل كيان كبير بدأ بحلم صغير وإصرار مكمل! 💼📈 في اليوم العالمي للمشاريع الصغيرة والمتوسطة، بنحيي كل رائد أعمال مصري بيعافر كل يوم علشان يكبر مشروعه ويخلق فرص جديدة. نصيحتنا ليك النهاردة: ركز على جودة تجربة العميل وبناء الثقة، لأنها سر النمو المستدام. احكيلنا عن مشروعك في التعليقات وخلينا نتعرف عليك! 👇🚀',
    promptConcept: 'Energetic Egyptian startup team gathered around an interactive whiteboard in a stylish modern co-working hub in Cairo, bright natural sunlight, ambition and teamwork',
  },
  '30/06': {
    occasion: 'ذكرى ثورة 30 يونيو وتثبيت دعائم الدولة المصرية',
    category: 'national',
    contentIdea: 'الاحتفال بإرادة الشعب المصري وتجديد العهد على البناء والتنمية والاستقرار',
    contentDescription: 'منشور وطني يعبر عن تطلعات المصريين نحو الاستقرار والعمل والبناء المستمر.',
    tieInMethod: 'التأكيد على أن عزيمة الشعب هي المحرك للنهضة الشاملة ومسيرة الإنتاج.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'إرادة شعب صنع مستقبله بيده وسطر تاريخاً جديداً من الاستقرار والبناء. 🇪🇬 في ذكرى ثورة 30 يونيو المجيدة، نجدد فخرنا بمصرنا الحبيبة ومسيرتها التنموية الواعدة نحو غدٍ أفضل لكل أبنائها. كل عام ومصر وشعبها العظيم في أمن وسلام وازدهار. 🦅🇪🇬',
    promptConcept: 'Modern patriotic pride, panoramic view of the New Administrative Capital iconic tower and new bridges under a glorious golden sunrise, Egyptian flags proudly fluttering',
  },
  '23/07': {
    occasion: 'ذكرى ثورة 23 يوليو المجيدة',
    category: 'national',
    contentIdea: 'محطة فارقة في تاريخ مصر وبناء النهضة الوطنية والصناعية والاجتماعية',
    contentDescription: 'استرجاع قيم العزة والاستقلال والريادة المصرية في ذكرى 23 يوليو.',
    tieInMethod: 'التأكيد على مبدأ الريادة والاعتماد على الكفاءة الوطنية في تقديم الخدمات والمنتجات.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'في ذكرى ثورة 23 يوليو، نستحضر محطة تاريخية بارزة أعادت صياغة الواقع المصري وبنت دعائم الصناعة والريادة الوطنية. 🇪🇬 كل عام ومصرنا العزيزة تمضي بثبات في طريق البناء والرفعة والاستقلال. حفظ الله مصر وأدام عزها. 🕊️🇪🇬',
    promptConcept: 'Historical legacy meets modern achievement, dignified artistic representation of Egyptian industrial strength and heritage, elegant cinematic lighting',
  },
  '12/08': {
    occasion: 'اليوم الدولي للشباب (International Youth Day)',
    category: 'international',
    contentIdea: 'طاقة الشباب المصري وأفكارهم المبتكرة وقدرتهم على قيادة المستقبل',
    contentDescription: 'الاحتفاء بالشباب وتطلعاتهم وتشجيعهم على استثمار مهاراتهم في التكنولوجيا والريادة.',
    tieInMethod: 'الربط بين روح الشباب المتجددة وبين الابتكار والتحديث المستمر في منتجات الشركة.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'طاقة لا تهدأ، وأفكار بتغير قواعد اللعبة! ⚡🚀 في اليوم الدولي للشباب، بنحتفي بطاقات الشباب المصري المبدع اللي بيثبت كل يوم إن مفيش سقف لطموحه. في {COMPANY_NAME} فخورين بكوادرنا الشابة اللي بتضخ دايماً أفكار عصرية وجديدة. إيه أكبر هدف شغال عليه في رحلتك المهنية الفترة دي؟ شاركنا في الكومنتات! 💡',
    promptConcept: 'Dynamic modern youth in Cairo engaged in cutting-edge tech and creative media, vibrant studio lighting with energetic warm highlights, inspiring future-forward mood',
  },
  '19/08': {
    occasion: 'اليوم العالمي للتصوير الفوتوغرافي (World Photography Day)',
    category: 'international',
    contentIdea: 'سحر تخليد اللحظات وقوة الصورة في سرد القصص ونقل الحقيقة',
    contentDescription: 'منشور بصري جذاب عن التفاصيل الجميلة التي تصنع الفارق وقوة الهوية البصرية.',
    tieInMethod: 'تسليط الضوء على اهتمام البراند بأدق التفاصيل البصرية والجودة التي يراها العميل بعينه.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'الصورة مش مجرد لقطة، الصورة حكاية بتعيش وتفاصيل بتفضل في الذاكرة. 📸✨ في اليوم العالمي للتصوير الفوتوغرافي، بنشارككم شغفنا بالاهتمام بأدق التفاصيل في كل ما نقدمه ليكم. ورينا صورة مميزة التقطتها بموبايلك في مصر مؤخراً في التعليقات وخلينا نشوف إبداعكم! 🌅🇪🇬',
    promptConcept: 'High-end vintage and mirrorless camera setup on rustic wooden desk, golden hour light highlighting sharp camera lens reflections, aesthetic artistic atmosphere',
  },
  '27/09': {
    occasion: 'اليوم العالمي للسياحة (World Tourism Day)',
    category: 'international',
    contentIdea: 'جمال مصر وتنوع آثارها وشواطئها وكرم الضيافة المصرية الأصيلة',
    contentDescription: 'منشور سياحي وثقافي فخور يسلط الضوء على سحر مصر من الأهرامات إلى شواطئ البحر الأحمر والمتوسط.',
    tieInMethod: 'الربط بين كرم الضيافة وحسن الاستقبال المصري وبين أسلوب خدمة العملاء والاهتمام بهم في الشركة.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'مصر أم الدنيا وأرض الحضارة اللي بتبهر العالم في كل عصر! 🇪🇬✨ في اليوم العالمي للسياحة، بنفتخر بجمال بلدنا وتنوعها من سحر الآثار الخالدة إلى شواطئنا الخلابة وروح شعبها الطيب المضياف. لو هتختار مكان مصري واحد تقضي فيه يومك المفضل، هتختار إيه؟ شاركنا في الكومنتات! 🏖️🏛️',
    promptConcept: 'Breathtaking panoramic view blending ancient Giza pyramids and modern vibrant Nile waterfront in Cairo at golden sunset, magnificent travel photography style',
  },
  '06/10': {
    occasion: 'عيد القوات المسلحة ونصر 6 أكتوبر العظيم (اليوبيل الذهبي للانتصار)',
    category: 'national',
    contentIdea: 'ملحمة العبور التاريخية وعزيمة لا تعرف المستحيل سطرها خير أجناد الأرض',
    contentDescription: 'أعظم مناسبة وطنية في وجدان الشعب المصري؛ منشور وقور وفخور يستلهم دروس التخطيط المحكم والعزيمة والإصرار.',
    tieInMethod: 'استلهام روح نصر أكتوبر في التخطيط العلمي الدقيق والإصرار على النجاح والريادة في كل خدمة نقدمها.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'يوم استردت فيه مصر كرامتها وأثبت الجندي المصري أن الإرادة والتخطيط قادران على قهر المستحيل! 🇪🇬 في ذكرى نصر 6 أكتوبر العظيم، نوجه تحية فخر وإجلال لرجال القوات المسلحة البواسل وشهدائنا الأبرار أصحاب أعظم ملحمة عسكرية في العصر الحديث. سيبقى نصر أكتوبر درساً خالداً في التخطيط والعزيمة لكل مصري. كل عام ومصرنا الحبيبة شامخة عزيزة ومنتصرة! 🦅🇪🇬🎖️',
    promptConcept: 'Epic heroic national pride tribute, triumphant crossing monument, Egyptian soldiers banner silhouettes against majestic golden sunset, deeply dignified and emotional',
  },
  '10/10': {
    occasion: 'اليوم العالمي للصحة النفسية (World Mental Health Day)',
    category: 'international',
    contentIdea: 'أهمية راحة البال، التوازن بين العمل والحياة، وتقليل التوتر وضغوط اليوم',
    contentDescription: 'منشور دافئ وإنساني يقدم رسالة طمأنينة ويشجع المتابعين على أخذ قسط من الراحة والاعتناء بأنفسهم.',
    tieInMethod: 'التأكيد على أن راحة بال العميل وتخليصه من عناء المشكلات هي الهدف الأساسي من وراء خدماتنا.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'راحتك النفسية مش رفاهية، دي الأولوية الأولى علشان تقدر تكمل رحلتك بقوة. 🌿🕊️ في اليوم العالمي للصحة النفسية، بنفكرك: خد نفس عميق، هدي سرعتك، ومتقساش على نفسك. في {COMPANY_NAME}، هدفنا دايماً نشيل عنك قلق {SERVICES} ونسيبلك راحة البال. شاركنا في الكومنتات: إيه أكتر حاجة بسيطة بتهدي يومك وترجعلك طاقتك؟ ☕🧘‍♂️',
    promptConcept: 'Calm serene zen atmosphere, peaceful green indoor plants, warm cup of tea beside open book on minimalist wooden table, soft morning sunlight casting gentle shadows',
  },
  '24/10': {
    occasion: 'عيد السويس القومي (ذكرى المقاومة الشعبية 1973)',
    category: 'national',
    contentIdea: 'بطولات المقاومة الشعبية الباسلة لأبناء السويس البواسل وتلاحم الشعب والجيش',
    contentDescription: 'تحية فخر لمدينة السويس الباسلة وبطولات أهاليها في صد العدوان ورد كيد المعتدين.',
    tieInMethod: 'الربط بين تماسك أهل السويس والعمل الجماعي وبين قيمة الفريق الواحد والشغف المشترك.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'السويس بلد الغريب... قلعة الصمود وبوابة النصر! 🇪🇬 في 24 أكتوبر (عيد السويس القومي)، بنحيي أرواح أبطال المقاومة الشعبية البواسل ورجال الفدائيين اللي سطروا ملحمة فداء وتضحية دفاعاً عن مدينتهم والوطن. تحية حب واعتزاز لكل أهالي السويس الكرام. كل عام ومصرنا بخير وعزة. ⚓🛡️',
    promptConcept: 'Heroic maritime city view of Suez canal harbor at dawn, historic monument silhouettes with warm rising sun, brave historic Egyptian atmosphere',
  },
  '04/11': {
    occasion: 'عيد الحب المصري (فكرة الكاتب مصطفى أمين)',
    category: 'social',
    contentIdea: 'الاحتفال بعيد الحب المصري الأصيل، حب الوطن، حب العائلة، ومحبة الأصدقاء وجبر الخواطر',
    contentDescription: 'مناسبة مصرية خالصة أطلقها الصحفي الكبير مصطفى أمين للدعوة لنشر الود والمحبة في شوارع وبيوت مصر.',
    tieInMethod: 'تسليط الضوء على العلاقة القائمة على الود والأمانة مع عملائنا الكرام في مصر.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'في مصر، الحب له طعم تاني خالص... حب أصل وجدعنة وجبر خواطر ولمّة أهل طيبين! ❤️🇪🇬 بمناسبة عيد الحب المصري (4 نوفمبر)، بنقول لكل عملائنا وأصدقائنا: شكراً على وجودكم وثقتكم ومحبتكم اللي بتكبرنا كل يوم. عبر النهاردة عن تقديرك لشخص عزيز عليك بكوباية شاي أو كلمة حلوة من القلب. مين أول شخص جه في بالك؟ منشن ليه واكتبله كلمة تسعده! 👇💌',
    promptConcept: 'Warm authentic Cairo evening gathering, warm fairy lights glowing over an open-air historic cafe, genuine laughter and warm friendship, tasteful modern Egyptian aesthetic',
  },
  '14/11': {
    occasion: 'اليوم العالمي للجودة (World Quality Day)',
    category: 'international',
    contentIdea: 'معايير الجودة الصارمة وكيف نضمن أعلى أداء بلا أي تنازلات',
    contentDescription: 'استعراض مراحل فحص الجودة والتدقيق الهندسي والمهني الذي يمر به كل منتج أو خدمة.',
    tieInMethod: 'إبراز الشفافية ونقاط التميز (USPs) وضمانات الجودة المكتوبة المقدمة للعميل.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'الجودة مش مجرد كلمة بنقولها في الإعلانات، الجودة هي ما نفعله في غياب الرقابة! 🔍✨ في اليوم العالمي للجودة، بنفكركم إن كل تفصيلة في {COMPANY_NAME} بتخضع لأعلى المعايير لأننا بنعتبر ثقتكم هي رأس مالنا الحقيقي. ضماننا مش كلام، ضماننا تجربة حقيقية معتمدة. حابب تعرف إزاي بنضمن جودة {SERVICES}؟ تواصل معنا واكتشف الفرق بنفسك! 🤝📊',
    promptConcept: 'Ultra-modern quality inspection laboratory or precision testing environment, glowing holographic checklist of perfection and standards, pristine lighting, elite corporate precision',
  },
  '27/11': {
    occasion: 'موسم الجمعة البيضاء في مصر (White Friday / Black Friday Egypt)',
    category: 'commercial',
    contentIdea: 'أكبر عروض وتخفيضات وباقات العام بمصداقية كاملة ودون عروض وهمية',
    contentDescription: 'أكبر حدث تسوق تجاري في مصر والشرق الأوسط؛ طرح أقوى باقة توفيرية سنوية وحوافز حصرية للشراء الفوري.',
    tieInMethod: 'تقديم عرض حقيقي لا يقاوم من خدمات العميل مع التأكيد على وضوح الأسعار بلا شروط مستترة.',
    objective: 'تحويل ومبيعات (Conversions)',
    captionDraft: 'الجمعة البيضاء وصلت بأقوى العروض الحقيقية اللي استنيتوها طول السنة! 🔥🛒 في {COMPANY_NAME}، مفيش خصومات وهمية ولا كلام إعلانات؛ بنقدملكم أكبر باقة توفير على {PRODUCTS} بأسعار حصرية لفترة محدودة جداً. الفرصة مبتجيش غير مرة واحدة في السنة، احجز عروضك دلوقتي قبل انتهاء الكمية المتاحة عبر الرسائل أو الخط الساخن! ⚡🛍️',
    promptConcept: 'Luxury commercial Black/White Friday advertising banner layout, floating sleek black glossy podium with golden ribbon gifts and subtle bright neon accents, premium shopping vibe',
  },
  '03/12': {
    occasion: 'اليوم العالمي للأشخاص ذوي الهمم (قادرون باختلاف)',
    category: 'international',
    contentIdea: 'الإشادة بعزيمة أبطالنا "قادرون باختلاف" وأهمية الإتاحة والدمج الكامل في المجتمع المصري',
    contentDescription: 'منشور إنساني وتوعوي يلهم المتابعين بقصص نجاح أصحاب الهمم ودور الشركات في توفير بيئة دامجة ومتاحة للجميع.',
    tieInMethod: 'التأكيد على سهولة الوصول للخدمات وتوفير دعم مخصص لراحة الجميع.',
    objective: 'بناء ثقة ومصداقية (Trust)',
    captionDraft: 'عزيمة تصنع المعجزات وإرادة تلهمنا جميعاً! 🌟♿ في اليوم العالمي للأشخاص ذوي الإعاقة (قادرون باختلاف)، نوجه كل التحية والتقدير لأبطالنا الذين يثبتون كل يوم أن التحدي الحقيقي يصنع النجاح والتميز. ونجدد التزامنا في {COMPANY_NAME} بتوفير بيئة دامجة ومتاحة تضمن للجميع تجربة كريمة وسلسة. كل عام وأنتم فخر مصر ومصدر إلهامها! ❤️👏',
    promptConcept: 'Uplifting modern scene of determination and athletic/artistic achievement in Egypt, dignified lighting, warm supportive community, modern and inspiring composition',
  },
  '18/12': {
    occasion: 'اليوم العالمي للغة العربية (لغة الضاد وسحر البيان)',
    category: 'international',
    contentIdea: 'جمال وبلاغة اللغة العربية وأصالة الخط العربي ودوره في التعبير والإبداع',
    contentDescription: 'الاحتفاء بلغة الضاد وجمالياتها مع إبراز بلاغة المحتوى وفخامة الحروف والخطوط العربية الأصيلة.',
    tieInMethod: 'الربط بين فصاحة ووضوح البيان وبين شفافية التواصل والوضوح التام في التعامل مع العملاء.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'إِنَّ الَّذي مَلَأَ اللُغاتِ مَحاسِناً، جَعَلَ الجَمالَ وَسِرَّهُ في الضادِ! 📜✨ في اليوم العالمي للغة العربية (18 ديسمبر)، نحتفي بأعظم وأثرى لغات الأرض، لغة الفصاحة والبيان والخطوط الساحرة. فخورين بلغتنا وهويتنا العربية الأصيلة التي نتواصل بها معكم كل يوم. إيه أجمل كلمة أو بيت شعر عربي بتحب تردده دايماً؟ شاركنا في الكومنتات! 🖋️',
    promptConcept: 'Masterpiece of modern 3D Arabic calligraphy sculpted in glowing warm bronze and gold floating gracefully in a sleek architectural gallery with ambient spotlighting',
  },
  '23/12': {
    occasion: 'عيد النصر في بورسعيد (جلاء العدوان الثلاثي 1956)',
    category: 'national',
    contentIdea: 'صمود بورسعيد الباسلة ورسالة عزة وطنية في الدفاع عن أرض القناة والوطن',
    contentDescription: 'استذكار بطولات أهالي بورسعيد وشجاعتهم التاريخية التي ضربت أروع الأمثلة في الفداء.',
    tieInMethod: 'تأكيد قيم الصمود والوفاء بالعهد في خدمة عملائنا والالتزام بكل وعد.',
    objective: 'توعية بالعلامة (Awareness)',
    captionDraft: 'بورسعيد المدينة الباسلة... رمز الفداء والصمود وكسر كبرياء العدوان! 🇪🇬⚓ في 23 ديسمبر (عيد النصر)، نحيي أبطال بورسعيد الشجعان الذين سطروا بدمائهم أروع صفحات النضال الوطني دفاعاً عن مصر وكرامتها. تحية إجلال لكل شعب بورسعيد العظيم، وحفظ الله مصرنا وطناً منتصراً شامخاً. 🕊️🇪🇬',
    promptConcept: 'Historic lighthouse and majestic entrance of Port Said canal at sunrise, vintage ships and crisp morning reflections, dignified patriotic aesthetic',
  },
  '25/12': {
    occasion: 'عيد الميلاد المجيد (التقويم الغربي) وأجواء نهاية العام',
    category: 'christian',
    contentIdea: 'تهنئة دافئة بعيد الميلاد الغربي وتمنيات بموسم أعياد مليء بالبهجة والسلام',
    contentDescription: 'مشاركة مشاعر الفرح بالأعياد الشتوية ورسائل المحبة والتسامح مع بداية العد التنازلي لرأس السنة.',
    tieInMethod: 'تقديم عروض موسم الأعياد وتجهيز الهدايا الختامية للعملاء المميزين.',
    objective: 'تفاعل ومشاركات (Engagement)',
    captionDraft: 'أجواء شتوية دافئة، وأضواء تملأ القلوب بالبهجة والمحبة! 🎄✨ بمناسبة عيد الميلاد المجيد (وفق التقويم الغربي)، نتمنى لكل متابعينا وعملائنا الكرام ولعائلاتهم أياماً مليئة بالسلام والسرور ودفء اللقاءات. ميلاد مجيد وأعياد سعيدة على الجميع! 🕊️❤️',
    promptConcept: 'Cozy and luxurious festive holiday interior, warm fireplace glow, elegant decorated pine tree with warm golden baubles and minimalist tasteful ornaments, joyful serenity',
  },
  '31/12': {
    occasion: 'ليلة رأس السنة وحصاد العام واستقبال العام الجديد',
    category: 'social',
    contentIdea: 'حصاد إنجازات العام مع عملائنا وكلمة شكر وامتنان لكل من كان جزءاً من نجاحنا',
    contentDescription: 'منشور ختامي مؤثر يستعرض الأرقام والنجاحات المتحققة خلال الـ 365 يوماً الماضية والتطلع للمستقبل.',
    tieInMethod: 'إشراك العميل في قصة النجاح وتأكيد أنه الشريك الأهم في كل إنجاز تحقق.',
    objective: 'احتفاظ وولاء (Retention)',
    captionDraft: '365 يوماً من العمل والشغف والإنجاز... ومكنش ممكن نصل لهنا بدون ثقتكم ودعمكم المستمر! 🥂✨ مع آخر ساعات السنة، بنقول من قلوبنا: شكراً لكل عميل وشريك وضع ثقته في {COMPANY_NAME}. فخورين بكل خطوة خطيناها سوا، ومتحمسين للي جاي لأننا مجهزينلكم في السنة الجديدة مفاجآت وتطويرات هتفرحكم. شاركونا في الكومنتات: إيه أجمل ذكرى أو إنجاز حققته في سنتك؟ كل سنة وأنتم طيبين وبألف خير! 🎆🎉',
    promptConcept: 'Spectacular New Year Eve fireworks illuminating the Nile river and modern suspension bridges in Cairo at midnight, joyous golden reflections on water, breathtaking celebratory mood',
  },
};

// Islamic Dynamic / Estimated Moments (Documented as Estimated by Egyptian Dar Al Ifta)
interface IslamicMomentSeed {
  approxMonthDay: string; // "DD/MM" approximate anchor in 2026/2027 calendar
  name: string;
  idea: string;
  desc: string;
  tieIn: string;
  obj: MarketingObjective;
  caption: string;
  prompt: string;
}

const ISLAMIC_ESTIMATED_MOMENTS: IslamicMomentSeed[] = [
  {
    approxMonthDay: '16/01',
    name: 'ذكرى الإسراء والمعراج الشريفة (27 رجب - تقديري فلكياً)',
    idea: 'معاني الصبر والفرج وعروج الهمم إلى أعلى الآفاق',
    desc: 'منشور روحي وقيم نبيلة في ليلة الإسراء والمعراج، وتذكير بأن الفرج يأتي بعد كل ضيق.',
    tieIn: 'التأكيد على أن الطموح والارتقاء بالجودة هما عروج حقيقي في خدمة العميل.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'سُبحانَ الَّذي أَسرى بِعَبدِهِ لَيلاً... 🌙✨ في ليلة الإسراء والمعراج المباركة (تقدير فلكي)، نسأل الله تعالى أن يفرج عن كل مهموم وأن يرفع درجاتكم في الدنيا والآخرة. ليلة تعلمنا أن بعد كل عسر يسراً، ومع كل صبر فتوحاً وبركة. طبتم وطابت أوقاتكم بكل خير وسلام. 🕊️',
    prompt: 'Magnificent Islamic architectural heritage, glowing warm crescent moon and subtle stars in midnight sky, illuminated minarets and intricate arabesque geometry, peace and transcendence',
  },
  {
    approxMonthDay: '03/02',
    name: 'ليلة النصف من شعبان وتحويل القبلة (تقديري فلكياً)',
    idea: 'ليلة المغفرة والصفاء واستعداد القلوب لاستقبال نسائم رمضان',
    desc: 'منشور ديني مبارك عن تصفية القلوب والمسامحة والتهيؤ لشهر الصيام.',
    tieIn: 'دعوة للتسامح وبناء علاقات إنسانية صادقة مع العملاء والشركاء.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'اللهم بارك لنا في شعبان وبلغنا رمضان لا فاقدين ولا مفقودين. 🤲✨ في ليلة النصف من شعبان المباركة، نسأل الله أن يغفر الذنوب ويجبر الخواطر ويملأ بيوتكم وأيامكم خيراً وبركة وسكينة. كل عام وأنتم وعائلاتكم الكريمة بألف خير. ❤️🌙',
    prompt: 'Peaceful spiritual night ambient, warm lantern (fanoos) softly glowing beside ancient Quranic calligraphy, soft shadows, serene Islamic geometry background',
  },
  {
    approxMonthDay: '18/02',
    name: 'رؤية هلال رمضان وبداية شهر الخير والبركات (تقديري فلكياً)',
    idea: 'تهنئة شعب مصر والأمة الإسلامية بحلول شهر رمضان المبارك واللمة الرمضانية',
    desc: 'استقبال أعظم مواسم الخير في مصر؛ التهنئة بحلول الشهر الفضيل وإعلان مواعيد العمل في رمضان.',
    tieIn: 'ربط روح التعاون والخير في رمضان بتسهيل الخدمات وتقديم عروض الخير الرمضانية.',
    obj: 'توعية بالعلامة (Awareness)',
    caption: 'أهلاً بشهر الخير والبركة واللمة اللي بتجمعنا! 🌙🏮 تهنئكم أسرة {COMPANY_NAME} بحلول شهر رمضان المبارك (أعاده الله علينا وعليكم باليمن والإيمان). نسأل الله أن يتقبل صيامكم وطاعاتكم وأن يجعل بيوتكم عامرة بالخير والمحبة. شاركونا فرحتكم في أول يوم صيام، وكل سنة وأنتم سالمين! 💫✨',
    prompt: 'Authentic warm Egyptian Ramadan welcoming scene, glowing traditional copper Fanous lantern on rich table runner, dried dates and tea, soft warm lighting, iconic Cairo balcony atmosphere',
  },
  {
    approxMonthDay: '27/02',
    name: 'رمضان في مصر: بركة العزومات وصلة الرحم والخير المستمر',
    idea: 'عادات المصريين الجميلة في رمضان وإكرام الضيف وموائد الرحمن',
    desc: 'تسليط الضوء على جوهر الكرم المصري وأهمية صلة الأرحام والتكافل المجتمعي في رمضان.',
    tieIn: 'التأكيد على أن خدمة العميل في شركتنا تقوم على نفس مبادئ الكرم والاهتمام الصادق.',
    obj: 'تفاعل ومشاركات (Engagement)',
    caption: 'رمضان في مصر حاجة تانية خالص... ريحة الكنافة، ولمّة العيلة، وصوت أذان المغرب اللي بيرد الروح! 🥘🌙 في {COMPANY_NAME}، بنفكركم إن أحلى ما في رمضان هو لمّة الحبايب وصلة الرحم. احكولنا في الكومنتات: إيه الطبق اللي لازم يكون موجود على سفرة أول أسبوع رمضان في بيتكم؟ 🥟😋',
    prompt: 'Joyful family Ramadan Iftar gathering table in an upscale modern Egyptian home, appetizing authentic dishes with rising steam, warm ambient family lighting, heartwarming togetherness',
  },
  {
    approxMonthDay: '15/03',
    name: 'العشر الأواخر من رمضان وتحري ليلة القدر (خير من ألف شهر)',
    idea: 'الدعاء والتضرع واستثمار الليالي الوترية المباركة في الطاعة والبر',
    desc: 'منشور روحي عميق يواكب أعظم ليالي العام ويدعو للمحبة والسكينة والرجاء.',
    tieIn: 'إبراز القيم الأخلاقية والأمانة التي تحكم كافة تعاملات الشركة.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'اللهم إنك عفوٌ تحب العفو فاعفُ عنا. 🤲✨ نسائم العشر الأواخر من رمضان، ليالٍ مباركة فيها ليلة خيرٌ من ألف شهر. نسأل الله أن يكتب لكم ولأحبابكم القبول والمغفرة وصالح الدعوات، وأن يرزقكم السكينة وراحة البال. تقبل الله طاعاتكم وصالح أعمالكم. 🕊️🌙',
    prompt: 'Spiritual quiet mosque courtyard at night during Tahajjud prayer, soft glowing floor lanterns, serene arches and tranquil starlight, deeply reverent and contemplative',
  },
  {
    approxMonthDay: '20/03',
    name: 'وقفة عيد الفطر المبارك وتجهيزات العيد في مصر (تقديري فلكياً)',
    idea: 'فرحة الوقفة وأغاني العيد وكعك العيد وتحضيرات البهجة مع العائلة',
    desc: 'يوم الوقفة الاستثنائي في مصر؛ تجهيز الملابس الجديدة والكعك وتجهيز العيدية للأطفال.',
    tieIn: 'التمني بإجازة عيد سعيدة مع استمرار قنوات التواصل للطوارئ أو الحجوزات.',
    obj: 'تفاعل ومشاركات (Engagement)',
    caption: 'يا ليلة العيد آنستينا... وجددتي الأمل فينا! 🎊🍪 كل سنة وأنتم وأحبابكم بألف خير بمناسبة وقفة عيد الفطر المبارك! ريحة الكعك والبسكويت، وفرحة اللبس الجديد، ولمّة الأحباب هي اللي بتصنع بهجة العيد في مصر. أسرة {COMPANY_NAME} تتمنى لكم عيد فطر سعيد ومبارك. جاهزين للعيدية ولا خلاص كبرتوا عليها؟ احكولنا في التعليقات! 🎁🎉',
    prompt: 'Festive Egyptian Eid preparation table, artisan golden Kahk cookies with powdered sugar dust in beautiful vintage glass plates, warm family living room with Eid decorations',
  },
  {
    approxMonthDay: '21/03',
    name: 'أول أيام عيد الفطر المبارك (فرحة الجائزة)',
    idea: 'تهنئة رسمية ومبهجة بمناسبة حلول عيد الفطر المبارك',
    desc: 'منشور التهنئة الرئيسي بعيد الفطر السعيد ومشاركة فرحة العيد مع العملاء والشركاء.',
    tieIn: 'تقديم باقة عيدية أو كود خصم حصري لمتابعي الصفحة خلال أيام العيد.',
    obj: 'احتفاظ وولاء (Retention)',
    caption: 'عيد فطر مبارك وسعيد عليكم وعلى كل من تحبون! 🌙🎈 تقبل الله منا ومنكم الصيام والقيام وصالح الأعمال، وجعل أيامكم كلها أعياداً وفرحاً وسلاماً. من أسرة {COMPANY_NAME}، عيدية خاصة مستنياكم عبر الرسائل لتكتمل فرحة العيد. عيدكم مبارك! 🥳✨',
    prompt: 'Uplifting festive luxury Eid greeting layout, floating golden Arabic typography reading Eid Mubarak, soft pastel balloons, elegant modern celebratory background',
  },
  {
    approxMonthDay: '27/05',
    name: 'العشر الأوائل من ذي الحجة (أفضل أيام الدنيا - تقديري فلكياً)',
    idea: 'فضل العمل الصالح والتكبير والذكر في الأيام المعلومات',
    desc: 'التذكير بفضل الأيام العشر الأولى من ذي الحجة والحث على التكافل والإحسان.',
    tieIn: 'التأكيد على قيم الإحسان في العمل وتقديم أقصى درجات الإتقان لعملائنا.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام. 🕋✨ مع إشراقة العشر الأوائل من ذي الحجة، نسأل الله أن يملأ قلوبكم بالسكينة وبيوتكم بالبركة. أيام مباركة نغتنمها بالذكر والإحسان والعمل الصالح. تقبل الله طاعاتكم وبارك في أعماركم. 🤲🕊️',
    prompt: 'Solemn and serene visual of Kaaba holy sanctuary background bathed in golden light, crisp white pilgrim fabric textures, sacred atmosphere of peace and devotion',
  },
  {
    approxMonthDay: '28/05',
    name: 'يوم عرفة المبارك (خير الدعاء دعاء يوم عرفة - تقديري فلكياً)',
    idea: 'الدعاء المستجاب في أعظم أيام الأرض ورجاء المغفرة والرحمة للجميع',
    desc: 'منشور روحي في يوم الحج الأكبر؛ يوم الدعاء والرجاء وغفران الذنوب.',
    tieIn: 'مشاركة الدعاء الصادق للوطن والأمة والعملاء بالسلام والتوفيق والسداد.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ... لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ 🕋 في يوم عرفة المبارك، خير يوم طلعت عليه الشمس، نسأل الله الكريم أن يستجيب دعواتكم، وأن يغفر ذنوبكم، وأن ينعم على مصر وأمتنا بالأمن والأمان والسلام. لا تنسونا وأحبابكم من صالح دعائكم في هذه الساعات العظيمة. 🤲❤️',
    prompt: 'Mount Arafat spiritual sunrise, ocean of peaceful pilgrims in white Ihram garments making sincere prayers, soft ethereal divine golden rays breaking through morning mist',
  },
  {
    approxMonthDay: '29/05',
    name: 'عيد الأضحى المبارك (الأيام المباركة واللمة والفداء - تقديري فلكياً)',
    idea: 'تهنئة حلول عيد الأضحى المبارك ومظاهر الفرح والأضاحي واللمة في مصر',
    desc: 'المنشور الاحتفالي الرئيسي بعيد الأضحى والتواصل الدافئ مع العملاء.',
    tieIn: 'التأكيد على قيم التضحية والعطاء والبذل وتقديم الشكر للعملاء المخلصين.',
    obj: 'توعية بالعلامة (Awareness)',
    caption: 'عيد أضحى مبارك وسعيد عليكم جميعاً! 🐑🎉 أعاده الله علينا وعليكم وعلى مصر الغالية بالخير واليمن والبركات. تقبل الله أضاحيكم وطاعاتكم، وجعل بيوتكم عامرة بالفرحة واللمّة الحلوة والشبع والرضا. كل عام وأنتم بخير وصحة وعافية من أسرة {COMPANY_NAME}! 🎈❤️',
    prompt: 'Joyous Eid Al-Adha festive atmosphere, warm modern greeting card design with stylized gold geometric sheep icon, rich royal colors, celebratory confetti and lighting',
  },
  {
    approxMonthDay: '17/06',
    name: 'رأس السنة الهجرية الجديدة 1448 هـ (تقديري فلكياً)',
    idea: 'ذكرى الهجرة النبوية المباركة وبداية عام هجري جديد بالهداية والهمة',
    desc: 'استحضار دروس الهجرة في التخطيط والصحبة والتفاني في سبيل الهدف النبيل.',
    tieIn: 'استلهام مبدأ التجدد والتطوير المستمر لخدمة عملائنا بأحدث الإمكانيات.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'عام هجري جديد، وفرصة جديدة للبدايات الطيبة والنوايا الصادقة. 🌙✨ تهنئكم أسرة {COMPANY_NAME} بمناسبة رأس السنة الهجرية الجديدة، سائلين المولى عز وجل أن يجعله عام فرج وبركة ونجاح لكل خطوة تخطونها. كل عام وأنتم بخير وسعادة. 🕊️',
    prompt: 'Dignified Islamic new year motif, delicate golden crescent moon cradling the date, soft emerald and gold illumination, timeless architectural arabesque background',
  },
  {
    approxMonthDay: '26/06',
    name: 'يوم عاشوراء المبارك (10 محرم - تقديري فلكياً)',
    idea: 'يوم نجاة موسى عليه السلام وفضل الصيام وحلاوة العاشوراء المصرية بالمكسرات',
    desc: 'الاحتفاء بيوم عاشوراء وطقوس طبق العاشوراء الحلو بالمكسرات في البيوت المصرية.',
    tieIn: 'مشاركة البهجة الشعبية المصرية مع تقديم نصائح مفيدة.',
    obj: 'تفاعل ومشاركات (Engagement)',
    caption: 'عاشوراء مباركة عليكم جميعاً! 🌾🥣 يوم نجاة وفرج وتاريخ طويل من الخير. ومينفعش اليوم يعدي من غير طبق العاشوراء الحلو بالقرفة والمكسرات ولمّة البيت الدافية! تقبل الله صيامكم وطاعاتكم وأدام عليكم حلاوة الأيام. بتحبوها بالمكسرات ولا بالقرفة والسادة؟ شاركونا في الكومنتات! 😋✨',
    prompt: 'Traditional Egyptian Ashura dessert bowl with creamy texture, decorated with roasted almonds and cinnamon powder, warm rustic wooden background with ambient candle light',
  },
  {
    approxMonthDay: '26/08',
    name: 'المولد النبوي الشريف (12 ربيع الأول - تقديري فلكياً)',
    idea: 'الصلاة على الحبيب المصطفى ﷺ وفرحة حلاوة المولد وعروسة المولد وحصان المولد التراثي',
    desc: 'أحب المناسبات الروحية والشعبية لقلوب المصريين؛ الصلاة والسلام على خير الأنام وفرحة علب حلاوة المولد.',
    tieIn: 'التأكيد على الاقتداء بخلق النبي الكريم في الأمانة والإتقان وإتقان العمل والصدق.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    caption: 'وُلِدَ الهُدى فَالكائِناتُ ضِياءُ، وَفَمُ الزَمانِ تَبَسُّمٌ وَثَناءُ! 🌺✨ في ذكرى المولد النبوي الشريف، نرفع أسمى آيات التهاني لمصر والأمة الإسلامية بذكرى مولد خير خلق الله ﷺ. من لا يشبع من الصلاة عليه فليشاركنا الصلاة والسلام عليه في التعليقات. ولا تنسوا: مين أكل الملبن والسمسمية الأول النهاردة؟ كل عام وأنتم في نور وبركة وسرور! 🍬🏮',
    prompt: 'Regal and joyful Egyptian Mawlid celebrations, traditional heritage candied horse and sugar doll motifs in upscale artistic styling, soft glowing lanterns and celebratory golden script',
  },
];

// Content Pillars for regular days to ensure zero repetitive fluff
interface RegularDayPillar {
  ideaTitle: string;
  desc: string;
  tieIn: string;
  obj: MarketingObjective;
  captionTemplate: string;
  promptConcept: string;
}

const REGULAR_DAY_PILLARS: RegularDayPillar[] = [
  {
    ideaTitle: 'نصيحة ذهبية من واقع الخبرة الميدانية (Pro Tip)',
    desc: 'تقديم نصيحة عملية وسريعة تحمي العميل من الوقوع في خطأ شائع وتوفر عليه الوقت والمجهود والمال.',
    tieIn: 'تسليط الضوء على خبرة الشركة الطويلة في {INDUSTRY} ومساعدتها للعميل في اتخاذ القرار الأمثل.',
    obj: 'تعليم وتثقيف (Education)',
    captionTemplate: 'نصيحة ذهبية هتفرق معاك جداً قبل ما تختار {SERVICES}! 💡 قبل ما تاخد أي قرار، اتأكد من {USPS}. التسرع في الاختيار غالباً بيكلفك أضعاف بعدين. لو محتار أو عندك أي استفسار، تيم {COMPANY_NAME} جاهز يساعدك بالاستشارة المظبوطة. سيب سؤالك في كومنت! 👇',
    promptConcept: 'Clean educational modern visual, lightbulb innovation icon integrated into sleek corporate presentation desk, bright professional daytime lighting',
  },
  {
    ideaTitle: 'حل مشكلة مؤرقة تواجه العملاء (Pain Point & Solution)',
    desc: 'تشريح مشكلة شائعة يعاني منها معظم الراغبين في الخدمة وشرح كيف يقضي حل الشركة عليها جذرياً.',
    tieIn: 'إبراز كيف صممت {COMPANY_NAME} خدماتها خصيصاً للقضاء على هذه العقبة وضمان راحة العميل.',
    obj: 'تحويل ومبيعات (Conversions)',
    captionTemplate: 'أكبر مشكلة بتواجه أغلب الناس لما يفكروا في {SERVICES} هي عدم الالتزام والوعود غير الدقيقة. 🛑 علشان كده في {COMPANY_NAME} غيرنا المعادلة: كل خطوة واضحة بعقد رسمي، وتفاصيل محددة من أول يوم. مش محتاج تقلق بعد النهاردة. احجز استشارتك المجانية عبر رسائل الصفحة دلوقتي! 📩🤝',
    promptConcept: 'Problem-solving transformation concept, split before-and-after visual harmony, cluttered chaotic side turning into calm pristine organized modern environment',
  },
  {
    ideaTitle: 'تصحيح خرافة أو معلومة مغلوطة شائعة (Myth vs. Fact)',
    desc: 'مواجهة مفهوم خاطئ منتشر بين الجمهور بالحقائق العلمية والبيانات الموثقة لزيادة وعي المتابع.',
    tieIn: 'ترسيخ مكانة الشركة كمرجعية احترافية موثوقة تهتم بوعي العميل وتنويره بالحقائق.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    captionTemplate: 'شائع ومغلوط: "كل ما السعر يقل في {SERVICES} يبقى كده وفرت!" ❌ الحقيقة: الجودة الرديئة بتكلفك تصليح وإعادة عمل بأضعاف السعر. في {COMPANY_NAME} بنقدملك القيمة الحقيقية اللي بتعيش معاك وتضمنلك راحة بالك بضمان حقيقي. تواصل معنا واعرف الفرق بنفسك! 🔍✅',
    promptConcept: 'High-contrast Myth vs Reality conceptual visual, glowing magnifying glass revealing ultra-clear high quality detail, sleek minimalist graphic presentation',
  },
  {
    ideaTitle: 'سؤال تفاعلي واستطلاع رأي للنقاش (Interactive Poll)',
    desc: 'طرح سؤال شيق ومحفز للجمهور لاختبار آرائهم والمفاضلة بين خيارين شهيرين لزيادة التفاعل والخوارزميات.',
    tieIn: 'معرفة تفضيلات الجمهور المستهدف وجمع بيانات تساعد في تخصيص العروض القادمة.',
    obj: 'تفاعل ومشاركات (Engagement)',
    captionTemplate: 'لو خيروك بين {SERVICES} بالطريقة التقليدية ولا بالتكنولوجيا الرقمية الحديثة مع {COMPANY_NAME}؟ 🤔 شاركونا رأيكم في التعليقات: رقم 1 ولا رقم 2؟ وليه؟ أكتر كومنت مفصل هياخد مفاجأة خاصة مننا في الرسائل! 💬🚀',
    promptConcept: 'Modern interactive 3D decision podium with two glowing stylish options A vs B, vibrant ambient lighting, clean social media graphic layout',
  },
  {
    ideaTitle: 'كواليس العمل وسر الجودة (Behind The Scenes)',
    desc: 'إظهار الجهد الدقيق وفريق العمل والتقنيات المستخدمة خلف الكواليس لتجهيز الخدمة أو المنتج بأعلى دقة.',
    tieIn: 'بناء الشفافية وتقوية الصلة الإنسانية بين العميل وفريق العمل الذي يسهر على خدمته.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    captionTemplate: 'مش مجرد شغل بنسلمه، ده شغف بنعيشه في كل تفصيلة! 🔍🛠️ لقطة سريعة من كواليس تيم {COMPANY_NAME} وهو بيجهز أعلى معايير الجودة لعملائنا في {LOCATION}. كل منتج بيعدي على فحص دقيق قبل ما يوصلك علشان نضمن إنك تستاهل الأفضل دايماً. إيه أكتر حاجة بتهتم بيها أول ما تستلم خدمتك؟ 🤝✨',
    promptConcept: 'Authentic behind-the-scenes candid photography of dedicated professionals meticulously inspecting high precision work, natural ambient studio lighting',
  },
  {
    ideaTitle: 'قصة نجاح وتقييم عميل حقيقي (Case Study & Social Proof)',
    desc: 'عرض تجربة عميل سابق كيف تحولت حياته أو عمله للأفضل بعد التعامل مع الشركة دون تزييف.',
    tieIn: 'تأكيد المصداقية وإزالة أي تردد لدى العملاء المترددين من خلال البرهان الاجتماعي الحقيقي.',
    obj: 'تحويل ومبيعات (Conversions)',
    captionTemplate: '"كنت خايف ومتردد في الأول، بس بعد ما اتعاملت مع {COMPANY_NAME} اتفاجئت بالسرعة والاحترافية والاهتمام بأدق التفاصيل." 🌟❤️ دي كلمات أعتز بيها من أحد عملائنا الكرام. رضاكم هو الدافع الحقيقي لينا للاستمرار في تقديم {USPS}. انضم لعائلتنا النهارده وخلينا نكون سبب في نجاحك وراحتك! 📞📩',
    promptConcept: 'Delighted customer handshake in a bright contemporary Egyptian executive lounge, genuine satisfaction, soft cinematic depth of field, corporate prestige',
  },
  {
    ideaTitle: 'إبراز ميزة تنافسية فريدة (USP Spotlight)',
    desc: 'التركيز على ميزة واحدة محددة تمتلكها الشركة ولا تتوفر لدى المنافسين في السوق المصري.',
    tieIn: 'توضيح العائد المباشر والربح الذي يعود على العميل عند اختياره هذه الميزة بالذات.',
    obj: 'توعية بالعلامة (Awareness)',
    captionTemplate: 'ليه عملاء {LOCATION} بيختاروا {COMPANY_NAME} بالاسم؟ 🏆 لأننا مش بنقدم مجرد {SERVICES}، إحنا بنضمنلك {USPS}! ميزتنا دي هي اللي بتخليك مطمن 100% إنك استثمرت في المكان الصح. جاهز لتجربة مختلفة؟ كلمنا دلوقتي على {CONTACT_DATA}! 📲✨',
    promptConcept: 'Golden spotlight illuminating a gleaming award-winning symbol of unique capability and technical excellence, premium sleek presentation',
  },
  {
    ideaTitle: 'دليل إرشادي خطوة بخطوة (Step-by-Step Guide)',
    desc: 'شرح مبسط ومنظم لرحلة العميل وكيفية إتمام الأمر من أول تواصل وحتى استلام النتيجة النهائية بسهولة.',
    tieIn: 'تسهيل عملية الشراء وتقليل الاحتكاك وتوضيح أن الخطوات بسيطة وسريعة ولا تتطلب أي عناء.',
    obj: 'تعليم وتثقيف (Education)',
    captionTemplate: '3 خطوات سهلة وبسيطة من غير أي وجع دماغ علشان تبدأ مع {COMPANY_NAME}: 1️⃣ تواصل معنا عبر الرسائل أو الواتساب. 2️⃣ احصل على استشارة تفصيلية ومقايسة واضحة لاحتياجاتك. 3️⃣ استلم {SERVICES} بأعلى معايير الجودة والضمان. الطريق أسهل مما تتخيل! ابعتلنا دلوقتي على الواتساب وابدأ فوراً. 💬🚀',
    promptConcept: 'Clean modern 3-step progression roadmap infographic style, glowing connected nodes on a futuristic minimalist glass board, clear visual hierarchy',
  },
  {
    ideaTitle: 'مقارنة ذكية لمساعدة العميل على الاختيار (Buyer’s Guide)',
    desc: 'مقارنة حيادية وشاملة تساعد القارئ على معرفة الخيار الأنسب لميزانيته واحتياجاته الفعلية.',
    tieIn: 'إظهار حرص الشركة على مصلحة العميل أولاً حتى قبل التفكير في البيع المباشر.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    captionTemplate: 'إزاي تختار الأنسب لميزانيتك واحتياجاتك بدون تضييع وقت؟ ⚖️💡 المقارنة دي هتوضحلك الفرق بالتفصيل في {SERVICES}. الأهم مش إنك تدفع أكتر، الأهم إنك تاخد اللي يناسبك فعلاً. تيم {COMPANY_NAME} جاهز يرشدك للخيار الأوفر والأكتر كفاءة. اطلب استشارتك المجانية عبر رسائل الصفحة دلوقتي! 🤝',
    promptConcept: 'Side-by-side elegant comparison scale visual, balancing quality and value with crystal weights on an ultra-modern marble table, clean aesthetic',
  },
  {
    ideaTitle: 'الرد على أكثر تردد أو اعتراض يواجه العملاء (Overcoming Objections)',
    desc: 'طرح السؤال الحساس الذي يدور في ذهن العميل (مثل الأسعار، الضمان، مواعيد التسليم) والإجابة عليه بشفافية.',
    tieIn: 'منح العميل الطمأنينة الكاملة والضمانات التي تزيل كل مخاوفه وتدفعه لاتخاذ الخطوة.',
    obj: 'تحويل ومبيعات (Conversions)',
    captionTemplate: 'كتير بيسألونا: "إيه اللي يضمنلي إن الخدمة هتطلع زي ما اتفقنا بالضبط؟" 🤔 إجابتنا في {COMPANY_NAME} واضحة وبسيطة: بنقدملك {USPS} مع متابعة دورية وضمان مكتوب. حقك مضمون من أول دقيقة لأننا بنبني شراكة طويلة مش مجرد معاملة واحدة. راسلنا دلوقتي واستفسر عن كل التفاصيل براحتك! 🛡️📑',
    promptConcept: 'Symbolic golden guarantee shield and signed certification resting on modern executive desk, transparent crystal elements, inspiring security and confidence',
  },
  {
    ideaTitle: 'قيم الشركة وثقافة العمل والمسؤولية (Company Culture & Ethics)',
    desc: 'التعبير عن المبادئ الأخلاقية التي تحكم العمل: الأمانة، الدقة، الاحترام، والالتزام بوعودنا.',
    tieIn: 'خلق ارتباط عاطفي وقيمي مع المتابعين وتعزيز الولاء للعلامة التجارية في مصر.',
    obj: 'بناء ثقة ومصداقية (Trust)',
    captionTemplate: 'في عالم البيزنس، ممكن حاجات كتير تتغير... لكن المبادئ والأمانة والالتزام بالكلمة بتفضل هي الأساس الثابت! 🏛️ في {COMPANY_NAME}، بنعتبر كل وعد بنقوله لعميلنا هو ميثاق شرف مش بنتنازل عنه. بنشكركم على ثقتكم اللي بتنور طريقنا كل يوم. دمتم شركاء نجاحنا الأعزاء. ❤️🤝',
    promptConcept: 'Warm uplifting handshake of integrity and trust between business partners against panoramic glass window showing sunrise over Cairo, warm corporate glow',
  },
  {
    ideaTitle: 'دعوة مباشرة للحجز أو التواصل وعرض استشارة (Lead Magnet / CTA)',
    desc: 'منشور مباشر يركز على تقديم قيمة مجانية أو عرض مميز للراغبين في الاستفسار أو الحجز هذا الأسبوع.',
    tieIn: 'توجيه المتابعين لاتخاذ إجراء محدد والتواصل عبر الهاتف أو الواتساب أو الرسائل.',
    obj: 'تحويل ومبيعات (Conversions)',
    captionTemplate: 'جاهز تاخد خطوة حقيقية وتوفر على نفسك التعب والتكاليف الإضافية؟ 🎯 الأسبوع ده في {COMPANY_NAME}، بنقدم استشارة تفصيلية ومجانية بالكامل للرد على كل استفساراتكم في {SERVICES}. عدد الاستشارات محدود للحفاظ على وقت وجودة المتابعة. سيب كلمة "استشارة" في كومنت أو ابعتلنا واتساب على {CONTACT_DATA} وهننسق معاك فوراً! 📲⚡',
    promptConcept: 'Direct interactive communication concept, sleek smartphone displaying elegant messaging interface with glowing notification, warm desk setup with coffee and notebook',
  },
];

// Friday template rotation
const FRIDAY_MESSAGES = [
  {
    idea: 'جمعة مباركة | فضل الصلاة على النبي ﷺ والسكينة وراحة البال',
    desc: 'رسالة روحية دافئة بمناسبة يوم الجمعة، الحث على قراءة سورة الكهف والصلاة على النبي والدعاء.',
    caption: 'اللهم صلِّ وسلم وبارك على سيدنا محمد وعلى آله وصحبه أجمعين. 🕊️ جمعة مباركة وطيبة عليكم جميعاً من أسرة {COMPANY_NAME}. نسأل الله أن يملأ قلوبكم بالسكينة وبيوتكم بالبركة وأن يتقبل دعواتكم في ساعة الإجابة. لا تنسوا قراءة سورة الكهف ونور ما بين الجمعتين. طابت جمعتكم بكل خير! 🕌✨',
    prompt: 'Majestic historic Cairo mosque courtyard in soft Friday morning light, gentle warm sun rays illuminating traditional stone arches and marble fountain, serene spiritual atmosphere',
  },
  {
    idea: 'جمعة مباركة | دفء اللمة العائلية في مصر وبر الأهل والامتنان',
    desc: 'الاحتفاء بيوم الجمعة كيوم مخصص للعائلة والتواصل المجتمعي والتقارب بين الأهل والأصدقاء.',
    caption: 'أحلى ما في يوم الجمعة في مصر... ريحة البخور، ولمّة العيلة على الفطار، والدعوة الطيبة من الوالدين! ☕❤️ جمعة مباركة وطيبة عليكم وعلى كل أحبابكم. نتمنى لكم يوم عطلة هادئ وجميل تستعيدوا فيه طاقتكم وراحة بالكم. جمعتكم سعيدة من تيم {COMPANY_NAME}! 🌿',
    prompt: 'Warm traditional Friday morning breakfast table in Egypt, steaming mint tea glasses, natural daylight through balcony window overlooking peaceful garden, warm cozy serenity',
  },
  {
    idea: 'جمعة مباركة | طاقة أمل وتفاؤل وبدايات أسبوع متجددة',
    desc: 'بث روح التفاؤل والامتنان لما تحقق في الأسبوع والتطلع لأسبوع جديد مليء بالبركة والفرص.',
    caption: 'الحمد لله على أسبوع انقضى بفضله، ونسأله التوفيق والبركة في كل ما هو قادم. 🤲✨ جمعة مباركة عليكم وعلى كل أهلكم الكرام. خدوا وقت كافي للراحة وشحن الطاقة لأن القادم دايماً أجمل بإذن الله. طابت جمعتكم بكل خير وسلام وسعادة من {COMPANY_NAME}! 🌸',
    prompt: 'Serene sunrise over peaceful river Nile, gentle morning breeze touching green palm trees, warm golden morning light reflecting on calm water, inspiring peaceful Friday',
  },
  {
    idea: 'جمعة مباركة | جبر الخواطر والإحسان والكلمة الطيبة',
    desc: 'التذكير بقيمة الكلمة الطيبة وأثر جبر الخواطر على سلامة الصدور ونشر المحبة في المجتمع.',
    caption: 'الكلمة الطيبة صدقة، وجبر الخواطر عبادة تفتح أبواب الرزق والسكينة. 💫 في يوم الجمعة المبارك، نسأل الله أن يجبر قلوبكم وييسر أموركم ويسعد أيامكم. جمعة طيبة ومباركة عليكم جميعاً من أسرة {COMPANY_NAME}. لا تنسونا من صالح دعائكم. 🕊️🤲',
    prompt: 'Intricate illuminated geometric Islamic wooden lattice mashrabiya window with warm sunlight pouring through, peaceful and timeless Egyptian heritage elegance',
  },
];

/**
 * Generate 365 Days Base Blueprint
 */
export function generate365DayTemplates(): DayTemplate[] {
  const templates: DayTemplate[] = [];
  let dayCounter = 1;

  for (let m = 0; m < 12; m++) {
    const month = m + 1;
    const daysInThisMonth = DAYS_IN_MONTH[m];

    for (let d = 1; d <= daysInThisMonth; d++) {
      const dayInMonth = d;
      const dateStr = `${String(d).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
      // Weekday calculation: let Day 1 be Thursday (index 0) or standard day
      // Weekday index in WEEKDAYS_AR: (dayCounter - 1) % 7
      // index 0 = الخميس, 1 = الجمعة, 2 = السبت, 3 = الأحد, 4 = الإثنين, 5 = الثلاثاء, 6 = الأربعاء
      const weekday = WEEKDAYS_AR[(dayCounter - 1) % 7];
      const isFriday = weekday === 'الجمعة';

      let occasion = '';
      let category: OccasionCategory = 'brand_regular';
      let isEstimatedDate = false;
      let contentIdea = '';
      let contentDescription = '';
      let tieInMethod = '';
      let marketingObjective: MarketingObjective = 'توعية بالعلامة (Awareness)';
      let baseCaptionTemplate = '';
      let basePromptTemplate = '';

      // 1. Check if it matches fixed Egyptian special days
      if (SPECIAL_DAYS_EGYPT[dateStr]) {
        const seed = SPECIAL_DAYS_EGYPT[dateStr];
        occasion = seed.occasion;
        category = seed.category;
        isEstimatedDate = Boolean(seed.isEstimated);
        contentIdea = seed.contentIdea;
        contentDescription = seed.contentDescription;
        tieInMethod = seed.tieInMethod;
        marketingObjective = seed.objective;
        baseCaptionTemplate = seed.captionDraft;
        basePromptTemplate = seed.promptConcept;
      }
      // 2. Check if it matches estimated Islamic moments
      else {
        const islamicMatch = ISLAMIC_ESTIMATED_MOMENTS.find(
          (item) => item.approxMonthDay === dateStr
        );
        if (islamicMatch) {
          occasion = islamicMatch.name;
          category = 'islamic';
          isEstimatedDate = true;
          contentIdea = islamicMatch.idea;
          contentDescription = islamicMatch.desc;
          tieInMethod = islamicMatch.tieIn;
          marketingObjective = islamicMatch.obj;
          baseCaptionTemplate = islamicMatch.caption;
          basePromptTemplate = islamicMatch.prompt;
        }
        // 3. Check if it is a Friday
        else if (isFriday) {
          const fridayVariant =
            FRIDAY_MESSAGES[Math.floor((dayCounter / 7) % FRIDAY_MESSAGES.length)];
          occasion = 'جمعة مباركة | رسائل إيجابية وسكينة وتواصل مجتمعي';
          category = 'friday';
          contentIdea = fridayVariant.idea;
          contentDescription = fridayVariant.desc;
          tieInMethod =
            'مشاركة المشاعر الروحية والمجتمعية النبيلة مع الجمهور بما يعزز مكانة البراند القريبة من وجدان العميل المصري.';
          marketingObjective = 'بناء ثقة ومصداقية (Trust)';
          baseCaptionTemplate = fridayVariant.caption;
          basePromptTemplate = fridayVariant.prompt;
        }
        // 4. Otherwise regular brand content pillar (cycled smoothly)
        else {
          const pillar =
            REGULAR_DAY_PILLARS[dayCounter % REGULAR_DAY_PILLARS.length];
          occasion = `محتوى تسويقي وتوعوي للنشاط | زاوية: ${pillar.ideaTitle}`;
          category = 'brand_regular';
          contentIdea = pillar.ideaTitle;
          contentDescription = pillar.desc;
          tieInMethod = pillar.tieIn;
          marketingObjective = pillar.obj;
          baseCaptionTemplate = pillar.captionTemplate;
          basePromptTemplate = pillar.promptConcept;
        }
      }

      templates.push({
        dayNumber: dayCounter,
        month,
        dayInMonth,
        dateStr,
        weekday,
        occasion,
        occasionCategory: category,
        isEstimatedDate,
        contentIdea,
        contentDescription,
        tieInMethod,
        marketingObjective,
        baseCaptionTemplate,
        basePromptTemplate,
      });

      dayCounter++;
    }
  }

  return templates;
}

// Global cached blueprint of 365 templates
export const BASE_365_TEMPLATES: DayTemplate[] = generate365DayTemplates();

/**
 * Generate Company Description from Client Profile
 */
export function buildCompanyDescription(client: ClientProfile): string {
  return `${client.companyName}، شركة رائدة في ${client.industry}. تقدم ${client.services}. وتتميز بـ ${client.usps}. الجمهور المستهدف: ${client.targetAudience} في ${client.location}.`;
}

/**
 * Generate Visual Identity Summary from Client Profile
 */
export function buildVisualIdentitySummary(client: ClientProfile): string {
  return `النمط البصري: ${client.visualIdentity}. الألوان: أساسي (${client.primaryColor})، ثانوي (${client.secondaryColor})، تمييز (${client.accentColor})، خلفية (${client.backgroundColor}). الخطوط: ${client.typography}. موضع الشعار: ${client.logoInstructions}.`;
}

/**
 * Replace tokens in text template
 */
export function replaceTokens(text: string, client: ClientProfile): string {
  return text
    .replace(/{COMPANY_NAME}/g, client.companyName || 'الشركة')
    .replace(/{INDUSTRY}/g, client.industry || 'المجال')
    .replace(/{SERVICES}/g, client.services || 'خدماتنا')
    .replace(/{PRODUCTS}/g, client.products || 'منتجاتنا')
    .replace(/{TARGET_AUDIENCE}/g, client.targetAudience || 'عملائنا الكرام')
    .replace(/{LOCATION}/g, client.location || 'مصر')
    .replace(/{USPS}/g, client.usps || 'أعلى معايير الجودة والضمان')
    .replace(/{CONTACT_DATA}/g, client.contactData || 'عبر الرسائل الخاصة');
}

/**
 * Build the AI image generation prompt for a specific day
 */
export function buildAiImagePrompt(
  template: DayTemplate,
  client: ClientProfile
): string {
  const brandName = client.companyName || 'Egyptian Brand';
  const industry = client.industry || 'Business Services';
  const visualStyle = client.visualIdentity || 'Modern minimal luxury aesthetic';
  const primary = client.primaryColor || '#0A4D68';
  const secondary = client.secondaryColor || '#088395';
  const accent = client.accentColor || '#D4AF37';

  return `High-end commercial social media post photography for Egyptian company "${brandName}" in the field of ${industry}.
Theme & Occasion: ${template.occasion} (Day ${template.dayNumber}, Date: ${template.dateStr}).
Concept Scene: ${template.basePromptTemplate}.
Art Direction & Style: ${visualStyle}, contemporary Egyptian premium market lifestyle context, photorealistic textures, immaculate visual hierarchy.
Brand Color Grading: Dominant tones rooted in primary ${primary}, subtle secondary ${secondary}, luxury accent ${accent}, perfectly color-balanced.
Lighting & Optics: Soft cinematic studio ambient lighting, delicate rim light, natural reflections, ultra-sharp focus on main subject, shot on 85mm f/1.4 lens.
Composition & Logo Safe Area: Rule-of-thirds composition, designated clean clutter-free corner space reserved for ${client.logoInstructions || 'brand logo overlay'}, clean negative space.
Negative Constraints: No distorted features, no extra limbs, no blurry low-res artifacts, strictly NO fake gibberish text or letters, no cartoonish oversaturation.
Aspect Ratio: 1:1 square feed format, 8k resolution advertising masterpiece.`;
}

/**
 * Build the complete 365 rows bound dynamically to client profile
 */
export function buildFull365CalendarRows(
  client: ClientProfile,
  overrides?: Record<number, Partial<CalendarDayRow>>,
  startYear: number = 2026
): CalendarDayRow[] {
  const compDesc = buildCompanyDescription(client);
  const visualDesc = buildVisualIdentitySummary(client);

  return BASE_365_TEMPLATES.map((tpl) => {
    const rawDate = tpl.dateStr;
    const [dStr, mStr] = rawDate.split('/');
    const monthIndex = parseInt(mStr, 10) - 1;
    const dayNumber = tpl.dayNumber;
    const formattedDate = `${startYear}-${mStr}-${dStr}`;
    const displayMonthName = MONTH_NAMES_AR[monthIndex] || '';

    // Replace tokens in caption and tieIn
    const customizedCaption = replaceTokens(tpl.baseCaptionTemplate, client);
    const customizedTieIn = replaceTokens(tpl.tieInMethod, client);
    const finalPrompt = buildAiImagePrompt(tpl, client);

    const override = overrides ? overrides[dayNumber] : undefined;

    return {
      dayNumber,
      date: formattedDate,
      rawDate: `${dStr} ${displayMonthName}`,
      month: tpl.month,
      monthName: displayMonthName,
      weekday: tpl.weekday,
      occasion: tpl.occasion + (tpl.isEstimatedDate ? ' (تاريخ تقديري فلكياً)' : ''),
      occasionCategory: tpl.occasionCategory,
      categoryLabel: CATEGORY_LABELS[tpl.occasionCategory],
      isEstimatedDate: tpl.isEstimatedDate,
      contentIdea: tpl.contentIdea,
      contentDescription: tpl.contentDescription,
      companyDescription: compDesc,
      visualIdentity: visualDesc,
      finalAiPrompt: override?.customPrompt || finalPrompt,
      suggestedCaption: override?.customCaption || customizedCaption,
      marketingObjective: tpl.marketingObjective,
      publishingStatus: (override?.publishingStatus || 'مجدول (Scheduled)') as PublishingStatus,
      tieInMethod: customizedTieIn,
      customCaption: override?.customCaption,
      customPrompt: override?.customPrompt,
      notes: override?.notes || '',
    };
  });
}
