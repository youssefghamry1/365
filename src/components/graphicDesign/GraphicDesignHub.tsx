import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Copy,
  Check,
  Eye,
  FileSpreadsheet,
  Download,
  Printer,
  Monitor,
  CheckSquare,
  Square,
  Sparkles,
  Palette,
  FileText,
  Archive,
  Grid3X3,
  List,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ClientProfile } from '../../types';
import {
  DesignCategoryKey,
  DesignUsageType,
  GeneratedDesignPromptItem,
} from '../../types/graphicDesign';
import { DESIGN_CATEGORIES, GRAPHIC_DESIGNS_CATALOG } from '../../data/graphicDesignCatalog';
import { generateSingleDesignPromptItem } from '../../services/graphicDesignEngine';
import {
  exportDesignsToExcel,
  exportDesignsToCsv,
  downloadGraphicDesignsZip,
  downloadBlob,
  generateDesignsPlainText,
  generateDesignsWordHtml,
} from '../../services/graphicDesignExport';
import { DesignDetailModal } from './DesignDetailModal';

interface GraphicDesignHubProps {
  client: ClientProfile;
}

export const GraphicDesignHub: React.FC<GraphicDesignHubProps> = ({ client }) => {
  // Category filter: 'all' or specific category
  const [selectedCategory, setSelectedCategory] = useState<DesignCategoryKey | 'all'>('all');
  const [usageFilter, setUsageFilter] = useState<DesignUsageType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedDesignIds, setSelectedDesignIds] = useState<Set<string>>(
    new Set(GRAPHIC_DESIGNS_CATALOG.map((d) => d.id)) // Default all 80 selected for convenience
  );

  // Overrides storage for customized designs
  const [customizedItems, setCustomizedItems] = useState<
    Record<string, Partial<GeneratedDesignPromptItem>>
  >({});

  // Active design for detail modal
  const [activeModalItem, setActiveModalItem] = useState<GeneratedDesignPromptItem | null>(null);

  // Copy notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Generate full generated items bound to current client
  const allGeneratedItems: GeneratedDesignPromptItem[] = useMemo(() => {
    return GRAPHIC_DESIGNS_CATALOG.map((tpl) => {
      const isSelected = selectedDesignIds.has(tpl.id);
      const base = generateSingleDesignPromptItem(tpl, client, undefined, isSelected);
      const custom = customizedItems[tpl.id];
      if (custom) {
        return {
          ...base,
          ...custom,
          textContent: custom.textContent || base.textContent,
          isSelected,
        };
      }
      return base;
    });
  }, [client, selectedDesignIds, customizedItems]);

  // Filtered designs
  const filteredItems = useMemo(() => {
    return allGeneratedItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.template.category !== selectedCategory) {
        return false;
      }
      // Usage filter
      if (usageFilter !== 'all') {
        if (usageFilter === 'print' && item.template.usageType !== 'print' && item.template.usageType !== 'hybrid') {
          return false;
        }
        if (usageFilter === 'digital' && item.template.usageType !== 'digital' && item.template.usageType !== 'hybrid') {
          return false;
        }
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const numMatch = item.template.number.toString().includes(q);
        const nameArMatch = item.template.nameAr.toLowerCase().includes(q);
        const nameEnMatch = item.template.nameEn.toLowerCase().includes(q);
        const goalMatch = item.template.goalAr.toLowerCase().includes(q);
        const headlineMatch = item.textContent.headline.toLowerCase().includes(q);
        return numMatch || nameArMatch || nameEnMatch || goalMatch || headlineMatch;
      }
      return true;
    });
  }, [allGeneratedItems, selectedCategory, usageFilter, searchQuery]);

  // Items currently selected by user
  const selectedItemsList = useMemo(() => {
    return allGeneratedItems.filter((item) => selectedDesignIds.has(item.template.id));
  }, [allGeneratedItems, selectedDesignIds]);

  // Toggle selection for single item
  const toggleItemSelection = (id: string) => {
    setSelectedDesignIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all or select category
  const selectAll = () => {
    setSelectedDesignIds(new Set(GRAPHIC_DESIGNS_CATALOG.map((d) => d.id)));
  };

  const deselectAll = () => {
    setSelectedDesignIds(new Set());
  };

  const selectCurrentCategory = (categoryKey: DesignCategoryKey) => {
    const idsInCat = GRAPHIC_DESIGNS_CATALOG.filter((d) => d.category === categoryKey).map((d) => d.id);
    setSelectedDesignIds((prev) => {
      const next = new Set(prev);
      idsInCat.forEach((id) => next.add(id));
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveModalItem = (updated: GeneratedDesignPromptItem) => {
    setCustomizedItems((prev) => ({
      ...prev,
      [updated.template.id]: updated,
    }));
  };

  // Export handlers
  const handleExportExcel = () => {
    const itemsToExport = selectedItemsList.length > 0 ? selectedItemsList : allGeneratedItems;
    const fileName = `تصميمات_الهوية_${(client.companyName || 'العميل').replace(/\s+/g, '_')}.xlsx`;
    exportDesignsToExcel(itemsToExport, client, fileName);
  };

  const handleExportCsv = () => {
    const itemsToExport = selectedItemsList.length > 0 ? selectedItemsList : allGeneratedItems;
    const fileName = `تصميمات_الهوية_${(client.companyName || 'العميل').replace(/\s+/g, '_')}.csv`;
    exportDesignsToCsv(itemsToExport, client, fileName);
  };

  const handleExportTxt = () => {
    const itemsToExport = selectedItemsList.length > 0 ? selectedItemsList : allGeneratedItems;
    const txt = generateDesignsPlainText(itemsToExport, client);
    const blob = new Blob(['\ufeff' + txt], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `برومبتات_الهوية_${(client.companyName || 'العميل').replace(/\s+/g, '_')}.txt`);
  };

  const handleExportWord = () => {
    const itemsToExport = selectedItemsList.length > 0 ? selectedItemsList : allGeneratedItems;
    const html = generateDesignsWordHtml(itemsToExport, client);
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    downloadBlob(blob, `دليل_مواصفات_التصميمات_${(client.companyName || 'العميل').replace(/\s+/g, '_')}.doc`);
  };

  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      const itemsToExport = selectedItemsList.length > 0 ? selectedItemsList : allGeneratedItems;
      const fileName = `حزمة_تصميمات_الهوية_${(client.companyName || 'العميل').replace(/\s+/g, '_')}.zip`;
      await downloadGraphicDesignsZip(itemsToExport, client, fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
    }
  };

  // Check if some client data is missing
  const missingFieldsNotice = useMemo(() => {
    const missing: string[] = [];
    if (!client.companyName) missing.push('اسم الشركة');
    if (!client.industry) missing.push('مجال الشركة');
    if (!client.services) missing.push('الخدمات');
    if (!client.targetAudience) missing.push('الجمهور المستهدف');
    if (!client.usps) missing.push('نقاط التميز');
    return missing;
  }, [client]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Identity & Graphic Design – الهوية البصرية والتصميمات الجرافيكية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              محرك برومبتات ومواصفات الهوية البصرية (80 تصميماً معيارياً)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              نظام ذكي متكامل يربط بين نشاط شركة <strong className="text-amber-400 font-bold">{client.companyName || 'العميل'}</strong>،
              وهويتها وألوانها المعتمدة، لإنشاء برومبتات احترافية ومواصفات دقيقة جاهزة للتسليم للمصمم الجرافيكي أو أدوات الذكاء الاصطناعي (Midjourney, Gemini, Imagen 3, DALL-E 3).
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch md:self-auto">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
              title="تصدير جدول التصميمات المحددة إلى ملف Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={handleExportZip}
              disabled={isExportingZip}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-400/20 disabled:opacity-50"
              title="تحميل حزمة التصميمات كاملة (Excel + CSV + Word + TXT)"
            >
              <Archive className="w-4 h-4 text-slate-950" />
              <span>{isExportingZip ? 'جاري التحضير...' : 'تحميل حزمة ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Missing fields alert if any */}
        {missingFieldsNotice.length > 0 && (
          <div className="mt-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>تنبيه لاكتمال الدقة:</strong> لم تقم بإدخال ({missingFieldsNotice.join(' ، ')}).
              يمكنك استكمالها في تبويب <strong>"ملف العميل"</strong> لتعظيم دقة وملاءمة البرومبتات.
            </span>
          </div>
        )}
      </div>

      {/* 6 Category Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DESIGN_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.key)}
              className={`text-right p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-102'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/70 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/60 font-bold">
                    #{cat.number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {cat.badgeCount} عنصر
                  </span>
                </div>
                <h4 className="text-xs font-bold block mb-1 text-white">{cat.titleAr}</h4>
                <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{cat.titleEn}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls & Search & Filter Bar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم التصميم، الاسم بالعربية أو الإنجليزية، أو الهدف..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

          {/* View toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-400">طريقة العرض:</span>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'table' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>جدول المخرجات</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>بطاقات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Selection helpers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>تصفية:</span>
            </span>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DesignCategoryKey | 'all')}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="all">جميع التصنيفات الـ 6 (80 تصميم)</option>
              {DESIGN_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.titleAr} ({c.badgeCount} تصميم)
                </option>
              ))}
            </select>

            {/* Usage Type Dropdown */}
            <select
              value={usageFilter}
              onChange={(e) => setUsageFilter(e.target.value as DesignUsageType | 'all')}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="all">كل الاستخدامات (مطبوعات ورقمي)</option>
              <option value="print">مطبوعات فقط (CMYK 300 DPI)</option>
              <option value="digital">رقمي وسوشيال ومواقع (RGB)</option>
            </select>

            {(selectedCategory !== 'all' || usageFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setUsageFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-400 hover:underline mr-2"
              >
                إعادة الضبط
              </button>
            )}
          </div>

          {/* Bulk Selection Actions */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">
              المحدد للتصدير: <strong className="text-cyan-400 font-mono">{selectedDesignIds.size}</strong> من {allGeneratedItems.length}
            </span>
            <button
              onClick={selectAll}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
            >
              تحديد الكل
            </button>
            <button
              onClick={deselectAll}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table View or Cards View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[720px] scrollbar-thin scrollbar-thumb-slate-700">
            <table className="w-full text-right border-collapse text-xs">
              <thead className="bg-slate-900/95 text-slate-300 sticky top-0 z-20 backdrop-blur-md border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedDesignIds.size === allGeneratedItems.length}
                      onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                      className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-16 text-center font-bold">#</th>
                  <th className="py-3 px-4 w-52 font-bold">اسم التصميم والتصنيف</th>
                  <th className="py-3 px-4 w-36 font-bold">المقاس والاستخدام</th>
                  <th className="py-3 px-4 w-60 font-bold">المحتوى النصي المقترح</th>
                  <th className="py-3 px-4 w-72 font-bold">البرومبت النهائي بالإنجليزية (AI Prompt)</th>
                  <th className="py-3 px-3 w-28 text-center font-bold">الجودة</th>
                  <th className="py-3 px-3 w-24 text-center font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                {filteredItems.map((item) => {
                  const isSelected = selectedDesignIds.has(item.template.id);
                  return (
                    <tr
                      key={item.template.id}
                      onClick={() => setActiveModalItem(item)}
                      className={`hover:bg-slate-700/30 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-cyan-950/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.template.id)}
                          className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Number */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                        #{item.template.number}
                      </td>

                      {/* Name & Category */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition">
                          {item.template.nameAr}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.template.nameEn}
                        </div>
                      </td>

                      {/* Dimensions & Usage */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-200">{item.customizedDimensions}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          {item.template.usageType === 'print' ? (
                            <Printer className="w-3 h-3 text-amber-400" />
                          ) : (
                            <Monitor className="w-3 h-3 text-cyan-400" />
                          )}
                          <span>{item.template.usageType === 'print' ? 'طباعة CMYK' : 'رقمي RGB'}</span>
                        </div>
                      </td>

                      {/* Text Content */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 line-clamp-1">
                          {item.textContent.headline}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.textContent.featuredOfferOrServices}
                        </div>
                      </td>

                      {/* Final AI Prompt */}
                      <td className="py-3 px-4">
                        <div className="text-[10px] text-amber-200/90 font-mono line-clamp-2 bg-slate-950/70 p-2 rounded-xl border border-slate-700/60 leading-relaxed text-left" dir="ltr">
                          {item.finalEnglishPrompt}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.finalEnglishPrompt, `tbl_${item.template.id}`);
                          }}
                          className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition"
                        >
                          {copiedId === `tbl_${item.template.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>نسخ البرومبت الجاهز</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Quality Score */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.qualityAudit.scoreOutOf10}/10</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalItem(item);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white transition font-medium"
                        >
                          <Eye className="w-3 h-3" />
                          <span>فتح</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedDesignIds.has(item.template.id);
            return (
              <div
                key={item.template.id}
                onClick={() => setActiveModalItem(item)}
                className={`bg-slate-800/90 border rounded-2xl p-4 shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-cyan-500/80 shadow-cyan-950/40 bg-slate-800'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                        #{item.template.number}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.template.nameAr}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{item.customizedDimensions}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemSelection(item.template.id);
                      }}
                      className="text-slate-400 hover:text-cyan-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {item.template.goalAr}
                    </p>

                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50 mt-2">
                      <span className="text-[10px] text-slate-400 block mb-0.5">العنوان المقترح:</span>
                      <strong className="text-slate-100 text-[11px] block line-clamp-1">
                        {item.textContent.headline}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>مطابقة {item.qualityAudit.scoreOutOf10}/10</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.finalEnglishPrompt, `card_${item.template.id}`);
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    {copiedId === `card_${item.template.id}` ? 'تم النسخ!' : 'نسخ البرومبت'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Edit Modal */}
      <DesignDetailModal
        item={activeModalItem}
        client={client}
        onClose={() => setActiveModalItem(null)}
        onSave={handleSaveModalItem}
      />
    </div>
  );
};
