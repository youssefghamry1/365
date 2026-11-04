import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Share2,
  Calendar,
  Save,
  Wand2,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { CalendarDayRow, ClientProfile, PublishingStatus } from '../types';

interface DayDetailModalProps {
  day: CalendarDayRow | null;
  client: ClientProfile;
  onClose: () => void;
  onSaveDay: (updatedDay: CalendarDayRow) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  client,
  onClose,
  onSaveDay,
}) => {
  if (!day) return null;

  const [caption, setCaption] = useState(day.suggestedCaption);
  const [prompt, setPrompt] = useState(day.finalAiPrompt);
  const [status, setStatus] = useState<PublishingStatus>(day.publishingStatus);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>('عامية تسويقية مصرية راقية وموثوقة');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSave = () => {
    onSaveDay({
      ...day,
      suggestedCaption: caption,
      finalAiPrompt: prompt,
      publishingStatus: status,
      customCaption: caption,
      customPrompt: prompt,
    });
    onClose();
  };

  // Live call to Gemini via server endpoint for caption rewrite
  const handleAiRewriteCaption = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: day.dayNumber,
          date: day.date,
          occasion: day.occasion,
          idea: day.contentIdea,
          clientProfile: client,
          toneStyle: selectedTone,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data && data.caption) {
        setCaption(data.caption);
        return;
      }

      // High quality fallback caption
      const fallback = `✨ ${day.contentIdea}

مع ${client.companyName}، بنقدملك تجربة استثنائية في ${client.industry}!
بمناسبة (${day.occasion})، بنفكركم إن التميز الحقيقي هو اختيارك للمكان اللي بيضمنلك:
✅ ${client.usps}
✅ خدمات احترافية في ${client.services}

جاهز تبدأ معانا؟ تواصل معنا دلوقتي عبر: ${client.contactData} 📲💬
#مصر #${client.companyName.replace(/[\s\W]+/g, '_')} #خدمات_مصر`;
      setCaption(fallback);
    } catch (err: any) {
      console.warn('Caption generation issue, applying local fallback:', err);
      const fallback = `✨ ${day.contentIdea}

مع ${client.companyName}، بنقدملك تجربة استثنائية في ${client.industry}!
بمناسبة (${day.occasion})، بنفكركم إن التميز الحقيقي هو اختيارك للمكان اللي بيضمنلك:
✅ ${client.usps}
✅ خدمات احترافية في ${client.services}

جاهز تبدأ معانا؟ تواصل معنا دلوقتي عبر: ${client.contactData} 📲💬
#مصر #${client.companyName.replace(/[\s\W]+/g, '_')} #خدمات_مصر`;
      setCaption(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Live call to Gemini for prompt refinement
  const handleAiRefinePrompt = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postData: day,
          clientProfile: client,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data && data.prompt) {
        setPrompt(data.prompt);
        return;
      }

      // High-end fallback refined prompt
      const refined = `Commercial advertising photography for Egyptian brand "${client.companyName}" specializing in ${client.industry}.
Theme & Narrative: ${day.occasion} - ${day.contentIdea}.
Scene Composition: ${day.contentDescription}, elegant contemporary Egyptian luxury lifestyle context, confident natural ambiance.
Art Direction & Style: ${client.visualIdentity}, masterclass cinematic studio illumination, soft directional golden sunlight, clean optical reflections.
Chromatic Harmony: Rooted in brand primary ${client.primaryColor}, secondary ${client.secondaryColor}, and accent ${client.accentColor}.
Optics: Shot on 85mm f/1.4 prime lens at f/2.0, shallow depth of field, creamy smooth bokeh, tack-sharp focal details.
Composition: Clean rule-of-thirds, clutter-free corner reserved for ${client.logoInstructions}.
Negative Constraints: NO blurry low-res artifacts, no distorted anatomy, strictly NO fake gibberish text or letters.
Aspect Ratio: 1:1 square feed composition, 8k resolution advertising masterpiece.`;

      setPrompt(refined);
    } catch (err: any) {
      console.warn('Prompt refine issue, applying local fallback:', err);
      const refined = `Commercial advertising photography for Egyptian brand "${client.companyName}" specializing in ${client.industry}.
Theme & Narrative: ${day.occasion} - ${day.contentIdea}.
Scene Composition: ${day.contentDescription}, elegant contemporary Egyptian luxury lifestyle context, confident natural ambiance.
Art Direction & Style: ${client.visualIdentity}, masterclass cinematic studio illumination, soft directional golden sunlight, clean optical reflections.
Chromatic Harmony: Rooted in brand primary ${client.primaryColor}, secondary ${client.secondaryColor}, and accent ${client.accentColor}.
Optics: Shot on 85mm f/1.4 prime lens at f/2.0, shallow depth of field, creamy smooth bokeh, tack-sharp focal details.
Composition: Clean rule-of-thirds, clutter-free corner reserved for ${client.logoInstructions}.
Negative Constraints: NO blurry low-res artifacts, no distorted anatomy, strictly NO fake gibberish text or letters.
Aspect Ratio: 1:1 square feed composition, 8k resolution advertising masterpiece.`;

      setPrompt(refined);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-mono font-bold text-amber-400 text-lg">
              {day.dayNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  منشور يوم {day.rawDate} ({day.weekday})
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                  {day.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{day.occasion}</p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
          {/* Estimated date alert */}
          {day.isEstimatedDate && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>تنبيه توثيق التواريخ:</strong> هذه المناسبة ذات تاريخ قمري/فلكي تقديري،
                ويجب مراجعة الإعلان الرسمي لدار الإفتاء المصرية قبل النشر النهائي.
              </span>
            </div>
          )}

          {/* Strategy & Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                فكرة المحتوى التسويقية
              </h4>
              <p className="text-sm font-semibold text-white">{day.contentIdea}</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {day.contentDescription}
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                طريقة ربط الفكرة بمجال العميل ({client.industry})
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">{day.tieInMethod}</p>
              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>الهدف: <strong className="text-amber-400">{day.marketingObjective}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 1: Suggested Social Media Caption */}
          <div className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h3 className="text-sm font-bold text-white">
                  الكابشن المقترح (نص المنشور بالعامية التسويقية المصرية)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Tone Selector for AI */}
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-2.5 py-1 focus:outline-none"
                >
                  <option value="عامية تسويقية مصرية راقية وموثوقة">عامية راقية</option>
                  <option value="عامية مصرية شابة ومرحة وتريندي">عامية شابة وتريند</option>
                  <option value="فصحى عربية معاصرة واحترافية">فصحى معاصرة</option>
                  <option value="صيغة تفاعلية وأسئلة ومسابقات">تفاعلية واستطلاع</option>
                </select>

                <button
                  onClick={handleAiRewriteCaption}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
                  title="إعادة صياغة الكابشن بنبرة مختلفة بواسطة Gemini"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>إعادة صياغة AI</span>
                </button>

                <button
                  onClick={() => copyToClipboard(caption, 'caption')}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"
                >
                  {copiedType === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ النص</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed font-sans"
              placeholder="اكتب أو عدل الكابشن هنا..."
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>جاهز للنشر على فيسبوك، إنستجرام، لينكد إن</span>
              <span>عدد الحروف: {caption.length} حرف</span>
            </div>
          </div>

          {/* Section 2: Final Merged AI Image Prompt */}
          <div className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h3 className="text-sm font-bold text-white">
                  البرومبت النهائي لتوليد الصورة بالذكاء الاصطناعي (Ready for Midjourney / Gemini / ChatGPT)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiRefinePrompt}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600 hover:text-white transition disabled:opacity-50"
                  title="تحسين تفاصيل الإضاءة والتكوين بواسطة Gemini"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحسين الدقة بالـ AI</span>
                </button>

                <button
                  onClick={() => copyToClipboard(prompt, 'prompt')}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-bold"
                >
                  {copiedType === 'prompt' ? (
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-amber-200/90 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed text-left"
              dir="ltr"
            />

            {/* Prompt Quick Specs Badge */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                Aspect Ratio: 1:1
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                Primary: {client.primaryColor}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                Secondary: {client.secondaryColor}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                Accent: {client.accentColor}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                No Gibberish Text
              </span>
            </div>
          </div>

          {/* Publishing Status Selector */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              حالة النشر والاعتماد في التقويم:
            </span>
            <div className="flex gap-2">
              {(
                [
                  'مجدول (Scheduled)',
                  'قيد الإعداد (Draft)',
                  'جاهز للنشر (Ready)',
                  'تم النشر (Published)',
                ] as PublishingStatus[]
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    status === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {aiError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {aiError}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/90 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            إلغاء وتراجع
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات في التقويم</span>
          </button>
        </div>
      </div>
    </div>
  );
};
