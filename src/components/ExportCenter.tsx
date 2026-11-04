import React from 'react';
import {
  FileSpreadsheet,
  FileText,
  FileCode,
  Archive,
  BookOpen,
  CheckCircle2,
  Download,
  Check,
  ShieldCheck,
  FolderArchive,
  Sparkles,
} from 'lucide-react';
import { CalendarDayRow, ClientProfile } from '../types';

interface ExportCenterProps {
  rows: CalendarDayRow[];
  client: ClientProfile;
  onDownloadZip: () => void;
  onDownloadExcel: () => void;
  onDownloadWord: () => void;
  onDownloadTxt: () => void;
  onDownloadGuide: () => void;
  isDownloadingZip: boolean;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  rows,
  client,
  onDownloadZip,
  onDownloadExcel,
  onDownloadWord,
  onDownloadTxt,
  onDownloadGuide,
  isDownloadingZip,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero ZIP Download Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/15 text-slate-950 font-bold text-xs">
              <FolderArchive className="w-4 h-4" />
              حزمة التسليم الكاملة (All-In-One ZIP)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              تحميل كافة الملفات المطلوبة للتسليم
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed font-medium">
              حزمة مضغوطة رسمية تحتوي على ملف الإكسل السنوي (365 يوماً)، ملف Word لمكتبة البرومبتات
              العشرة، ملف TXT الخام، ودليل التشغيل والاستخدام، مهيأة بالكامل لشركة:{' '}
              <strong className="underline font-bold">{client.companyName || 'العميل'}</strong>.
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-xl hover:shadow-2xl active:scale-95 text-sm sm:text-base font-extrabold shrink-0 disabled:opacity-50"
          >
            <Archive className="w-5 h-5 text-amber-400" />
            <span>{isDownloadingZip ? 'جاري تجهيز الحزمة...' : 'تحميل حزمة ZIP المجمعة الآن'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Individual Deliverable Files */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>الملفات الفردية المتاحة للتحميل والمعاينة:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File 1: Excel (.xlsx) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/60 transition shadow-md">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <FileSpreadsheet className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] font-mono text-emerald-300 font-bold border border-slate-700">
                  .XLSX (Excel)
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                1. ملف Excel الأساسي (التقويم السنوي 365)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                يحتوي على ورقتين كاملتين:
                <br />
                • <strong>Sheet 1: Content Calendar</strong>: 365 صفاً مستقلاً بجميع الأعمدة الـ 13 المطلوبة.
                <br />
                • <strong>Sheet 2: Client Profile</strong>: ملف العميل الموحد بكافة حقوله الـ 18.
              </p>
            </div>
            <button
              onClick={onDownloadExcel}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              تحميل ملف Excel (.xlsx)
            </button>
          </div>

          {/* File 2: Word (.doc) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/60 transition shadow-md">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <FileText className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] font-mono text-blue-300 font-bold border border-slate-700">
                  .DOC (Word)
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                2. ملف Word لمكتبة البرومبتات الأساسية
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                وثيقة وورد منسقة باحترافية كاملة مع جداول وشارات، تحتوي على البرومبتات العشرة
                الاستراتيجية مع أهدافها وإرشادات استخدامها وملاحظات الفريق.
              </p>
            </div>
            <button
              onClick={onDownloadWord}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              تحميل ملف Word (.doc)
            </button>
          </div>

          {/* File 3: Plain Text (.txt) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-500/60 transition shadow-md">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-3 rounded-2xl bg-slate-700/40 text-slate-300 border border-slate-600">
                  <FileCode className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] font-mono text-slate-300 font-bold border border-slate-700">
                  .TXT (Text)
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                3. ملف TXT للبرومبتات الجاهزة
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                نصوص خام للبرومبتات الـ 10 مهيأة للنسخ المباشر من أي هاتف أو حاسوب دون أي مشاكل
                في الترميز أو التنسيق، ومخصصة لبيانات شركتك.
              </p>
            </div>
            <button
              onClick={onDownloadTxt}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              تحميل ملف TXT (.txt)
            </button>
          </div>

          {/* File 4: User Guide (.md) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/60 transition shadow-md">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  <BookOpen className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] font-mono text-purple-300 font-bold border border-slate-700">
                  .MD (Guide)
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                4. دليل الاستخدام والتشغيل والنشر في مصر
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                دليل تفصيلي يشرح طريقة تطبيق النظام على أي عميل، وأفضل أوقات النشر في مصر، وطريقة
                توليد الصور في Midjourney وGemini وتجنب الأخطاء الشائعة.
              </p>
            </div>
            <button
              onClick={onDownloadGuide}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              تحميل دليل الاستخدام (.md)
            </button>
          </div>
        </div>
      </div>

      {/* Quality Standards & Verification Checklist */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            قائمة التحقق من معايير الجودة والتسليم (Quality Audit)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">365 صفاً مكتملاً:</strong>
              <span className="text-slate-400">
                لا توجد صفوف فارغة أو نماذج تجريبية مبتورة، التقويم مغطى يوماً بيوم.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">ورقتان مستقلتان في Excel:</strong>
              <span className="text-slate-400">
                ورقة تقويم المحتوى (Content Calendar) وورقة ملف العميل (Client Profile).
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">توثيق المناسبات المصرية:</strong>
              <span className="text-slate-400">
                المناسبات الدينية الإسلامية والمسيحية، الوطنية، الاجتماعية، و52 جمعة مباركة.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">برومبت صور مدمج جاهز للنسخ:</strong>
              <span className="text-slate-400">
                برومبت مستقل لكل يوم يدمج هوية وألوان العميل ومساحة الشعار وتفاصيل الإضاءة.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">كوابشن تسويقية بالعامية المصرية:</strong>
              <span className="text-slate-400">
                نصوص متكاملة بهوك خاطف، نص مقنع، ودعوة لاتخاذ إجراء (CTA) وهاشتاجات.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">مكتبة البرومبتات العشرة:</strong>
              <span className="text-slate-400">
                ملفات Word وTXT المستقلة جاهزة ومطابقة للمواصفات الاستراتيجية.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
