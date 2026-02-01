
import React, { useState } from 'react';
import { Save, Globe, Palette, Type, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetToDefault = () => {
    if(confirm("هل تريد استعادة الإعدادات الأصلية؟")) {
      const def = { googleSheetsUrl: '', primaryColor: '#10b981', systemName: 'نظام الأرشفة الوزارية', enableAutoFill: true };
      setLocalSettings(def);
      onUpdate(def);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إعدادات المطور والتحكم</h2>
          <p className="text-slate-500">هنا يمكنك تغيير ألوان النظام والربط مع جوجل شيت</p>
        </div>
        <button onClick={resetToDefault} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors">
          <RefreshCw size={14} />
          إعادة ضبط المصنع
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-4">
              <Globe size={20} className="text-blue-500" />
              ربط Google Sheets
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">رابط Web App (Deployment URL)</label>
              <input type="url" value={localSettings.googleSheetsUrl} onChange={e => setLocalSettings({...localSettings, googleSheetsUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-mono text-xs focus:ring-2 ring-blue-500 outline-none" placeholder="https://script.google.com/macros/s/..." />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-4">
              <Palette size={20} className="text-emerald-500" />
              الثيم والألوان
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">اللون الأساسي</label>
                <div className="flex gap-2">
                  <input type="color" value={localSettings.primaryColor} onChange={e => setLocalSettings({...localSettings, primaryColor: e.target.value})} className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent" />
                  <input type="text" value={localSettings.primaryColor} onChange={e => setLocalSettings({...localSettings, primaryColor: e.target.value})} className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">اسم النظام الرسمي</label>
                <input type="text" value={localSettings.systemName} onChange={e => setLocalSettings({...localSettings, systemName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          {isSaved && <span className="text-emerald-600 font-bold text-sm">تم الحفظ بنجاح!</span>}
          <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all">حفظ الإعدادات وتطبيقها فوراً</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
