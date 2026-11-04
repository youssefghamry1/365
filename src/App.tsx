import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Building2,
  FileCode,
  Download,
  Sparkles,
  Archive,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
} from 'lucide-react';
import { ClientProfile, CalendarDayRow, ProjectRecord } from './types';
import { PRESET_PROFILES } from './data/presetProfiles';
import { buildFull365CalendarRows } from './data/calendarEngine';
import { exportCalendarToExcel } from './services/excelExport';
import { downloadFullSystemZip, downloadSingleFile } from './services/zipExport';
import { getStorage } from './db/storageAdapter';

import { Navbar, NavTabType } from './components/Navbar';
import { CalendarView } from './components/CalendarView';
import { ClientProfileEditor } from './components/ClientProfileEditor';
import { PromptsStudio } from './components/PromptsStudio';
import { ExportCenter } from './components/ExportCenter';
import { AiStudioView } from './components/AiStudioView';
import { DayDetailModal } from './components/DayDetailModal';
import { GraphicDesignHub } from './components/graphicDesign/GraphicDesignHub';
import { MonthlyBatchStudio } from './components/MonthlyBatchStudio';
import { ProjectsManagerModal } from './components/ProjectsManagerModal';

export default function App() {
  const storage = getStorage();

  // Current active project record
  const [currentProject, setCurrentProject] = useState<ProjectRecord | null>(null);

  // Client Profile state
  const [client, setClient] = useState<ClientProfile>(PRESET_PROFILES[0].profile);

  // 365 Calendar rows state persisted with IndexedDB
  const [calendarRows, setCalendarRows] = useState<CalendarDayRow[]>(() =>
    buildFull365CalendarRows(PRESET_PROFILES[0].profile, {}, 2026)
  );

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTabType>('calendar');

  // Selected day for modal drawer
  const [selectedDay, setSelectedDay] = useState<CalendarDayRow | null>(null);

  // Projects manager modal
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  // ZIP download loading state
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Initialize IndexedDB on load and load active project
  useEffect(() => {
    async function initDatabase() {
      try {
        await storage.init();
        const activeId = await storage.getActiveProjectId();
        const projects = await storage.getProjects();

        if (projects.length > 0) {
          const target = projects.find((p) => p.id === activeId) || projects[0];
          setCurrentProject(target);
          setClient(target.clientProfile);

          const savedRows = await storage.getCalendar(target.id);
          if (savedRows && savedRows.length === 365) {
            setCalendarRows(savedRows);
          } else {
            const initialRows = buildFull365CalendarRows(target.clientProfile, {}, 2026);
            setCalendarRows(initialRows);
            await storage.saveCalendar(target.id, initialRows);
          }
        }
      } catch (err) {
        console.error('Error initializing database from IndexedDB:', err);
      }
    }
    initDatabase();
  }, []);

  // Handle Project Selection / Switch
  const handleSelectProject = async (projectId: string) => {
    try {
      const proj = await storage.getProject(projectId);
      if (proj) {
        setCurrentProject(proj);
        setClient(proj.clientProfile);
        await storage.setActiveProjectId(projectId);

        const savedRows = await storage.getCalendar(projectId);
        if (savedRows && savedRows.length === 365) {
          setCalendarRows(savedRows);
        } else {
          const newRows = buildFull365CalendarRows(proj.clientProfile, {}, 2026);
          setCalendarRows(newRows);
          await storage.saveCalendar(projectId, newRows);
        }
      }
    } catch (e) {
      console.error('Failed to select project:', e);
    }
  };

  // Handle Client Profile Updates & auto-save to IndexedDB
  const handleClientChange = async (updatedClient: ClientProfile) => {
    setClient(updatedClient);

    if (currentProject) {
      const updatedProj: ProjectRecord = {
        ...currentProject,
        clientProfile: updatedClient,
        name: updatedClient.companyName || currentProject.name,
        updatedAt: new Date().toISOString(),
      };
      setCurrentProject(updatedProj);
      await storage.saveProject(updatedProj);

      // Re-link client visual identity with calendar rows
      const updatedRows = calendarRows.map((row) => ({
        ...row,
        companyDescription: updatedClient.companyName,
        visualIdentity: updatedClient.visualIdentity,
      }));
      setCalendarRows(updatedRows);
      await storage.saveCalendar(currentProject.id, updatedRows);
    }
  };

  // Handle Calendar Rows update from Batch Generator
  const handleCalendarUpdated = async (updatedRows: CalendarDayRow[]) => {
    setCalendarRows(updatedRows);
    if (currentProject) {
      await storage.saveCalendar(currentProject.id, updatedRows);
    }
  };

  // Save single day override & persist to IndexedDB
  const handleSaveDay = async (updatedDay: CalendarDayRow) => {
    const updatedRows = calendarRows.map((r) =>
      r.dayNumber === updatedDay.dayNumber ? updatedDay : r
    );
    setCalendarRows(updatedRows);

    if (currentProject) {
      await storage.updateDay(currentProject.id, updatedDay);
    }
  };

  // Export handlers
  const handleDownloadExcel = () => {
    const fileName = `تقويم_المحتوى_المصري_365_يوم_${client.companyName.replace(/\s+/g, '_')}.xlsx`;
    exportCalendarToExcel(calendarRows, client, fileName);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zipFileName = `حزمة_نظام_365_بوست_${client.companyName.replace(/\s+/g, '_')}.zip`;
      await downloadFullSystemZip(calendarRows, client, zipFileName);
    } catch (error) {
      console.error('Failed to download zip:', error);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleDownloadWord = () => {
    downloadSingleFile('word', client);
  };

  const handleDownloadTxt = () => {
    downloadSingleFile('txt', client);
  };

  const handleDownloadGuide = () => {
    downloadSingleFile('guide', client);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        client={client}
        projectName={currentProject?.name}
        onOpenProjectsManager={() => setIsProjectsModalOpen(true)}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'calendar' && (
          <CalendarView
            rows={calendarRows}
            client={client}
            onSelectDay={setSelectedDay}
            onExportExcel={handleDownloadExcel}
          />
        )}

        {activeTab === 'batch_generator' && (
          <MonthlyBatchStudio
            client={client}
            currentProject={currentProject}
            calendarRows={calendarRows}
            onCalendarUpdated={handleCalendarUpdated}
            onOpenDayModal={setSelectedDay}
          />
        )}

        {activeTab === 'graphic_design' && (
          <GraphicDesignHub client={client} />
        )}

        {activeTab === 'profile' && (
          <ClientProfileEditor
            client={client}
            onChangeClient={handleClientChange}
            onResetToDefault={() => handleClientChange(PRESET_PROFILES[0].profile)}
            projectId={currentProject?.id || 'proj_default'}
            calendarRows={calendarRows}
            onCalendarUpdated={handleCalendarUpdated}
          />
        )}

        {activeTab === 'prompts' && (
          <PromptsStudio
            client={client}
            onDownloadDoc={handleDownloadWord}
            onDownloadTxt={handleDownloadTxt}
          />
        )}

        {activeTab === 'export' && (
          <ExportCenter
            rows={calendarRows}
            client={client}
            onDownloadZip={handleDownloadZip}
            onDownloadExcel={handleDownloadExcel}
            onDownloadWord={handleDownloadWord}
            onDownloadTxt={handleDownloadTxt}
            onDownloadGuide={handleDownloadGuide}
            isDownloadingZip={isDownloadingZip}
          />
        )}

        {activeTab === 'ai_assistant' && <AiStudioView client={client} />}
      </main>

      {/* Day Details & Prompt Modal */}
      <DayDetailModal
        day={selectedDay}
        client={client}
        onClose={() => setSelectedDay(null)}
        onSaveDay={handleSaveDay}
      />

      {/* Projects and Database Management Modal */}
      <ProjectsManagerModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        currentProjectId={currentProject?.id || ''}
        onSelectProject={handleSelectProject}
        onProjectsChanged={() => currentProject && handleSelectProject(currentProject.id)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">نظام إدارة وإنتاج 365 بوست سوشيال ميديا</span>
            <span className="text-slate-600">•</span>
            <span>متوافق بالكامل مع Netlify وتخزين محلي IndexedDB</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>مكتمل 365 يوماً على 12 دفعة شهرية</span>
            <span className="text-slate-600">•</span>
            <span>مخصص لجميع الأنشطة والشركات في مصر 🇪🇬</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
