import React from 'react';
import {
  CalendarDays,
  Building2,
  FileCode,
  Download,
  Sparkles,
  Archive,
  Palette,
  FolderKanban,
  Layers,
  Database,
} from 'lucide-react';
import { ClientProfile } from '../types';

export type NavTabType =
  | 'calendar'
  | 'batch_generator'
  | 'graphic_design'
  | 'profile'
  | 'prompts'
  | 'export'
  | 'ai_assistant';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  client: ClientProfile;
  projectName?: string;
  onOpenProjectsManager: () => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  client,
  projectName,
  onOpenProjectsManager,
  onDownloadZip,
  isDownloadingZip,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 text-xl font-mono">
                  365
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  نظام إنتاج المحتوى والهوية البصرية
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  التقويم السنوي + 80 تصميم
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <button
                  onClick={onOpenProjectsManager}
                  className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-cyan-200 hover:underline max-w-[200px] sm:max-w-xs truncate"
                  title="تغيير المشروع الحالي أو إنشاء مشروع جديد"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{projectName || client.companyName || 'المشروع الحالي'}</span>
                </button>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px] truncate hidden md:inline">
                  {client.industry}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Project Manager & Quick ZIP Download */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenProjectsManager}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm transition-all duration-200 active:scale-95"
              title="إدارة المشاريع والعملاء في المتصفح وتصدير/استيراد نسخة JSON"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">إدارة المشاريع (IndexedDB & JSON)</span>
              <span className="md:hidden">المشاريع</span>
            </button>

            <button
              onClick={onDownloadZip}
              disabled={isDownloadingZip}
              className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
              title="تحميل حزمة التسليم الكاملة (إكسل 365 + وورد + تكست + دليل)"
            >
              <Archive className="w-4 h-4 text-slate-900" />
              <span className="hidden sm:inline">تحميل الحزمة (ZIP)</span>
              <span className="sm:hidden">ZIP</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-reverse space-x-1 sm:space-x-reverse sm:space-x-2 border-t border-slate-800/80 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-indigo-300" />
            <span>تقويم المحتوى (365 يوم)</span>
          </button>

          <button
            onClick={() => setActiveTab('batch_generator')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
              activeTab === 'batch_generator'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>التوليد الشهري الذكي (365 بوست)</span>
            <span className="bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              دفعات شهرية
            </span>
          </button>

          <button
            onClick={() => setActiveTab('graphic_design')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
              activeTab === 'graphic_design'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span>الهوية والتصميمات (80 تصميم)</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-300" />
            <span>ملف العميل والهوية البصرية</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'prompts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-300" />
            <span>مكتبة البرومبتات الأساسية (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>مركز التصدير والملفات</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'ai_assistant'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>مساعد الذكاء الاصطناعي</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

