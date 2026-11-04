import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Palette,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Type,
  FileCheck,
  AlertTriangle,
  Send,
  PhoneCall,
  Target,
  History,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  HelpCircle,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  X,
  Share2,
} from 'lucide-react';
import { ClientProfile, CustomProfileField, ProfileVersionRecord } from '../types';
import { PRESET_PROFILES } from '../data/presetProfiles';
import { exportProfilePdf } from '../services/profilePdfExport';
import { VersionHistoryModal } from './VersionHistoryModal';
import { SmartUpdateReconciliationModal } from './SmartUpdateReconciliationModal';
import { getStorage } from '../db/storageAdapter';

interface ClientProfileEditorProps {
  client: ClientProfile;
  onChangeClient: (updated: ClientProfile) => void;
  onResetToDefault: () => void;
  projectId?: string;
  calendarRows?: any[];
  onCalendarUpdated?: (updatedRows: any[]) => void;
}

export type EditorTabKey = 'business' | 'audience' | 'usps' | 'strategy' | 'visual' | 'custom_fields';

export const ClientProfileEditor: React.FC<ClientProfileEditorProps> = ({
  client,
  onChangeClient,
  onResetToDefault,
  projectId = 'proj_default',
  calendarRows = [],
  onCalendarUpdated,
}) => {
  // Working buffer state so user can make edits and decide to Save or Reset
  const [formData, setFormData] = useState<ClientProfile>(client);
  const [savedSnapshot, setSavedSnapshot] = useState<ClientProfile>(client);
  const [activeTab, setActiveTab] = useState<EditorTabKey>('business');

  // Modals state
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [versionsCount, setVersionsCount] = useState(0);

  // AI analysis state
  const [rawCompanyOverview, setRawCompanyOverview] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // New Custom Field inputs
  const [newFieldSection, setNewFieldSection] = useState('معلومات إضافية');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [isAddingCustomField, setIsAddingCustomField] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const storage = getStorage();

  // Keep buffer synced when client changes from outside (e.g. project switch)
  useEffect(() => {
    setFormData(client);
    setSavedSnapshot(client);
  }, [client]);

  // Load versions count
  useEffect(() => {
    async function loadCount() {
      try {
        const list = await storage.getProfileVersions(projectId);
        setVersionsCount(list.length);
      } catch (e) {
        console.error('Failed to count versions:', e);
      }
    }
    loadCount();
  }, [projectId]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Has unsaved changes check
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(savedSnapshot);

  // Update a single field in the form buffer
  const updateField = (field: keyof ClientProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 1. Save Changes
  const handleSaveChanges = async () => {
    onChangeClient(formData);
    setSavedSnapshot(formData);
    showToast('تم حفظ تعديلات ملف الشركة بنجاح في قاعدة البيانات المحلية!');
  };

  // 2. Save & Update Profile (creates a version record in Version History)
  const handleSaveAndUpdateProfile = async () => {
    onChangeClient(formData);
    setSavedSnapshot(formData);

    // Create a Version Record
    try {
      const existingVersions = await storage.getProfileVersions(projectId);
      const nextVersionNum = (existingVersions[0]?.versionNumber || 0) + 1;

      // Identify changed sections
      const changed: string[] = [];
      if (formData.companyName !== savedSnapshot.companyName || formData.industry !== savedSnapshot.industry || formData.services !== savedSnapshot.services) {
        changed.push('بيانات النشاط');
      }
      if (formData.targetAudience !== savedSnapshot.targetAudience || formData.toneOfVoice !== savedSnapshot.toneOfVoice) {
        changed.push('الجمهور والاستراتيجية');
      }
      if (formData.primaryColor !== savedSnapshot.primaryColor || formData.visualIdentity !== savedSnapshot.visualIdentity) {
        changed.push('الهوية البصرية');
      }
      if (changed.length === 0) changed.push('تحديث بيانات عامة');

      const versionRecord: ProfileVersionRecord = {
        id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        projectId,
        clientProfile: formData,
        changedSections: changed,
        summaryNote: `إصدار v${nextVersionNum}: تحديث معتمد لـ ${formData.companyName || 'الشركة'}`,
      };

      await storage.saveProfileVersion(versionRecord);
      setVersionsCount(existingVersions.length + 1);
      showToast(`تم حفظ وتثبيت الإصدار رقم v${nextVersionNum} بنجاح في سجل الإصدارات!`);
    } catch (e) {
      console.error('Failed to create profile version:', e);
      showToast('تم حفظ الملف بنجاح (تعذر تسجيل نسخة إضافية في السجل)', 'info');
    }
  };

  // 3. Reset Changes
  const handleResetChanges = () => {
    if (window.confirm('هل تريد التراجع عن التعديلات غير المحفوظة واستعادة آخر نسخة محفوظة؟')) {
      setFormData(savedSnapshot);
      showToast('تم إلغاء التعديلات غير المحفوظة والرجوع لآخر حفظ.', 'info');
    }
  };

  // 4. Export Profile PDF
  const handleExportPdf = () => {
    exportProfilePdf(formData);
    showToast('جارٍ تجهيز ملف PDF المطبوع بالهوية الكاملة...');
  };

  // 5. Export JSON Backup
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `بروفايل_شركة_${(formData.companyName || 'العميل').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف JSON بنجاح.');
  };

  // 6. Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.companyName || parsed.industry) {
          const merged: ClientProfile = {
            ...formData,
            ...parsed,
          };
          setFormData(merged);
          showToast('تم استيراد بيانات الشركة بنجاح! اضغط Save Changes للاعتماد.');
        } else {
          showToast('الملف لا يحتوي على بنية بيانات شركة صالحة', 'error');
        }
      } catch (err) {
        showToast('فشل قراءة ملف JSON', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 7. Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم صورة الشعار يجب أن يكون أقل من 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateField('logoUrl', dataUrl);
      showToast('تم تحميل الشعار بنجاح.');
    };
    reader.readAsDataURL(file);
  };

  // 8. Add Custom Field
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim() || !newFieldValue.trim()) return;

    const newField: CustomProfileField = {
      id: `cf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      section: newFieldSection.trim() || 'معلومات إضافية',
      label: newFieldLabel.trim(),
      value: newFieldValue.trim(),
    };

    const updated = [...(formData.customFields || []), newField];
    updateField('customFields', updated);
    setNewFieldLabel('');
    setNewFieldValue('');
    setIsAddingCustomField(false);
    showToast('تمت إضافة الحقل المخصص بنجاح.');
  };

  const handleDeleteCustomField = (id: string) => {
    const updated = (formData.customFields || []).filter((f) => f.id !== id);
    updateField('customFields', updated);
  };

  // 9. AI Auto-Analyze Client
  const handleAiAnalyze = async () => {
    if (!rawCompanyOverview.trim()) {
      setAiError('يرجى كتابة نبذة أو وصف للشركة أولاً لتحليلها واستخراج البيانات');
      return;
    }
    setIsAiAnalyzing(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/analyze-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyOverview: rawCompanyOverview }),
      });

      if (!res.ok) {
        throw new Error('فشل تحليل بيانات الشركة بواسطة خادم الذكاء الاصطناعي');
      }

      const data = await res.json();
      if (data.profile) {
        const p = data.profile;
        setFormData((prev) => ({
          ...prev,
          companyName: p.companyName || prev.companyName,
          companyOverview: rawCompanyOverview,
          industry: p.industry || prev.industry,
          services: p.services || prev.services,
          products: p.products || prev.products,
          targetAudience: p.targetAudience || prev.targetAudience,
          location: p.location || prev.location,
          usps: p.usps || prev.usps,
          visualIdentity: p.visualIdentity || prev.visualIdentity,
          primaryColor: p.primaryColor || prev.primaryColor,
          secondaryColor: p.secondaryColor || prev.secondaryColor,
          accentColor: p.accentColor || prev.accentColor,
          backgroundColor: p.backgroundColor || prev.backgroundColor,
          typography: p.typography || prev.typography,
          toneOfVoice: p.toneOfVoice || prev.toneOfVoice,
          logoInstructions: p.logoInstructions || prev.logoInstructions,
          contactData: p.contactData || prev.contactData,
          marketingGoal: p.marketingGoal || prev.marketingGoal,
          forbiddenWords: p.forbiddenWords || prev.forbiddenWords,
          specialInstructions: p.specialInstructions || prev.specialInstructions,
        }));
        showToast('تم استخراج وتحليل بيانات الشركة بالذكاء الاصطناعي بنجاح!');
      }
    } catch (err: any) {
      setAiError(err?.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up border ${
            toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-500/40'
              : toastMessage.type === 'info'
              ? 'bg-indigo-950 text-indigo-200 border-indigo-500/40'
              : 'bg-emerald-950 text-emerald-200 border-emerald-500/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Command Center Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                مركز التحكم المعتمد لبيانات الشركة
              </span>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  يوجد تعديلات غير محفوظة
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{formData.companyName || 'ملف الشركة والهوية البصرية'}</span>
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                ({formData.industry || 'حدد المجال'})
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              المصدر المرجعي الموحد لجميع محركات توليد المحتوى (365 بوست) وتصميمات الهوية (80 تصميم). يمكنك تعديل وكتابة جميع النصوص بحرية تامة دون أي قيود.
            </p>
          </div>

          {/* Action Deck Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleSaveChanges}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
              title="حفظ التعديلات في قاعدة البيانات"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleSaveAndUpdateProfile}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 active:scale-95"
              title="حفظ وتسجيل إصدار جديد في سجل الإصدارات"
            >
              <FileCheck className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>

            <button
              onClick={() => setIsReconciliationOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all duration-200 active:scale-95"
              title="تحديث شامل للمحتوى والتصميمات لتتطابق مع البيانات الجديدة"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update All Generated Content</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="تصدير بروفايل الشركة كملف PDF عالي الجودة"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={() => setIsVersionHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="عرض سجل الإصدارات وتاريخ التعديلات"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>السجل ({versionsCount})</span>
            </button>

            {hasUnsavedChanges && (
              <button
                onClick={handleResetChanges}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl font-semibold text-xs text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 transition-all"
                title="إلغاء التغييرات والرجوع لآخر حفظ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={handleExportJson}
              className="p-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
              title="تصدير نسخة احتياطية JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
              title="استيراد نسخة JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex space-x-reverse space-x-1 sm:space-x-reverse sm:space-x-2 border-t border-slate-800 pt-4 mt-5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'business'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>1. بيانات النشاط التجاري</span>
          </button>

          <button
            onClick={() => setActiveTab('audience')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audience'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>2. دراسة الجمهور المستهدف</span>
          </button>

          <button
            onClick={() => setActiveTab('usps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'usps'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>3. نقاط التميز والمنافسة</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'strategy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>4. الاستراتيجية ونبرة الصوت</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span>5. الهوية البصرية والألوان</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_fields')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'custom_fields'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>أقسام وحقول مخصصة</span>
            {(formData.customFields || []).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 font-mono">
                {(formData.customFields || []).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* AI Smart Extraction Bar (Collapsible / Non-intrusive) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">
              استخراج ذكي لبيانات الشركة (اختياري)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            الصق نبذة عن الشركة ليقوم الذكاء الاصطناعي بتوزيع البيانات على الأقسام تلقائياً
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="مثال: نحن شركة تطوير عقاري في التجمع الخامس والعاصمة الإدارية نستهدف المستثمرين..."
            value={rawCompanyOverview}
            onChange={(e) => setRawCompanyOverview(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAiAnalyze}
            disabled={isAiAnalyzing || !rawCompanyOverview.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 disabled:opacity-50 transition-all shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isAiAnalyzing ? 'جارٍ التحليل...' : 'استخراج وتعبئة'}</span>
          </button>
        </div>
        {aiError && <p className="text-xs text-rose-400 mt-2">{aiError}</p>}
      </div>

      {/* TAB 1: Business Information */}
      {activeTab === 'business' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">1. بيانات النشاط التجاري (Business Information)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                اكتب جميع بيانات الشركة بحرية كاملة، حيث يتم تمرير هذه المعلومات بدقة لجميع البرومبتات
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم الشركة أو العلامة التجارية *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="مثال: عيادات النيل التخصصية لطب الأسنان"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                المجال الرئيسي والتخصص *
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                placeholder="مثال: الرعاية الصحية، طب وجراحة الفم والأسنان وتجميل الابتسامة"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                وصف النشاط التجاري والرسالة المؤسسية
              </label>
              <textarea
                rows={3}
                value={formData.companyOverview || ''}
                onChange={(e) => updateField('companyOverview', e.target.value)}
                placeholder="اكتب نبذة شاملة عن الشركة، تاريخ التأسيس، الرؤية، والنشاط التجاري بتفصيل..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الأنشطة الفرعية والتخصصات الدقيقة
              </label>
              <textarea
                rows={3}
                value={formData.subActivities || ''}
                onChange={(e) => updateField('subActivities', e.target.value)}
                placeholder="مثال: زراعة الأسنان الفورية، تقويم شفاف، عدسات الفينير، علاج الجذور بالميكروسكوب..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الخدمات المقدمة (Services) *
              </label>
              <textarea
                rows={3}
                value={formData.services}
                onChange={(e) => updateField('services', e.target.value)}
                placeholder="قائمة بجميع الخدمات المتاحة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                المنتجات أو العروض والباقات (Products / Packages)
              </label>
              <textarea
                rows={3}
                value={formData.products}
                onChange={(e) => updateField('products', e.target.value)}
                placeholder="مثال: باقات تبييض الأسنان بالليزر، عروض فحص الأسنان العائلي، أنظمة التقسيط..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الموقع الجغرافي ونطاق التغطية والسوق المستهدف *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="مثال: القاهرة الكبرى (المعادي، التجمع، الشيخ زايد) والإسكندرية"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                معلومات وقنوات التواصل (الهاتف، واتساب، العنوان، الروابط) *
              </label>
              <textarea
                rows={2}
                value={formData.contactData}
                onChange={(e) => updateField('contactData', e.target.value)}
                placeholder="مثال: الخط الساخن 19xxx | واتساب 010xxxxxxxx | 15 شارع النصر، المعادي، القاهرة | www.website.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Target Audience Analysis */}
      {activeTab === 'audience' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">2. دراسة الجمهور المستهدف (Target Audience Analysis)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديد شخصية العميل (Buyer Persona) والمشكلات التي تواجهه لضمان كتابة كابشنات تلمس اهتماماته الفعلية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                وصف الجمهور المستهدف العام *
              </label>
              <textarea
                rows={3}
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
                placeholder="مثال: الرجال والنساء من عمر 22 إلى 50 عاماً، الباحثون عن مظهر جذاب وابتسامة واثقة، الطبقة المتوسطة والعليا..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الفئات العمرية والديموغرافيا
              </label>
              <input
                type="text"
                value={formData.audienceAge || ''}
                onChange={(e) => updateField('audienceAge', e.target.value)}
                placeholder="مثال: 20-35 سنة (شباب ومقبلين على الزواج) و35-55 سنة (عائلات)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الاهتمامات وأسلوب الحياة (Interests & Lifestyle)
              </label>
              <input
                type="text"
                value={formData.audienceInterests || ''}
                onChange={(e) => updateField('audienceInterests', e.target.value)}
                placeholder="مثال: العناية بالمظهر، الصحة والجمال، المظهر الاحترافي في العمل، التقاط الصور..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الاحتياجات والمشكلات الأساسية (Pain Points)
              </label>
              <textarea
                rows={3}
                value={formData.audienceProblems || ''}
                onChange={(e) => updateField('audienceProblems', e.target.value)}
                placeholder="مثال: الخوف من ألم الأسنان، عدم الثقة في جودة التعقيم، القلق من التكلفة المرتفعة، ضيق وقت المواعيد..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                دوافع اتخاذ القرار وسلوك الشراء (Buying Triggers)
              </label>
              <textarea
                rows={3}
                value={formData.decisionTriggers || ''}
                onChange={(e) => updateField('decisionTriggers', e.target.value)}
                placeholder="مثال: التوصيات الإيجابية، صور قبل وبعد الواقعية، الضمان المعتمد، توفر أنظمة تقسيط مريحة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الاعتراضات المحتملة وكيفية الرد عليها (Objection Handling)
              </label>
              <input
                type="text"
                value={formData.potentialObjections || ''}
                onChange={(e) => updateField('potentialObjections', e.target.value)}
                placeholder="مثال: 'الأسعار غالية' -> الرد بضمان الجودة والتقسيط | 'أخاف من الألم' -> الرد بتقنيات التخدير الرقمي بدون ألم"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Competitive Advantage & USPs */}
      {activeTab === 'usps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">3. نقاط التميز والميزة التنافسية (Competitive Advantage & USPs)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديد القيمة الحقيقية التي تجعل العملاء يفضلون شركتك عن المنافسين في السوق المصري
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نقاط التميز والقيمة التنافسية الفريدة (USPs) *
              </label>
              <textarea
                rows={3}
                value={formData.usps}
                onChange={(e) => updateField('usps', e.target.value)}
                placeholder="مثال: أحدث أجهزة التعقيم المعتمدة دولياً، ضمان كتابي على الزرعات، استشاريون من كبرى الجامعات، مواعيد دقيقة بدون انتظار..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نقاط القوة الداخلية (Core Strengths)
              </label>
              <textarea
                rows={3}
                value={formData.strengths || ''}
                onChange={(e) => updateField('strengths', e.target.value)}
                placeholder="مثال: خبرة تتجاوز 15 عاماً، استخدام خامات ألمانية وسويسرية معتمدة، خدمة عملاء ومتابعة بعد العلاج 24/7..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                أسباب اختيار الشركة (Why Choose Us)
              </label>
              <textarea
                rows={3}
                value={formData.reasonsToChoose || ''}
                onChange={(e) => updateField('reasonsToChoose', e.target.value)}
                placeholder="مثال: راحة تامة أثناء الزيارة، شفافية كاملة في خطة العلاج والأسعار، تجارب حقيقية موثقة لمئات العملاء..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الرسائل التسويقية الأساسية والشعار اللفظي (Slogan / Core Marketing Messages)
              </label>
              <input
                type="text"
                value={formData.coreMarketingMessages || ''}
                onChange={(e) => updateField('coreMarketingMessages', e.target.value)}
                placeholder="مثال: 'ابتسامتك استثمارك الأجمل' | 'أعلى معايير الدقة والراحة في مكان واحد'"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Marketing Strategy & Tone */}
      {activeTab === 'strategy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">4. الاستراتيجية التسويقية ونبرة الصوت (Marketing Strategy)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                توجيه محتوى الـ 365 يومًا ليتوافق بدقة مع لهجة مخاطبة الجمهور وأهداف الشركة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الهدف التسويقي الأساسي *
              </label>
              <input
                type="text"
                value={formData.marketingGoal}
                onChange={(e) => updateField('marketingGoal', e.target.value)}
                placeholder="مثال: بناء الوعي بالعلامة، زيادة الحجوزات والمبيعات، تعزيز ثقة العملاء"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نبرة الصوت وأسلوب الخطاب (Tone of Voice) *
              </label>
              <input
                type="text"
                value={formData.toneOfVoice}
                onChange={(e) => updateField('toneOfVoice', e.target.value)}
                placeholder="مثال: عامية راقية ودودة، احترافية مطمئنة، مباشرة، خالية من المبالغات"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                المنصات التسويقية المستهدفة
              </label>
              <input
                type="text"
                value={formData.targetPlatforms || ''}
                onChange={(e) => updateField('targetPlatforms', e.target.value)}
                placeholder="مثال: فيسبوك، إنستجرام، لينكد إن، تيك توك، واتساب للأعمال"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نماذج الدعوة لاتخاذ إجراء (Call to Action - CTA)
              </label>
              <input
                type="text"
                value={formData.callToActions || ''}
                onChange={(e) => updateField('callToActions', e.target.value)}
                placeholder="مثال: 'احجز استشارتك المجانية عبر رسائل الصفحة' أو 'كلمنا فوراً على واتساب'"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الكلمات والعبارات المحظورة (الخطوط الحمراء) *
              </label>
              <input
                type="text"
                value={formData.forbiddenWords}
                onChange={(e) => updateField('forbiddenWords', e.target.value)}
                placeholder="مثال: 'أرخص سعر'، 'الوحيدون في مصر'، 'علاج سحري'، وعود وهمية أو أسعار غير مثبتة"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-rose-300 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                تعليمات وتوجيهات خاصة إضافية *
              </label>
              <textarea
                rows={2}
                value={formData.specialInstructions}
                onChange={(e) => updateField('specialInstructions', e.target.value)}
                placeholder="أي تعليمات محددة تخص المناسبات الدينية أو الأعياد أو العروض الحصرية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Visual Identity & Design Rules */}
      {activeTab === 'visual' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">5. الهوية البصرية والألوان (Visual Identity & Colors)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديد ألوان الهوية وأكواد الـ HEX ونمط التصميم المعتمد لجميع التصميمات الجرافيكية الـ 80 وبرومبتات الصور
              </p>
            </div>
          </div>

          {/* Logo Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">شعار الشركة (Company Logo)</h4>
                <p className="text-[11px] text-slate-400">
                  صيغة PNG شفافة أو SVG أو JPG بدقة عالية لاستخدامه كمرجع بصري
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                تحميل صورة الشعار
              </button>
              {formData.logoUrl && (
                <button
                  onClick={() => updateField('logoUrl', '')}
                  className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"
                  title="إزالة الشعار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Color Palette Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              باليتة الألوان المعتمدة (Color Palette with HEX Codes) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Primary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">اللون الأساسي (Primary)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#0A4D68'}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Secondary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">اللون الثانوي (Secondary)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor || '#088395'}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Accent */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">لون التمييز (Accent)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor || '#D4AF37'}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Background */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">لون الخلفية (Background)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor || '#F5F5F7'}
                    onChange={(e) => updateField('backgroundColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => updateField('backgroundColor', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                التوجه والنمط الفني العام للتصميمات (Visual Identity & Art Direction) *
              </label>
              <textarea
                rows={2}
                value={formData.visualIdentity}
                onChange={(e) => updateField('visualIdentity', e.target.value)}
                placeholder="مثال: نمط مينيمال معاصر فائق النظافة، إضاءة سينمائية ناعمة، مساحات سلبية واسعة، خلفيات رخامية مريحة للعين..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الخطوط المعتمدة (Typography) *
              </label>
              <input
                type="text"
                value={formData.typography}
                onChange={(e) => updateField('typography', e.target.value)}
                placeholder="مثال: Cairo (للعناوين والنصوص العربية), Montserrat (للأرقام والإنجليزية)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                تعليمات موضع الشعار والأمان البصري (Logo Placement & Safe Zones) *
              </label>
              <input
                type="text"
                value={formData.logoInstructions}
                onChange={(e) => updateField('logoInstructions', e.target.value)}
                placeholder="مثال: الزاوية العلوية اليمنى مع ترك هامش أمان 10% بدون أي عناصر متداخلة"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Custom User-Defined Fields */}
      {activeTab === 'custom_fields' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">أقسام وحقول مخصصة (Custom Fields & Notes)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أضف أي معلومات أو تراخيص أو شهادات أو بنود خاصة بنشاطك التجاري غير متوفرة في الحقول الافتراضية
              </p>
            </div>
            <button
              onClick={() => setIsAddingCustomField(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حقل جديد</span>
            </button>
          </div>

          {/* New Custom Field Form */}
          {isAddingCustomField && (
            <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">إضافة حقل مخصص جديد لملف العميل</span>
                <button onClick={() => setIsAddingCustomField(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">القسم التابع له</label>
                  <input
                    type="text"
                    value={newFieldSection}
                    onChange={(e) => setNewFieldSection(e.target.value)}
                    placeholder="مثال: التراخيص والاعتمادات"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">اسم الحقل / البند</label>
                  <input
                    type="text"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="مثال: ترخيص وزارة الصحة"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">القيمة / المحتوى</label>
                  <input
                    type="text"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    placeholder="مثال: ترخيص رقم 12345 لسنة 2024"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsAddingCustomField(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddCustomField}
                  disabled={!newFieldLabel.trim() || !newFieldValue.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                >
                  إضافة وحفظ
                </button>
              </div>
            </div>
          )}

          {/* List of Custom Fields */}
          {(formData.customFields || []).length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لم تتم إضافة أي حقول مخصصة بعد. يمكنك الضغط على "إضافة حقل جديد" لإدراج أي بيانات إضافية تهم عملك.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(formData.customFields || []).map((field) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-indigo-400 px-1.5 py-0.2 rounded bg-indigo-950/60 border border-indigo-500/20">
                      {field.section}
                    </span>
                    <h4 className="text-xs font-bold text-white">{field.label}</h4>
                    <p className="text-xs text-slate-300">{field.value}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomField(field.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="حذف الحقل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        projectId={projectId}
        currentProfile={formData}
        onRestoreVersion={(restored) => {
          setFormData(restored);
          onChangeClient(restored);
          setSavedSnapshot(restored);
          showToast('تمت استعادة الإصدار المحدد بنجاح!');
        }}
      />

      {/* Smart Update Reconciliation Modal */}
      <SmartUpdateReconciliationModal
        isOpen={isReconciliationOpen}
        onClose={() => setIsReconciliationOpen(false)}
        currentProfile={formData}
        previousProfile={savedSnapshot}
        projectId={projectId}
        calendarRows={calendarRows}
        onUpdateCompleted={(updated) => {
          if (onCalendarUpdated) {
            onCalendarUpdated(updated);
          }
          showToast('تم إتمام التحديث الشامل لكافة المحتويات والتصميمات بنجاح!');
        }}
      />
    </div>
  );
};
