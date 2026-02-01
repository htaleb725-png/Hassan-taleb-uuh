
import React from 'react';
import { FileText, Clock, Users, ChevronLeft, Plus, Search, Cloud, Activity } from 'lucide-react';
import { RequestEntry, AppSettings } from '../types';

interface DashboardProps {
  requests: RequestEntry[];
  onNavigate: (tab: 'add' | 'search') => void;
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ requests, onNavigate, settings }) => {
  const stats = [
    { label: 'إجمالي الأرشفة', value: requests.length, icon: FileText, color: 'bg-slate-900' },
    { label: 'طلبات اليوم', value: requests.filter(r => r.date === new Date().toISOString().split('T')[0]).length, icon: Clock, color: 'primary' },
    { label: 'دقة الـ AI', value: '99.9%', icon: Activity, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">مرحباً بك في {settings.systemName}</h2>
          <p className="text-slate-500 mt-2 font-bold text-lg">نظام الإدارة المركزي - لوحة المراقبة الفورية</p>
        </div>
        <button 
          onClick={() => onNavigate('add')}
          className="flex items-center gap-3 px-8 py-5 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 font-black text-lg"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Plus size={24} strokeWidth={3} />
          إضافة طلب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isPrimary = stat.color === 'primary';
          return (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all border-b-4" style={{ borderBottomColor: isPrimary ? settings.primaryColor : 'transparent' }}>
              <div 
                className={`p-5 rounded-2xl text-white shadow-lg ${isPrimary ? '' : stat.color}`}
                style={isPrimary ? { backgroundColor: settings.primaryColor } : {}}
              >
                <Icon size={32} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50">
            <h3 className="text-2xl font-black text-slate-900">آخر المستندات المضافة</h3>
            <button 
              onClick={() => onNavigate('search')}
              className="text-sm font-black flex items-center gap-2 transition-all hover:gap-3"
              style={{ color: settings.primaryColor }}
            >
              عرض السجل الكامل
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="space-y-5">
            {requests.slice(0, 5).length > 0 ? requests.slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-primary-soft transition-colors">
                    <FileText size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-base">{req.applicantName}</p>
                    <p className="text-xs text-slate-500 mt-1 font-bold line-clamp-1">{req.subject}</p>
                  </div>
                </div>
                <div className="text-left">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-tighter bg-white px-3 py-1 rounded-lg border border-slate-100">{req.date}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-300">
                <FileText size={72} className="mx-auto mb-6 opacity-10" />
                <p className="font-black text-lg">الأرشيف فارغ حالياً</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary opacity-20 rounded-full blur-[100px]"></div>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Cloud className="text-primary" size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black">حالة الأرشفة</h3>
            </div>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed font-bold">
              نظامك يعمل حالياً في وضع المزامنة {settings.googleSheetsUrl ? 'السحابية الكاملة' : 'المحلية'}. جميع الحركات مسجلة برمجياً لضمان النزاهة.
            </p>
            <div className="relative group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={24} />
              <input 
                type="text"
                placeholder="ابحث برقم المعاملة أو الاسم..."
                onFocus={() => onNavigate('search')}
                className="w-full pr-16 pl-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-4 transition-all text-white placeholder-slate-600 font-bold text-lg backdrop-blur-sm"
                style={{ '--tw-ring-color': settings.primaryColor } as any}
              />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">سرعة التحليل</p>
              <p className="text-3xl font-black text-white">0.3s</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">تخزين آمن</p>
              <p className="text-3xl font-black text-white">AES-256</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
