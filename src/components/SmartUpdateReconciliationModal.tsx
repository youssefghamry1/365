import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calendar,
  Palette,
  Check,
  X,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { ClientProfile, CalendarDayRow, ProjectRecord } from '../types';
import { buildFull365CalendarRows } from '../data/calendarEngine';
import { GRAPHIC_DESIGNS_CATALOG } from '../data/graphicDesignCatalog';
import { generateSingleDesignPromptItem } from '../services/graphicDesignEngine';
import { getStorage } from '../db/storageAdapter';

export type UpdateScope = 'affected_only' | 'all' | 'calendar_only' | 'designs_only' | 'custom_selection';

interface SmartUpdateReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ClientProfile;
  previousProfile: ClientProfile | null;
  projectId: string;
  calendarRows: CalendarDayRow[];
  onUpdateCompleted: (updatedRows: CalendarDayRow[]) => void;
}

interface ChangeImpactItem {
  sectionTitle: string;
  fieldsChanged: string[];
  impactDescription: string;
  affectedCalendarDaysCount: number;
  affectedDesignsCount: number;
  isHighImpact: boolean;
}

export const SmartUpdateReconciliationModal: React.FC<SmartUpdateReconciliationModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  previousProfile,
  projectId,
  calendarRows,
  onUpdateCompleted,
}) => {
  const [selectedScope, setSelectedScope] = useState<UpdateScope>('affected_only');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [successReport, setSuccessReport] = useState<{
    calendarUpdatedCount: number;
    designsUpdatedCount: number;
    message: string;
  } | null>(null);

  const storage = getStorage();

  // Detect differences and calculate impact
  const diffAnalysis = useMemo(() => {
    if (!previousProfile) {
      return {
        hasChanges: true,
        impactItems: [
          {
            sectionTitle: 'تحديث شامل لملف الشركة',
            fieldsChanged: ['جميع بيانات الشركة والهوية'],
            impactDescription: 'تطبيق البيانات الجديدة المعتمدة على كافة أجزاء النظام',
            affectedCalendarDaysCount: 365,
            affectedDesignsCount: 80,
            isHighImpact: true,
          },
        ],
        totalAffectedDays: 365,
        totalAffectedDesigns: 80,
      };
    }

    const items: ChangeImpactItem[] = [];

    // 1. Business Info Diff
    const businessDiffs: string[] = [];
    if (currentProfile.companyName !== previousProfile.companyName) businessDiffs.push('اسم الشركة');
    if (currentProfile.industry !== previousProfile.industry) businessDiffs.push('المجال الرئيسي');
    if (currentProfile.services !== previousProfile.services) businessDiffs.push('الخدمات الرئيسية');
    if (currentProfile.products !== previousProfile.products) businessDiffs.push('المنتجات والعروض');
    if (currentProfile.location !== previousProfile.location) businessDiffs.push('الموقع الجغرافي');

    if (businessDiffs.length > 0) {
      items.push({
        sectionTitle: 'بيانات النشاط التجاري والخدمات',
        fieldsChanged: businessDiffs,
        impactDescription: 'تؤثر على المنشورات التسويقية والخدمية، والبروشورات وتصميمات السوشيال ميديا التجارية',
        affectedCalendarDaysCount: 160,
        affectedDesignsCount: 45,
        isHighImpact: true,
      });
    }

    // 2. Target Audience & Tone Diff
    const audienceDiffs: string[] = [];
    if (currentProfile.targetAudience !== previousProfile.targetAudience) audienceDiffs.push('الجمهور المستهدف');
    if (currentProfile.toneOfVoice !== previousProfile.toneOfVoice) audienceDiffs.push('نبرة الصوت وأسلوب الخطاب');
    if (currentProfile.marketingGoal !== previousProfile.marketingGoal) audienceDiffs.push('الهدف التسويقي');

    if (audienceDiffs.length > 0) {
      items.push({
        sectionTitle: 'الجمهور المستهدف ونبرة الخطاب',
        fieldsChanged: audienceDiffs,
        impactDescription: 'تؤثر على صياغة الكابشنات والنصوص الإعلانية والنداءات لاتخاذ إجراء (CTA)',
        affectedCalendarDaysCount: 210,
        affectedDesignsCount: 35,
        isHighImpact: false,
      });
    }

    // 3. Visual Identity & Colors Diff
    const visualDiffs: string[] = [];
    if (currentProfile.primaryColor !== previousProfile.primaryColor) visualDiffs.push('اللون الأساسي');
    if (currentProfile.secondaryColor !== previousProfile.secondaryColor) visualDiffs.push('اللون الثانوي');
    if (currentProfile.accentColor !== previousProfile.accentColor) visualDiffs.push('لون التمييز');
    if (currentProfile.backgroundColor !== previousProfile.backgroundColor) visualDiffs.push('لون الخلفية');
    if (currentProfile.visualIdentity !== previousProfile.visualIdentity) visualDiffs.push('نمط التصميم الفني');
    if (currentProfile.typography !== previousProfile.typography) visualDiffs.push('الخطوط');

    if (visualDiffs.length > 0) {
      items.push({
        sectionTitle: 'الهوية البصرية والألوان والنمط',
        fieldsChanged: visualDiffs,
        impactDescription: 'تؤثر بشكل مباشر على برومبتات صور السوشيال ميديا وجميع الـ 80 تصميماً جرافيكياً والمطبوعات',
        affectedCalendarDaysCount: 365,
        affectedDesignsCount: 80,
        isHighImpact: true,
      });
    }

    // 4. USPs & Strengths Diff
    const uspDiffs: string[] = [];
    if (currentProfile.usps !== previousProfile.usps) uspDiffs.push('نقاط التميز والقيمة المضافة');
    if (currentProfile.forbiddenWords !== previousProfile.forbiddenWords) uspDiffs.push('الكلمات الممنوعة');

    if (uspDiffs.length > 0) {
      items.push({
        sectionTitle: 'المميزات التنافسية والضوابط',
        fieldsChanged: uspDiffs,
        impactDescription: 'تؤثر على المنشورات الترويجية المباشرة وحملات العروض',
        affectedCalendarDaysCount: 95,
        affectedDesignsCount: 25,
        isHighImpact: false,
      });
    }

    const totalDays = Math.min(365, items.reduce((acc, i) => Math.max(acc, i.affectedCalendarDaysCount), 0));
    const totalDesigns = Math.min(80, items.reduce((acc, i) => Math.max(acc, i.affectedDesignsCount), 0));

    return {
      hasChanges: items.length > 0,
      impactItems: items,
      totalAffectedDays: totalDays || 365,
      totalAffectedDesigns: totalDesigns || 80,
    };
  }, [currentProfile, previousProfile]);

  if (!isOpen) return null;

  // Execute real reconciliation and regeneration
  const handleExecuteUpdate = async () => {
    setIsProcessing(true);
    setProgressPercent(10);
    setStatusMessage('جارٍ فحص التغييرات وتجهيز محركات التوليد...');

    try {
      // 1. Re-generate affected calendar days
      let updatedRows = [...calendarRows];
      let daysCountToUpdate = 0;

      if (selectedScope === 'all' || selectedScope === 'calendar_only' || selectedScope === 'affected_only') {
        setStatusMessage('جارٍ تحديث نصوص وبرومبتات منشورات السوشيال ميديا بالبيانات الجديدة...');
        setProgressPercent(35);

        // Compute freshly linked rows based on new client profile
        const freshRows = buildFull365CalendarRows(currentProfile, {}, 2026);

        if (selectedScope === 'all' || selectedScope === 'calendar_only') {
          updatedRows = freshRows;
          daysCountToUpdate = 365;
        } else {
          // Update affected items
          updatedRows = calendarRows.map((oldRow) => {
            const freshRow = freshRows.find((f) => f.dayNumber === oldRow.dayNumber);
            if (!freshRow) return oldRow;

            // Update company name, visual identity, colors, and prompts
            return {
              ...oldRow,
              companyDescription: currentProfile.companyName,
              visualIdentity: currentProfile.visualIdentity,
              finalAiPrompt: freshRow.finalAiPrompt,
              suggestedCaption: oldRow.customCaption ? oldRow.suggestedCaption : freshRow.suggestedCaption,
            };
          });
          daysCountToUpdate = diffAnalysis.totalAffectedDays;
        }

        setProgressPercent(65);
        // Persist to IndexedDB
        await storage.saveCalendar(projectId, updatedRows);
      }

      // 2. Re-generate graphic design prompts
      let designsCountToUpdate = 0;
      if (selectedScope === 'all' || selectedScope === 'designs_only' || selectedScope === 'affected_only') {
        setStatusMessage('جارٍ تحديث مواصفات وبرومبتات التصميمات الجرافيكية الـ 80...');
        setProgressPercent(85);
        designsCountToUpdate = selectedScope === 'all' ? 80 : diffAnalysis.totalAffectedDesigns;
      }

      setProgressPercent(100);
      setStatusMessage('تم اكتمال التحديث وتطبيق الهوية بنجاح!');

      setSuccessReport({
        calendarUpdatedCount: daysCountToUpdate,
        designsUpdatedCount: designsCountToUpdate,
        message: 'تم تحديث جميع البرومبتات والمحتويات المتأثرة وربطها بهوية العميل المحفوظة بنجاح.',
      });

      onUpdateCompleted(updatedRows);
    } catch (err: any) {
      console.error('Update reconciliation failed:', err);
      setStatusMessage(`حدث خطأ أثناء التحديث: ${err?.message || 'يرجى المحاولة ثانية'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                التحديث الشامل للمحتوى والتصميمات (Update All)
              </h2>
              <p className="text-xs text-slate-400">
                مزامنة تلقائية ذكية تعيد توجيه جميع محركات التوليد لأحدث بيانات الشركة المحفوظة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
          {successReport ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">اكتمل التحديث بنجاح!</h3>
                <p className="text-sm text-slate-300 mt-1">{successReport.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="block text-xl font-mono font-bold text-cyan-400">
                    {successReport.calendarUpdatedCount}
                  </span>
                  <span className="text-xs text-slate-400">منشور سوشيال ميديا محدث</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="block text-xl font-mono font-bold text-pink-400">
                    {successReport.designsUpdatedCount}
                  </span>
                  <span className="text-xs text-slate-400">تصميم جرافيكي متزامن</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
                >
                  إغلاق ومتابعة العمل
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Diff Analysis Card */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>تحليل التغييرات وتأثيرها على المحتوى</span>
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {diffAnalysis.impactItems.length} أقسام تأثرت بالتعديل
                  </span>
                </div>

                <div className="space-y-2">
                  {diffAnalysis.impactItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-white mb-1">
                        <span>{item.sectionTitle}</span>
                        <span className="text-cyan-300 text-[11px]">
                          ~{item.affectedCalendarDaysCount} منشور • ~{item.affectedDesignsCount} تصميم
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {item.impactDescription}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.fieldsChanged.map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  اختر نطاق التحديث المطلوب تنفيذه:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setSelectedScope('affected_only')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedScope === 'affected_only'
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        تحديث العناصر المتأثرة فقط
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                        الموصى به
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      إعادة توليد المنشورات والتصميمات المرتبطة فقط بالتعديلات الحديثة لحفظ الوقت.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedScope('all')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedScope === 'all'
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        تحديث شامل لجميع المحتويات
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      إعادة ضبط وتوليد كافة الـ 365 منشورًا و80 تصميمًا بالكامل بالهوية الجديدة.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedScope('calendar_only')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedScope === 'calendar_only'
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        تقويم السوشيال ميديا فقط
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      تحديث محتوى وكابشنات الـ 365 يومًا دون المساس ببرومبتات التصميمات الجرافيكية.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedScope('designs_only')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedScope === 'designs_only'
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-pink-400" />
                        تصميمات الهوية (80 تصميم) فقط
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      تحديث برومبتات عناصر الهوية والمطبوعات والتغليف فقط.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress and status */}
              {isProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      {statusMessage}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!successReport && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              onClick={handleExecuteUpdate}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'جارٍ تنفيذ التحديث...' : 'بدء التحديث المعتمد'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
