import React, { useState, useEffect } from 'react';
import {
  History,
  RotateCcw,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Calendar,
  Building2,
  FileText,
} from 'lucide-react';
import { ClientProfile, ProfileVersionRecord } from '../types';
import { getStorage } from '../db/storageAdapter';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentProfile: ClientProfile;
  onRestoreVersion: (restoredProfile: ClientProfile) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentProfile,
  onRestoreVersion,
}) => {
  const [versions, setVersions] = useState<ProfileVersionRecord[]>([]);
  const [selectedVersionForPreview, setSelectedVersionForPreview] = useState<ProfileVersionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const storage = getStorage();

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const list = await storage.getProfileVersions(projectId);
      setVersions(list);
    } catch (e) {
      console.error('Failed to load profile versions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVersions();
      setSelectedVersionForPreview(null);
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleRestore = async (version: ProfileVersionRecord) => {
    if (
      window.confirm(
        `هل أنت متأكد من استعادة الإصدار رقم ${version.versionNumber}؟ سيتم حفظ النسخة الحالية تلقائياً في السجل قبل الاسترجاع.`
      )
    ) {
      // Save current version as historical before restoring
      const nextVersionNum = (versions[0]?.versionNumber || 1) + 1;
      const backupVersion: ProfileVersionRecord = {
        id: `ver_${Date.now()}_prev`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        projectId,
        clientProfile: currentProfile,
        changedSections: ['نسخة احتياطية قبل استرجاع الإصدار ' + version.versionNumber],
        summaryNote: `تم الحفظ تلقائياً قبل استعادة الإصدار v${version.versionNumber}`,
      };
      await storage.saveProfileVersion(backupVersion);

      // Restore
      onRestoreVersion(version.clientProfile);
      onClose();
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (window.confirm('هل تريد حذف هذا الإصدار من السجل؟')) {
      await storage.deleteProfileVersion(versionId);
      await loadVersions();
      if (selectedVersionForPreview?.id === versionId) {
        setSelectedVersionForPreview(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                سجل إصدارات وتاريخ تعديلات الشركة (Version History)
              </h2>
              <p className="text-xs text-slate-400">
                متابعة دقيقة لكل عملية حفظ مع إمكانية المعاينة والاسترجاع الآمن دون فقدان أي بيانات
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

        {/* Content Body: Split View (List on right, Preview on left) */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Versions List */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-l border-slate-800 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
              <span>الإصدارات المحفوظة ({versions.length})</span>
              <span>الأحدث أولاً</span>
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                جارٍ تحميل السجل...
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  لا توجد إصدارات سابقة مسجلة بعد. سيتم تسجيل نسخة جديدة تلقائياً عند كل ضغط على "Save & Update Profile".
                </p>
              </div>
            ) : (
              versions.map((ver) => {
                const isSelected = selectedVersionForPreview?.id === ver.id;
                const formattedDate = new Date(ver.timestamp).toLocaleString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVersionForPreview(ver)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          v{ver.versionNumber}
                        </span>
                        <span className="text-xs font-bold text-white truncate max-w-[160px]">
                          {ver.clientProfile.companyName || 'تعديل بدون اسم'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formattedDate}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {ver.summaryNote || 'تم حفظ تعديلات جديدة على ملف العميل'}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {ver.changedSections?.slice(0, 2).map((sec, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleRestore(ver)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center gap-1 transition-colors"
                          title="استعادة هذه النسخة كملف نشط"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>استعادة</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(ver.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30"
                          title="حذف من السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Version Preview Pane */}
          <div className="w-full md:w-1/2 p-5 overflow-y-auto space-y-4 bg-slate-950/30 scrollbar-thin">
            {selectedVersionForPreview ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>معاينة الإصدار v{selectedVersionForPreview.versionNumber}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({new Date(selectedVersionForPreview.timestamp).toLocaleString('ar-EG')})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedVersionForPreview.summaryNote}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(selectedVersionForPreview)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة هذا الإصدار</span>
                  </button>
                </div>

                {/* Profile Fields Quick Inspection */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1 font-bold">اسم الشركة والنشاط:</span>
                    <span className="text-white font-semibold block">
                      {selectedVersionForPreview.clientProfile.companyName}
                    </span>
                    <span className="text-slate-300 block text-[11px] mt-0.5">
                      {selectedVersionForPreview.clientProfile.industry}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1 font-bold">الخدمات والمنتجات:</span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedVersionForPreview.clientProfile.services}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1 font-bold">الجمهور المستهدف ونبرة الصوت:</span>
                    <p className="text-slate-300">
                      {selectedVersionForPreview.clientProfile.targetAudience}
                    </p>
                    <span className="text-cyan-300 text-[11px] block mt-1">
                      النبرة: {selectedVersionForPreview.clientProfile.toneOfVoice}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-2 font-bold">ألوان الهوية والنمط:</span>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-md border border-slate-700 shadow-sm"
                        style={{ backgroundColor: selectedVersionForPreview.clientProfile.primaryColor }}
                        title="الأساسي"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-slate-700 shadow-sm"
                        style={{ backgroundColor: selectedVersionForPreview.clientProfile.secondaryColor }}
                        title="الثانوي"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-slate-700 shadow-sm"
                        style={{ backgroundColor: selectedVersionForPreview.clientProfile.accentColor }}
                        title="التمييز"
                      />
                      <span className="font-mono text-[11px] text-slate-400">
                        {selectedVersionForPreview.clientProfile.primaryColor} • {selectedVersionForPreview.clientProfile.secondaryColor}
                      </span>
                    </div>
                    <span className="text-slate-300 text-[11px] block">
                      النمط: {selectedVersionForPreview.clientProfile.visualIdentity}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-500 text-xs">
                حدد إصداراً من القائمة الجانبية لمعاينة تفاصيله كاملة هنا
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>يتم الحفظ التلقائي لكل إصدار في قاعدة بيانات المتصفح IndexedDB</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
