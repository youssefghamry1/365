import React, { useState, useRef } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  Calendar,
  Layers,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  RefreshCw,
} from 'lucide-react';
import { ProjectRecord, ClientProfile, BackupDataPayload } from '../types';
import { PRESET_PROFILES } from '../data/presetProfiles';
import { buildFull365CalendarRows } from '../data/calendarEngine';
import { getStorage } from '../db/storageAdapter';

interface ProjectsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onProjectsChanged: () => void;
}

export const ProjectsManagerModal: React.FC<ProjectsManagerModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onSelectProject,
  onProjectsChanged,
}) => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const storage = getStorage();

  // Load projects list
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const projs = await storage.getProjects();
      setProjects(projs);
    } catch (e) {
      console.error('Failed to load projects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadProjects();
      setImportStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Create New Project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const preset = PRESET_PROFILES[selectedPresetIndex]?.profile || PRESET_PROFILES[0].profile;
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Create new client copy
    const clientCopy: ClientProfile = {
      ...preset,
      companyName: newProjectName.trim(),
    };

    const newProject: ProjectRecord = {
      id: newId,
      name: newProjectName.trim(),
      clientProfile: clientCopy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      year: 2026,
      totalDays: 365,
      generatedDaysCount: 365,
      completedMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      status: 'completed',
    };

    // Save project, initial calendar rows, and client in IndexedDB
    await storage.saveProject(newProject);
    const initialRows = buildFull365CalendarRows(clientCopy, {}, 2026);
    await storage.saveCalendar(newId, initialRows);
    await storage.setActiveProjectId(newId);

    setIsCreatingNew(false);
    setNewProjectName('');
    await loadProjects();
    onProjectsChanged();
    onSelectProject(newId);
  };

  // Handle Edit Project Name
  const handleSaveRename = async (proj: ProjectRecord) => {
    if (!editName.trim()) return;
    const updated = {
      ...proj,
      name: editName.trim(),
    };
    await storage.saveProject(updated);
    setEditingProjectId(null);
    await loadProjects();
    onProjectsChanged();
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: string, name: string) => {
    if (projects.length <= 1) {
      alert('لا يمكن حذف المشروع الوحيد. قم بإنشاء مشروع آخر أولاً.');
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف المشروع "${name}" نهائياً من قاعدة بيانات المتصفح؟`)) {
      await storage.deleteProject(id);
      if (currentProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          await storage.setActiveProjectId(remaining[0].id);
          onSelectProject(remaining[0].id);
        }
      }
      await loadProjects();
      onProjectsChanged();
    }
  };

  // Handle Export Backup JSON
  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const backupData = await storage.exportBackup();
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `نسخة_احتياطية_مشاريع_365_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export backup:', e);
      alert('فشل تصدير النسخة الاحتياطية.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Import Backup JSON
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed: BackupDataPayload = JSON.parse(text);

      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        throw new Error('ملف النسخة الاحتياطية غير صالح أو تالف.');
      }

      const result = await storage.importBackup(parsed, 'merge');
      setImportStatus(`تم استيراد ${result.importedProjects} مشروع بنجاح إلى قاعدة بيانات المتصفح (IndexedDB).`);
      await loadProjects();
      onProjectsChanged();
      if (parsed.activeProjectId) {
        onSelectProject(parsed.activeProjectId);
      }
    } catch (err: any) {
      console.error('Failed to import backup:', err);
      setImportStatus(`خطأ في الاستيراد: ${err?.message || 'الملف غير صالح'}`);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                إدارة المشاريع والعملاء (قاعدة بيانات المتصفح)
              </h2>
              <p className="text-xs text-slate-400">
                مخزنة محلياً بالكامل عبر IndexedDB بدون انقطاع مع حفظ دائم وتصدير واستيراد JSON
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

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>مشروع جديد</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="تصدير نسخة احتياطية كاملة JSON لجميع المشاريع والتقويمات"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="استيراد مشاريع من ملف JSON"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>استيراد نسخة (JSON)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Feedback alert */}
        {importStatus && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between">
            <span>{importStatus}</span>
            <button onClick={() => setImportStatus(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form: Create New Project */}
        {isCreatingNew && (
          <div className="p-4 m-4 bg-slate-800/80 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">إنشاء مشروع جديد لعميل</h3>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                إلغاء
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم المشروع / اسم الشركة</label>
                <input
                  type="text"
                  placeholder="مثلاً: شركة الفراعنة للمقاولات الحديثة"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">ابدأ من قالب أو نشاط مسبق</label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {PRESET_PROFILES.map((p, idx) => (
                    <option key={p.name} value={idx}>
                      {p.name} ({p.profile.industry})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all"
              >
                إنشاء وبدء المشروع
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
              جارٍ تحميل المشاريع من IndexedDB...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              لا توجد مشاريع مخزنة. اضغط على "مشروع جديد" للبدء.
            </div>
          ) : (
            projects.map((proj) => {
              const isSelected = proj.id === currentProjectId;
              const isEditing = editingProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                      : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-full max-w-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(proj)}
                            className="p-1 text-emerald-400 hover:bg-slate-700 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProjectId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-700 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{proj.name}</h4>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              المشروع النشط
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {proj.clientProfile?.industry || 'نشاط تجاري'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          365 منشور ({proj.year || 2026})
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-500">
                          آخر تعديل: {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isSelected && (
                        <button
                          onClick={() => {
                            onSelectProject(proj.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all"
                        >
                          فتح المشروع
                        </button>
                      )}

                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingProjectId(proj.id);
                            setEditName(proj.name);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
                          title="تعديل اسم المشروع"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.name)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="حذف المشروع"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>قاعدة البيانات المحلية: IndexedDB مفعلة وجاهزة</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
