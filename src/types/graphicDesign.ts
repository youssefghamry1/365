import { ClientProfile } from './index';

export type DesignCategoryKey =
  | 'brand_identity'
  | 'stationery'
  | 'marketing_collateral'
  | 'social_media'
  | 'packaging'
  | 'digital_assets';

export interface DesignCategoryInfo {
  key: DesignCategoryKey;
  number: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  iconName: string;
  colorScheme: string;
  badgeCount: number;
}

export type DesignUsageType = 'print' | 'digital' | 'hybrid';

export interface GraphicDesignTemplate {
  id: string;
  number: number;
  category: DesignCategoryKey;
  nameAr: string;
  nameEn: string;
  usageType: DesignUsageType;
  defaultDimensions: string;
  aspectRatio: string;
  bleed?: string;
  colorMode: 'CMYK (300 DPI)' | 'RGB (72-144 DPI)' | 'Vector Pantone / CMYK / RGB' | string;
  goalAr: string;
  defaultVisualAesthetic: string;
  designerHandoverTipsAr: string;
}

export interface DesignTextContent {
  headline: string;
  subheadline: string;
  bodyDescription: string;
  featuredOfferOrServices: string;
  callToAction: string;
  contactData: string;
}

export interface QualityAuditResult {
  isPassed: boolean;
  scoreOutOf10: number;
  checks: {
    label: string;
    passed: boolean;
    note: string;
  }[];
}

export interface GeneratedDesignPromptItem {
  template: GraphicDesignTemplate;
  client: ClientProfile;
  customizedDimensions: string;
  textContent: DesignTextContent;
  visualStyle: string;
  finalEnglishPrompt: string;
  arabicExplanation: string;
  negativePrompt: string;
  designerInstructions: string;
  qualityAudit: QualityAuditResult;
  status: 'مسودة' | 'معتمد للتنفيذ' | 'تم التوليد' | 'قيد التصميم';
  isSelected?: boolean;
}
