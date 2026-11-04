import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Play,
  FileDown,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { MASTER_PROMPTS_LIBRARY } from '../data/promptsLibrary';
import { ClientProfile, MasterPromptItem } from '../types';

interface PromptsStudioProps {
  client: ClientProfile;
  onDownloadDoc: () => void;
  onDownloadTxt: () => void;
}

export const PromptsStudio: React.FC<PromptsStudioProps> = ({
  client,
  onDownloadDoc,
  onDownloadTxt,
}) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(MASTER_PROMPTS_LIBRARY[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useClientData, setUseClientData] = useState<boolean>(true);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const selectedPrompt = MASTER_PROMPTS_LIBRARY.find((p) => p.id === selectedPromptId) || MASTER_PROMPTS_LIBRARY[0];

  // Compile prompt by substituting client profile data if toggle enabled
  const getCompiledPrompt = (prompt: MasterPromptItem): string => {
    let text = prompt.promptTemplate;
    if (useClientData && client) {
      text = text
        .replace(/\[COMPANY_NAME\]/g, client.companyName || '[اسم الشركة]')
        .replace(/\[INDUSTRY\]/g, client.industry || '[المجال]')
        .replace(/\[SERVICES_PRODUCTS\]/g, `${client.services} - ${client.products}`)
        .replace(/\[OFFERING\]/g, `${client.services} بأسعار وعروض مميزة`)
        .replace(/\[LOCATION\]/g, client.location || '[الموقع]')
        .replace(/\[TARGET_REGION\]/g, client.location || 'القاهرة الكبرى ومحافظات مصر')
        .replace(/\[RAW_DESCRIPTION\]/g, `${client.companyName}، شركة متخصصة في ${client.industry}. نقاط القوة: ${client.usps}`)
        .replace(/\[DESIRED_VIBE\]/g, client.visualIdentity || 'عصري وفاخر')
        .replace(/\[CURRENT_COLORS\]/g, `أساسي: ${client.primaryColor}، ثانوي: ${client.secondaryColor}، تمييز: ${client.accentColor}`)
        .replace(/\[CLIENT_DATA\]/g, `${client.companyName} (${client.industry})`)
        .replace(/\[CLIENT_INDUSTRY\]/g, client.industry || 'المجال')
        .replace(/\[USP_OR_SOLUTION\]/g, client.usps || 'أعلى جودة معتمدة')
        .replace(/\[CALL_TO_ACTION\]/g, `تواصل معنا عبر ${client.contactData || 'الرسائل'}`)
        .replace(/\[BRAND_COLORS\]/g, `${client.primaryColor}, ${client.secondaryColor}, ${client.accentColor}`)
        .replace(/\[STYLE_TYPE\]/g, client.visualIdentity || 'Commercial Photography')
        .replace(/\[CLIENT_GUIDELINES\]/g, `الكلمات الممنوعة: ${client.forbiddenWords}. توجيهات: ${client.specialInstructions}`);
    }
    return text;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const compiledText = getCompiledPrompt(selectedPrompt);

  const handleTestWithGemini = async () => {
    setIsTesting(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: 1,
          date: 'اليوم',
          occasion: selectedPrompt.title,
          idea: compiledText,
          clientProfile: client,
        }),
      });
      const data = await res.json();
      setTestOutput(data.caption || 'تم التنفيذ بنجاح');
    } catch (err: any) {
      setTestOutput('تعذر التجربة عبر الذكاء الاصطناعي');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            سادساً: مكتبة البرومبتات الأساسية العشرة
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            استوديو هندسة البرومبتات الذكية (Master Prompts)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            10 برومبتات استراتيجية معيارية تغطي كافة مراحل إنتاج محتوى السوشيال ميديا: التحليل،
            استخراج البيرسونا، الهوية البصرية، توليد الأفكار، ربط المناسبات، كتابة الكوابشن، هندسة صور الذكاء الاصطناعي، ومراقبة الجودة.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={onDownloadDoc}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            title="تحميل مكتبة البرومبتات كملف Word منسق"
          >
            <FileDown className="w-4 h-4" />
            تحميل Word (.doc)
          </button>
          <button
            onClick={onDownloadTxt}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"
            title="تحميل مكتبة البرومبتات كملف نصي خام"
          >
            <FileCode className="w-4 h-4" />
            تحميل TXT
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Prompt Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-semibold">
            <span>البرومبتات الـ 10 المعيارية:</span>
            <span>10 برومبتات</span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            {MASTER_PROMPTS_LIBRARY.map((item) => {
              const isSelected = item.id === selectedPromptId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedPromptId(item.id);
                    setTestOutput(null);
                  }}
                  className={`w-full text-right p-3.5 rounded-2xl border transition-all text-xs flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                      {item.category}
                    </span>
                    <strong className="block text-xs font-bold truncate text-slate-100">
                      {item.title}
                    </strong>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.objective}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Prompt Inspector & Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-5">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-sm">
                    {selectedPrompt.number}
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-400">
                      {selectedPrompt.category}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedPrompt.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Substitute Client Data Toggle */}
                  <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useClientData}
                      onChange={(e) => setUseClientData(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>دمج بيانات {client.companyName || 'العميل'}</span>
                  </label>

                  <button
                    onClick={() => copyToClipboard(compiledText, selectedPrompt.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md shadow-amber-500/20"
                  >
                    {copiedId === selectedPrompt.id ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ البرومبت بالكامل</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-0.5">الهدف الاستراتيجي:</span>
                  <span className="text-slate-200 font-medium">{selectedPrompt.objective}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-0.5">النماذج الموصى بها:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {selectedPrompt.targetTools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Codebox */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>نص البرومبت المعياري (Prompt Code):</span>
                <span>جاهز للنسخ إلى ChatGPT أو Gemini أو Midjourney</span>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={compiledText}
                  rows={13}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 font-mono leading-relaxed focus:outline-none scrollbar-thin scrollbar-thumb-slate-700"
                />
              </div>
            </div>

            {/* Usage Instructions & Variables */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs space-y-2">
              <h4 className="font-bold text-slate-200">💡 إرشادات الاستخدام وكيفية التنفيذ:</h4>
              <p className="text-slate-300 leading-relaxed">{selectedPrompt.usageInstructions}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <strong>المتغيرات المدمجة:</strong>{' '}
                {selectedPrompt.inputVariables.map((v) => v.key).join(' ، ')}
              </div>
            </div>

            {/* Live Testing Box with Gemini */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">
                    تجربة فورية للبرومبت بواسطة الذكاء الاصطناعي (Gemini 3.8 Flash)
                  </span>
                </div>
                <button
                  onClick={handleTestWithGemini}
                  disabled={isTesting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'جاري التشغيل...' : 'تشغيل البرومبت'}</span>
                </button>
              </div>

              {testOutput && (
                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-700/50 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {testOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
