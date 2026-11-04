import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  Monitor,
  Palette,
  Sliders,
  Save,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { ClientProfile } from '../../types';
import { GeneratedDesignPromptItem, DesignTextContent } from '../../types/graphicDesign';
import {
  buildFinalEnglishPrompt,
  buildArabicExplanation,
  performQualityAudit,
} from '../../services/graphicDesignEngine';

interface DesignDetailModalProps {
  item: GeneratedDesignPromptItem | null;
  client: ClientProfile;
  onClose: () => void;
  onSave: (updatedItem: GeneratedDesignPromptItem) => void;
}

export const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  item,
  client,
  onClose,
  onSave,
}) => {
  if (!item) return null;

  const [textContent, setTextContent] = useState<DesignTextContent>({ ...item.textContent });
  const [prompt, setPrompt] = useState<string>(item.finalEnglishPrompt);
  const [dimensions, setDimensions] = useState<string>(item.customizedDimensions);
  const [status, setStatus] = useState<GeneratedDesignPromptItem['status']>(item.status);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTextContentChange = (field: keyof DesignTextContent, value: string) => {
    const updated = { ...textContent, [field]: value };
    setTextContent(updated);
    // Recalculate prompt automatically
    const recomputedPrompt = buildFinalEnglishPrompt(
      item.template,
      client,
      updated,
      item.visualStyle
    );
    setPrompt(recomputedPrompt);
  };

  const handleSave = () => {
    const recomputedExplanation = buildArabicExplanation(item.template, client, textContent);
    const recomputedAudit = performQualityAudit(item.template, client, textContent);

    onSave({
      ...item,
      textContent,
      customizedDimensions: dimensions,
      finalEnglishPrompt: prompt,
      arabicExplanation: recomputedExplanation,
      qualityAudit: recomputedAudit,
      status,
    });
    onClose();
  };

  const handleAiRegenerate = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postData: {
            occasion: item.template.nameAr,
            occasionCategory: item.template.category,
            contentIdea: textContent.headline,
            contentDescription: `${textContent.subheadline} - ${textContent.featuredOfferOrServices}`,
          },
          clientProfile: client,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data && data.prompt) {
        setPrompt(data.prompt);
      }
    } catch (e) {
      console.warn('AI regen failed, keeping optimized prompt:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" dir="rtl">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-base">
              #{item.template.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {item.template.nameAr}
                </h2>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  ({item.template.nameEn})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{item.template.goalAr}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right text-xs">
          {/* Top Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">نوع الاستخدام:</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {item.template.usageType === 'print' ? (
                  <>
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>مطبوعات (Print)</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                    <span>رقمي (Digital)</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">المقاس القياسي:</span>
              <span className="font-bold text-white font-mono">{dimensions}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">نسبة العرض للارتفاع:</span>
              <span className="font-bold text-white font-mono">{item.template.aspectRatio}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px] mb-1">نظام الألوان:</span>
              <span className="font-bold text-emerald-400">{item.template.colorMode.split(' ')[0]}</span>
            </div>
          </div>

          {/* Color Palette Inspection */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">الألوان المعتمدة للتصميم:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: client.primaryColor }}></span>
                <span className="font-mono text-[10px] text-slate-300">{client.primaryColor}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: client.secondaryColor }}></span>
                <span className="font-mono text-[10px] text-slate-300">{client.secondaryColor}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: client.accentColor }}></span>
                <span className="font-mono text-[10px] text-slate-300">{client.accentColor}</span>
              </div>
            </div>
          </div>

          {/* Editable Text Content Section */}
          <div className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  المحتوى النصي المقترح داخل التصميم (قابل للتعديل)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                مستخرج من خدمات وبيانات {client.companyName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">العنوان الرئيسي (Headline):</label>
                <input
                  type="text"
                  value={textContent.headline}
                  onChange={(e) => handleTextContentChange('headline', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">العنوان الفرعي (Subheadline):</label>
                <input
                  type="text"
                  value={textContent.subheadline}
                  onChange={(e) => handleTextContentChange('subheadline', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">الخدمات أو الميزات البارزة:</label>
                <input
                  type="text"
                  value={textContent.featuredOfferOrServices}
                  onChange={(e) => handleTextContentChange('featuredOfferOrServices', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">زر أو دعوة الإجراء (CTA):</label>
                <input
                  type="text"
                  value={textContent.callToAction}
                  onChange={(e) => handleTextContentChange('callToAction', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">بيانات التواصل المعتمدة:</label>
                <input
                  type="text"
                  value={textContent.contactData}
                  onChange={(e) => handleTextContentChange('contactData', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Final English AI Prompt */}
          <div className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">
                  البرومبت النهائي بالإنجليزية (Ready for Midjourney / Gemini / Imagen 3)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiRegenerate}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                  title="إعادة التوليد والتحسين بالذكاء الاصطناعي"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'جاري التحسين...' : 'تحسين AI'}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(prompt, 'prompt')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow-sm"
                >
                  {copiedKey === 'prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ البرومبت بالكامل</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 font-mono text-[11px] text-amber-200/90 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 text-left"
            />
          </div>

          {/* Designer Instructions & Negative Prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🛠️ تعليمات المصمم الجرافيكي (Handover Tips):</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">{item.designerInstructions}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                <span>🚫 البرومبت السلبي (Negative Prompt):</span>
              </h4>
              <p className="text-slate-400 font-mono text-[11px] leading-relaxed" dir="ltr">
                {item.negativePrompt}
              </p>
            </div>
          </div>

          {/* Quality Audit Checklist */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white">فحص جودة البرومبت (Quality Audit):</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                درجة المطابقة: {item.qualityAudit.scoreOutOf10} / 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {item.qualityAudit.checks.map((chk, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">{chk.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/90 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            إغلاق
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات في المكتبة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
