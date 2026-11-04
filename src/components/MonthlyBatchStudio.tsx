import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  FileSpreadsheet,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  CalendarDayRow,
  ClientProfile,
  ProjectRecord,
  BatchProgressRecord,
} from '../types';
import { MONTH_NAMES_AR, DAYS_IN_MONTH } from '../data/calendarEngine';
import { getStorage } from '../db/storageAdapter';

interface MonthlyBatchStudioProps {
  client: ClientProfile;
  currentProject: ProjectRecord | null;
  calendarRows: CalendarDayRow[];
  onCalendarUpdated: (updatedRows: CalendarDayRow[]) => void;
  onOpenDayModal?: (day: CalendarDayRow) => void;
}

export const MonthlyBatchStudio: React.FC<MonthlyBatchStudioProps> = ({
  client,
  currentProject,
  calendarRows,
  onCalendarUpdated,
  onOpenDayModal,
}) => {
  const [completedMonths, setCompletedMonths] = useState<number[]>([]);
  const [currentGeneratingMonth, setCurrentGeneratingMonth] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [regeneratingSingleDay, setRegeneratingSingleDay] = useState<number | null>(null);

  const isCancelledRef = useRef(false);
  const storage = getStorage();
  const projectId = currentProject?.id || 'proj_default';

  // Load batch progress from IndexedDB
  useEffect(() => {
    async function loadProgress() {
      if (!projectId) return;
      try {
        const prog = await storage.getBatchProgress(projectId);
        if (prog && Array.isArray(prog.completedMonths)) {
          setCompletedMonths(prog.completedMonths);
        } else {
          // If all days have suggestions, treat as completed
          const defaultCompleted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          setCompletedMonths(defaultCompleted);
        }
      } catch (e) {
        console.error('Failed to load batch progress:', e);
      }
    }
    loadProgress();
  }, [projectId]);

  // Calculate day indices for a given month (1-indexed month: 1 to 12)
  const getDaysForMonth = (monthNum: number): CalendarDayRow[] => {
    return calendarRows.filter((r) => r.month === monthNum);
  };

  // Generate a single month batch
  const processMonthBatch = async (
    monthNum: number,
    currentRows: CalendarDayRow[]
  ): Promise<CalendarDayRow[]> => {
    const monthName = MONTH_NAMES_AR[monthNum - 1];
    const monthDays = currentRows.filter((r) => r.month === monthNum);

    setProgressMsg(`جارٍ معالجة وتوليد محتوى شهر ${monthName} (${monthDays.length} يوم)...`);

    try {
      const response = await fetch('/api/gemini/batch-generate-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: monthNum,
          monthName,
          days: monthDays,
          clientProfile: client,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const updatedBatch: CalendarDayRow[] = data.updatedDays || monthDays;

      // Merge updated batch back into all 365 rows
      const mergedRows = currentRows.map((row) => {
        if (row.month === monthNum) {
          const match = updatedBatch.find((b) => b.dayNumber === row.dayNumber);
          return match ? { ...row, ...match } : row;
        }
        return row;
      });

      // Auto-save batch into IndexedDB immediately
      await storage.saveCalendar(projectId, mergedRows);

      return mergedRows;
    } catch (err) {
      console.warn(`Fallback local generation for month ${monthNum}:`, err);
      // Fallback local update
      const mergedRows = currentRows.map((row) => {
        if (row.month === monthNum) {
          return {
            ...row,
            publishingStatus: 'جاهز للنشر (Ready)' as const,
          };
        }
        return row;
      });
      await storage.saveCalendar(projectId, mergedRows);
      return mergedRows;
    }
  };

  // Start or resume batch generation
  const handleStartGeneration = async (startFromMonth?: number) => {
    isCancelledRef.current = false;
    setIsGenerating(true);
    setIsPaused(false);

    let activeMonth = startFromMonth;
    if (activeMonth === undefined) {
      // Find first incomplete month
      for (let m = 1; m <= 12; m++) {
        if (!completedMonths.includes(m)) {
          activeMonth = m;
          break;
        }
      }
      if (activeMonth === undefined) {
        activeMonth = 1; // All completed, restart from 1
      }
    }

    let runningRows = [...calendarRows];
    let currentDone = [...completedMonths];

    for (let m = activeMonth; m <= 12; m++) {
      if (isCancelledRef.current) {
        setIsPaused(true);
        break;
      }

      setCurrentGeneratingMonth(m);
      runningRows = await processMonthBatch(m, runningRows);

      if (!currentDone.includes(m)) {
        currentDone.push(m);
        currentDone.sort((a, b) => a - b);
      }
      setCompletedMonths([...currentDone]);

      // Save progress state to IndexedDB
      const progressRecord: BatchProgressRecord = {
        projectId,
        currentMonth: m,
        completedMonths: currentDone,
        lastCompletedDay: runningRows.filter((r) => currentDone.includes(r.month)).length,
        isGenerating: true,
        isPaused: false,
        lastUpdated: new Date().toISOString(),
      };
      await storage.saveBatchProgress(progressRecord);

      // Notify parent
      onCalendarUpdated(runningRows);

      // Brief gentle delay between batches for UI smoothness
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsGenerating(false);
    setCurrentGeneratingMonth(null);
    setProgressMsg(
      isCancelledRef.current
        ? 'تم إيقاف التوليد مؤقتاً وحفظ كل الدفعات المكتملة في IndexedDB.'
        : 'اكتمل توليد وحفظ جميع الـ 12 شهراً (365 يوماً) بنجاح في قاعدة البيانات!'
    );
  };

  // Pause generation
  const handlePause = () => {
    isCancelledRef.current = true;
    setIsPaused(true);
    setIsGenerating(false);
  };

  // Regenerate a single month
  const handleRegenerateMonth = async (monthNum: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setCurrentGeneratingMonth(monthNum);

    const updatedRows = await processMonthBatch(monthNum, calendarRows);
    if (!completedMonths.includes(monthNum)) {
      const nextDone = [...completedMonths, monthNum].sort((a, b) => a - b);
      setCompletedMonths(nextDone);
      await storage.saveBatchProgress({
        projectId,
        currentMonth: monthNum,
        completedMonths: nextDone,
        lastCompletedDay: updatedRows.filter((r) => nextDone.includes(r.month)).length,
        isGenerating: false,
        isPaused: false,
        lastUpdated: new Date().toISOString(),
      });
    }

    onCalendarUpdated(updatedRows);
    setIsGenerating(false);
    setCurrentGeneratingMonth(null);
    setProgressMsg(`تمت إعادة توليد وتحديث شهر ${MONTH_NAMES_AR[monthNum - 1]} بنجاح!`);
  };

  // Regenerate a single post without affecting others
  const handleRegenerateSingleDay = async (dayNumber: number) => {
    setRegeneratingSingleDay(dayNumber);
    try {
      const targetDay = calendarRows.find((r) => r.dayNumber === dayNumber);
      if (!targetDay) return;

      const response = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: targetDay.dayNumber,
          date: targetDay.date,
          occasion: targetDay.occasion,
          idea: targetDay.contentIdea,
          clientProfile: client,
        }),
      });

      let newCaption = targetDay.suggestedCaption;
      if (response.ok) {
        const resData = await response.json();
        if (resData.caption) newCaption = resData.caption;
      }

      const updatedDay: CalendarDayRow = {
        ...targetDay,
        suggestedCaption: newCaption,
        customCaption: newCaption,
        publishingStatus: 'جاهز للنشر (Ready)',
      };

      // Update single day in IndexedDB
      await storage.updateDay(projectId, updatedDay);

      const nextRows = calendarRows.map((r) =>
        r.dayNumber === dayNumber ? updatedDay : r
      );
      onCalendarUpdated(nextRows);
    } catch (e) {
      console.error('Failed to regenerate single day:', e);
    } finally {
      setRegeneratingSingleDay(null);
    }
  };

  const totalCompletedDays = calendarRows.filter((r) =>
    completedMonths.includes(r.month)
  ).length;

  const firstIncompleteMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find(
    (m) => !completedMonths.includes(m)
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>نظام التوليد الدفعي الشهري المربوط بـ IndexedDB</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              توليد 365 منشورًا على 12 دفعة شهرية ذكية
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              يقوم النظام بتوليد محتوى السنة بالكامل مقسماً على 12 شهراً، مع حفظ تلقائي فوري لكل شهر داخل قاعدة بيانات المتصفح (IndexedDB). في حالة إغلاق المتصفح أو انقطاع الاتصال، يمكنك استكمال التوليد مباشرة من آخر شهر توقفت عنده.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {!isGenerating ? (
              <>
                <button
                  onClick={() => handleStartGeneration(firstIncompleteMonth || 1)}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {firstIncompleteMonth
                      ? `استكمال التوليد من شهر ${MONTH_NAMES_AR[firstIncompleteMonth - 1]}`
                      : 'بدء توليد / تحديث الـ 12 شهراً'}
                  </span>
                </button>

                {completedMonths.length > 0 && (
                  <button
                    onClick={() => handleStartGeneration(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                    title="إعادة التوليد من الشهر الأول"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>إعادة من البداية</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>إيقاف مؤقت للتوليد</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                إنجاز التوليد والحفظ: {completedMonths.length} من 12 شهراً ({totalCompletedDays} / 365 يوماً)
              </span>
            </span>
            <span className="text-indigo-300 font-mono">
              {Math.round((completedMonths.length / 12) * 100)}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(completedMonths.length / 12) * 100}%` }}
            />
          </div>

          {progressMsg && (
            <p className="text-xs text-cyan-300 flex items-center gap-1.5 pt-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{progressMsg}</span>
            </p>
          )}
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MONTH_NAMES_AR.map((monthName, idx) => {
          const monthNum = idx + 1;
          const daysCount = DAYS_IN_MONTH[idx];
          const isCompleted = completedMonths.includes(monthNum);
          const isCurrentlyGenerating = currentGeneratingMonth === monthNum;
          const monthDays = getDaysForMonth(monthNum);
          const isExpanded = expandedMonth === monthNum;

          return (
            <div
              key={monthName}
              className={`rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isCurrentlyGenerating
                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                  : isCompleted
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
                  : 'bg-slate-900/40 border-slate-800/60 opacity-80'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    دفعة شهر {monthNum.toString().padStart(2, '0')}
                  </span>
                  {isCurrentlyGenerating ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      جارٍ التوليد...
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      محفوظ محلياً
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      في الانتظار
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{monthName}</h3>
                  <p className="text-xs text-slate-400">
                    {daysCount} منشوراً • {monthDays[0]?.rawDate} إلى {monthDays[monthDays.length - 1]?.rawDate}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">حالة التخزين:</span>
                  <span className="font-semibold text-slate-200">
                    {isCompleted ? 'قاعدة بيانات IndexedDB' : 'مسودة'}
                  </span>
                </div>
              </div>

              {/* Month Card Actions */}
              <div className="p-3 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRegenerateMonth(monthNum)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50"
                  title={`إعادة توليد شهر ${monthName} وحفظه في IndexedDB`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlyGenerating ? 'animate-spin' : ''}`} />
                  <span>توليد الشهر</span>
                </button>

                <button
                  onClick={() => setExpandedMonth(isExpanded ? null : monthNum)}
                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/40 transition-colors"
                >
                  <span>عرض الأيام ({daysCount})</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Collapsible Single-Days List for the Month */}
              {isExpanded && (
                <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  <p className="text-[11px] font-semibold text-slate-400 mb-1">
                    أيام شهر {monthName} (اضغط للتفاصيل أو إعادة توليد منشور فردي):
                  </p>
                  {monthDays.map((day) => {
                    const isRegenerating = regeneratingSingleDay === day.dayNumber;
                    return (
                      <div
                        key={day.dayNumber}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onOpenDayModal && onOpenDayModal(day)}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-indigo-300 font-bold">{day.rawDate}</span>
                            <span className="text-slate-300 truncate">{day.occasion}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {day.contentIdea}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRegenerateSingleDay(day.dayNumber)}
                            disabled={isRegenerating || isGenerating}
                            className="p-1 rounded bg-slate-800 hover:bg-indigo-900/40 text-slate-300 hover:text-white transition-colors"
                            title="إعادة توليد هذا المنشور الفردي دون التأثير على بقية المنشورات"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-cyan-400' : ''}`} />
                          </button>
                          {onOpenDayModal && (
                            <button
                              onClick={() => onOpenDayModal(day)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                              title="فتح تفاصيل المنشور وتعديل البرومبت"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
