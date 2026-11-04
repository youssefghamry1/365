import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Grid3X3,
  List,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  CalendarDayRow,
  ClientProfile,
  OccasionCategory,
  MarketingObjective,
} from '../types';
import { CATEGORY_LABELS, MONTH_NAMES_AR } from '../data/calendarEngine';

interface CalendarViewProps {
  rows: CalendarDayRow[];
  client: ClientProfile;
  onSelectDay: (day: CalendarDayRow) => void;
  onExportExcel: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  rows,
  client,
  onSelectDay,
  onExportExcel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<OccasionCategory | 'all'>('all');
  const [selectedObjective, setSelectedObjective] = useState<MarketingObjective | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedDayId, setCopiedDayId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const totalDays = rows.length;
    const occasionsCount = rows.filter((r) => r.occasionCategory !== 'brand_regular').length;
    const fridaysCount = rows.filter((r) => r.occasionCategory === 'friday').length;
    const commercialCount = rows.filter((r) => r.occasionCategory === 'commercial').length;
    const nationalCount = rows.filter((r) => r.occasionCategory === 'national').length;
    const islamicCount = rows.filter((r) => r.occasionCategory === 'islamic').length;
    const christianCount = rows.filter((r) => r.occasionCategory === 'christian').length;

    return {
      totalDays,
      occasionsCount,
      fridaysCount,
      commercialCount,
      nationalCount,
      islamicCount,
      christianCount,
    };
  }, [rows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Month filter
      if (selectedMonth !== 'all' && row.month !== selectedMonth) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && row.occasionCategory !== selectedCategory) {
        return false;
      }
      // Objective filter
      if (selectedObjective !== 'all' && row.marketingObjective !== selectedObjective) {
        return false;
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDay = row.dayNumber.toString().includes(q);
        const matchesDate = row.date.toLowerCase().includes(q) || row.rawDate.toLowerCase().includes(q);
        const matchesOccasion = row.occasion.toLowerCase().includes(q);
        const matchesIdea = row.contentIdea.toLowerCase().includes(q);
        const matchesCaption = row.suggestedCaption.toLowerCase().includes(q);

        return matchesDay || matchesDate || matchesOccasion || matchesIdea || matchesCaption;
      }
      return true;
    });
  }, [rows, selectedMonth, selectedCategory, selectedObjective, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDayId(id);
    setTimeout(() => setCopiedDayId(null), 2000);
  };

  const getCategoryBadgeClass = (category: OccasionCategory) => {
    switch (category) {
      case 'islamic':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'christian':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'national':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'social':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'commercial':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'international':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'friday':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">إجمالي الأيام المجهزة</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {stats.totalDays}
            </span>
            <span className="text-xs text-slate-400">/ 365 يوم</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Check className="w-3 h-3" /> مكتمل ومربوط بالعميل
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">أيام الجمعة المباركة</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-teal-400 font-mono">
              {stats.fridaysCount}
            </span>
            <span className="text-xs text-slate-400">جمعة</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">رسائل إيجابية وسكينة</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">المناسبات الدينية</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {stats.islamicCount + stats.christianCount}
            </span>
            <span className="text-xs text-slate-400">مناسبة</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">إسلامية ومسيحية</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">المناسبات الوطنية</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-400 font-mono">
              {stats.nationalCount}
            </span>
            <span className="text-xs text-slate-400">يوم وطني</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">أعياد وبطولات مصرية</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">المواسم والتسوق</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {stats.commercialCount}
            </span>
            <span className="text-xs text-slate-400">موسم</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">جمعة بيضاء وتخفيضات</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">تصدير إكسل فوري</p>
            <p className="text-[11px] text-slate-400 mt-0.5">365 صف + ملف العميل</p>
          </div>
          <button
            onClick={onExportExcel}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            تحميل Excel
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم اليوم، التاريخ، المناسبة، الفكرة، أو الكابشن..."
              className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                مسح
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-400">طريقة العرض:</span>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="عرض جدول إكسل التفاعلي"
              >
                <List className="w-3.5 h-3.5" />
                <span>جدول إكسل</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="عرض بطاقات التقويم"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>بطاقات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-700/60">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>فلترة:</span>
          </div>

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
              )
            }
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">جميع الأشهر (12 شهر)</option>
            {MONTH_NAMES_AR.map((monthName, idx) => (
              <option key={idx} value={idx + 1}>
                شهر {idx + 1} ({monthName})
              </option>
            ))}
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as OccasionCategory | 'all')}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">جميع التصنيفات</option>
            <option value="friday">أيام الجمعة (جمعة مباركة)</option>
            <option value="islamic">مناسبات إسلامية</option>
            <option value="christian">مناسبات مسيحية</option>
            <option value="national">مناسبات وطنية مصرية</option>
            <option value="social">مناسبات اجتماعية وثقافية</option>
            <option value="commercial">مواسم تجارية وتسويقية</option>
            <option value="international">أيام عالمية وتوعوية</option>
            <option value="brand_regular">محتوى النشاط الدوري</option>
          </select>

          {/* Objective Selector */}
          <select
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value as MarketingObjective | 'all')}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">جميع الأهداف التسويقية</option>
            <option value="توعية بالعلامة (Awareness)">توعية بالعلامة</option>
            <option value="تفاعل ومشاركات (Engagement)">تفاعل ومشاركات</option>
            <option value="تحويل ومبيعات (Conversions)">تحويل ومبيعات</option>
            <option value="بناء ثقة ومصداقية (Trust)">بناء ثقة ومصداقية</option>
            <option value="تعليم وتثقيف (Education)">تعليم وتثقيف</option>
            <option value="احتفاظ وولاء (Retention)">احتفاظ وولاء</option>
          </select>

          {/* Reset Filters */}
          {(selectedMonth !== 'all' ||
            selectedCategory !== 'all' ||
            selectedObjective !== 'all' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedMonth('all');
                setSelectedCategory('all');
                setSelectedObjective('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline mr-auto"
            >
              إعادة ضبط الفلاتر
            </button>
          )}

          <div className="text-xs text-slate-400 mr-auto font-mono">
            عرض {filteredRows.length} من أصل 365 يوم
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* Table / Excel View */
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[700px] scrollbar-thin scrollbar-thumb-slate-700">
            <table className="w-full text-right border-collapse text-xs">
              <thead className="bg-slate-900/90 text-slate-300 sticky top-0 z-20 backdrop-blur-md border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3 w-16 text-center font-bold">اليوم #</th>
                  <th className="py-3 px-3 w-28 font-bold">التاريخ واليوم</th>
                  <th className="py-3 px-4 w-52 font-bold">المناسبة والتصنيف</th>
                  <th className="py-3 px-4 w-60 font-bold">فكرة المحتوى والربط</th>
                  <th className="py-3 px-4 w-64 font-bold">الكابشن المقترح</th>
                  <th className="py-3 px-4 w-60 font-bold">برومبت الصورة المدمج</th>
                  <th className="py-3 px-3 w-28 text-center font-bold">الهدف</th>
                  <th className="py-3 px-3 w-24 text-center font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                {filteredRows.map((row) => (
                  <tr
                    key={row.dayNumber}
                    onClick={() => onSelectDay(row)}
                    className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                  >
                    {/* Day Number */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-400 group-hover:text-amber-300">
                      {row.dayNumber}
                    </td>

                    {/* Date & Weekday */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{row.rawDate}</div>
                      <div className="text-[11px] text-slate-400">{row.weekday}</div>
                    </td>

                    {/* Occasion & Category Badge */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-100 line-clamp-1">
                        {row.occasion}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                            row.occasionCategory
                          )}`}
                        >
                          {row.categoryLabel}
                        </span>
                        {row.isEstimatedDate && (
                          <span
                            className="text-amber-400 text-[10px] flex items-center"
                            title="تاريخ تقديري فلكياً"
                          >
                            <AlertCircle className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Content Idea & Description */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-indigo-300 line-clamp-1">
                        {row.contentIdea}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {row.contentDescription}
                      </div>
                    </td>

                    {/* Suggested Caption */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {row.suggestedCaption}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(row.suggestedCaption, `cap_${row.dayNumber}`);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition"
                      >
                        {copiedDayId === `cap_${row.dayNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>نسخ الكابشن</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Final AI Prompt */}
                    <td className="py-3 px-4">
                      <div className="text-[10px] text-slate-400 font-mono line-clamp-2 leading-tight bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/50">
                        {row.finalAiPrompt}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(row.finalAiPrompt, `prompt_${row.dayNumber}`);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition"
                      >
                        {copiedDayId === `prompt_${row.dayNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>نسخ البرومبت الجاهز</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Objective */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
                        {row.marketingObjective.split(' ')[0]}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDay(row);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>فتح</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRows.map((row) => (
            <div
              key={row.dayNumber}
              onClick={() => onSelectDay(row)}
              className="bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/70 rounded-2xl p-4 shadow-md hover:shadow-indigo-950/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                      {row.dayNumber}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{row.rawDate}</h4>
                      <p className="text-[10px] text-slate-400">{row.weekday}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                      row.occasionCategory
                    )}`}
                  >
                    {row.categoryLabel}
                  </span>
                </div>

                {/* Occasion & Idea */}
                <div className="mt-3 space-y-1.5">
                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {row.occasion}
                  </h3>
                  <p className="text-xs font-bold text-indigo-400 line-clamp-1">
                    {row.contentIdea}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {row.contentDescription}
                  </p>
                </div>

                {/* Caption snippet */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>الكابشن:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(row.suggestedCaption, `c_card_${row.dayNumber}`);
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      {copiedDayId === `c_card_${row.dayNumber}` ? 'تم النسخ!' : 'نسخ'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {row.suggestedCaption}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  الهدف: {row.marketingObjective.split(' ')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDay(row);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>التفاصيل والبرومبت</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredRows.length === 0 && (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">لا توجد أيام مطابقة للبحث</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            جرّب تغيير كلمات البحث أو إعادة ضبط خيارات الفلترة لعرض الأيام المتاحة.
          </p>
          <button
            onClick={() => {
              setSelectedMonth('all');
              setSelectedCategory('all');
              setSelectedObjective('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
          >
            عرض كافة الأيام (365)
          </button>
        </div>
      )}
    </div>
  );
};
