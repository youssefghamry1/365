export type OccasionCategory =
  | 'islamic'
  | 'christian'
  | 'national'
  | 'social'
  | 'commercial'
  | 'international'
  | 'friday'
  | 'brand_regular';

export interface CustomProfileField {
  id: string;
  section: string;
  label: string;
  value: string;
}

export interface ClientProfile {
  // 1. Business Info
  companyName: string;
  companyOverview?: string;
  industry: string;
  subActivities?: string;
  services: string;
  products: string;
  keyFeatures?: string;
  targetMarkets?: string;
  location: string;
  contactData: string;

  // 2. Target Audience Analysis
  targetAudience: string;
  audienceAge?: string;
  audienceLocation?: string;
  audienceInterests?: string;
  audienceNeeds?: string;
  audienceProblems?: string;
  audienceBehavior?: string;
  decisionTriggers?: string;
  potentialObjections?: string;

  // 3. Competitive Advantage & USPs
  usps: string;
  strengths?: string;
  valueProposition?: string;
  reasonsToChoose?: string;
  competitorDifferentiators?: string;
  coreMarketingMessages?: string;

  // 4. Marketing Strategy
  marketingGoal: string;
  contentObjectives?: string;
  communicationStyle?: string;
  toneOfVoice: string;
  targetPlatforms?: string;
  preferredContentTypes?: string;
  callToActions?: string;
  keywordsAndHashtags?: string;
  forbiddenWords: string;
  specialInstructions: string;

  // 5. Visual Identity
  logoUrl?: string;
  logoInstructions: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  typography: string;
  visualIdentity: string;
  photoStyle?: string;
  iconStyle?: string;
  visualRules?: string;
  referenceExamples?: string;

  // Custom User-Defined Fields & Sections
  customFields?: CustomProfileField[];
}

export interface ProfileVersionRecord {
  id: string;
  versionNumber: number;
  timestamp: string;
  projectId: string;
  clientProfile: ClientProfile;
  changedSections: string[];
  summaryNote: string;
}

export type MarketingObjective =
  | 'توعية بالعلامة (Awareness)'
  | 'تفاعل ومشاركات (Engagement)'
  | 'تحويل ومبيعات (Conversions)'
  | 'بناء ثقة ومصداقية (Trust)'
  | 'تعليم وتثقيف (Education)'
  | 'احتفاظ وولاء (Retention)';

export type PublishingStatus =
  | 'مجدول (Scheduled)'
  | 'قيد الإعداد (Draft)'
  | 'جاهز للنشر (Ready)'
  | 'تم النشر (Published)';

export interface DayTemplate {
  dayNumber: number;
  month: number;
  dayInMonth: number;
  dateStr: string; // "DD/MM"
  weekday: string;
  occasion: string;
  occasionCategory: OccasionCategory;
  isEstimatedDate?: boolean;
  contentIdea: string;
  contentDescription: string;
  tieInMethod: string;
  marketingObjective: MarketingObjective;
  baseCaptionTemplate: string;
  basePromptTemplate: string;
}

export interface CalendarDayRow {
  dayNumber: number;
  date: string; // e.g. "2026-01-01" or "01 يناير"
  rawDate: string; // "01/01"
  month: number;
  monthName: string;
  weekday: string;
  occasion: string;
  occasionCategory: OccasionCategory;
  categoryLabel: string;
  isEstimatedDate?: boolean;
  contentIdea: string;
  contentDescription: string;
  companyDescription: string;
  visualIdentity: string;
  finalAiPrompt: string;
  suggestedCaption: string;
  marketingObjective: MarketingObjective;
  publishingStatus: PublishingStatus;
  tieInMethod: string;
  customCaption?: string;
  customPrompt?: string;
  notes?: string;
}

export interface MasterPromptItem {
  id: string;
  number: number;
  title: string;
  category: string;
  objective: string;
  targetTools: string[];
  promptTemplate: string;
  inputVariables: { key: string; label: string; placeholder: string }[];
  usageInstructions: string;
  exampleResponseSummary: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  clientProfile: ClientProfile;
  createdAt: string;
  updatedAt: string;
  year: number;
  totalDays: number;
  generatedDaysCount: number;
  completedMonths: number[]; // e.g. [1, 2, 3]
  status: 'draft' | 'in_progress' | 'completed';
}

export interface BatchProgressRecord {
  projectId: string;
  currentMonth: number; // 1 to 12
  completedMonths: number[]; // e.g. [1, 2...]
  lastCompletedDay: number; // 0 to 365
  isGenerating: boolean;
  isPaused: boolean;
  lastUpdated: string;
  errorNote?: string;
}

export interface BackupDataPayload {
  version: string;
  appName: string;
  exportDate: string;
  activeProjectId?: string;
  projects: ProjectRecord[];
  clients: (ClientProfile & { id?: string })[];
  calendars: Record<string, CalendarDayRow[]>;
  batchProgress?: Record<string, BatchProgressRecord>;
}

