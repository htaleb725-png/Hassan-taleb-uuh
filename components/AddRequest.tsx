
import React, { useState, useRef } from 'react';
import { Upload, Loader2, Sparkles, Save, FileImage, Trash2, CloudSync, Wand2 } from 'lucide-react';
import { performSmartOCR } from '../services/gemini';
import { RequestEntry, AppSettings } from '../types';

interface AddRequestProps {
  onSave: (req: RequestEntry) => void;
  settings: AppSettings;
}

const AddRequest: React.FC<AddRequestProps> = ({ onSave, settings }) => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    recipient: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ocrText: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSmartOCR = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await performSmartOCR(image);
      setFormData({
        applicantName: result.applicantName || '',
        recipient: result.recipient || '',
        subject: result.subject || '',
        date: result.date || new Date().toISOString().split('T')[0],
        ocrText: result.fullText || '',
        notes: formData.notes
      });
    } catch (err) {
      alert("خطأ في التحليل الذكي للمستند.");
    } finally {
      setLoading(false);
    }
  };

  const syncToCloud = async (data: RequestEntry) => {
    if (!settings.googleSheetsUrl) return;
    setSyncing(true);
    try {
      await fetch(settings.googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("يرجى رفع صورة المستند");
    const newEntry: RequestEntry = {
      id: Date.now().toString(),
      ...formData,
      imageUri: image,
      createdAt: new Date().toISOString()
    };
    await syncToCloud(newEntry);
    onSave(newEntry);
    alert("تم أرشفة المستند بنجاح");
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">إضافة طلب جديد</h2>
          <p className="text-slate-500 font-medium">قم برفع المستند وسيقوم الـ AI بملء البيانات تلقائياً</p>
        </div>
        <div 
          className="text-[10px] font-black px-4 py-2 rounded-full border shadow-sm uppercase tracking-widest"
          style={{ backgroundColor: `${settings.primaryColor}10`, color: settings.primaryColor, borderColor: `${settings.primaryColor}30` }}
        >
          {settings.googleSheetsUrl ? 'Live Sync Enabled' : 'Offline Mode'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-10">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="aspect-[3/4] border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-primary-soft hover:bg-slate-50/50 transition-all group"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-primary-soft group-hover:text-primary transition-all shadow-inner">
                  <Upload size={40} />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-700">ارفع الصورة</p>
                  <p className="text-xs text-slate-400 mt-2 font-bold">PDF, JPG, PNG</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border-8 border-slate-50 shadow-inner group">
                  <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button 
                    type="button" 
                    onClick={() => setImage(null)} 
                    className="absolute top-4 left-4 p-3 bg-rose-500 text-white rounded-2xl shadow-xl hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={handleSmartOCR} 
                  disabled={loading} 
                  className="w-full flex items-center justify-center gap-3 py-5 text-white rounded-[1.5rem] font-black shadow-2xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={22} />}
                  استخراج البيانات آلياً
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-6">المعلومات المستخرجة</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">اسم مقدم الطلب</label>
              <input 
                type="text" 
                required 
                value={formData.applicantName} 
                onChange={e => setFormData({...formData, applicantName: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 outline-none transition-all font-bold text-slate-800" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
                placeholder="الاسم الثلاثي أو الرباعي"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">الجهة الموجه إليها</label>
              <input 
                type="text" 
                required 
                value={formData.recipient} 
                onChange={e => setFormData({...formData, recipient: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 outline-none transition-all font-bold text-slate-800" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
                placeholder="اسم الوزارة أو المديرية"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">موضوع الكتاب</label>
              <input 
                type="text" 
                required 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 outline-none transition-all font-bold text-slate-800" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">تاريخ الطلب</label>
              <input 
                type="date" 
                required 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 outline-none transition-all font-bold text-slate-800" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">ملاحظات إضافية</label>
              <input 
                type="text" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 outline-none transition-all font-bold text-slate-800" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
                placeholder="أية تفاصيل أخرى"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest mr-1">النص المستخرج (قراءة AI)</label>
              <textarea 
                rows={8} 
                value={formData.ocrText} 
                onChange={e => setFormData({...formData, ocrText: e.target.value})} 
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 outline-none transition-all font-mono text-sm leading-relaxed text-slate-900 shadow-inner" 
                style={{ '--tw-ring-color': `${settings.primaryColor}20` } as any}
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={syncing} 
              className="w-full py-5 text-white rounded-[1.5rem] font-black shadow-2xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {syncing ? <CloudSync className="animate-spin" size={24} /> : <Save size={24} />}
              {syncing ? "جاري المزامنة السحابية..." : "حفظ وأرشفة المستند نهائياً"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRequest;
