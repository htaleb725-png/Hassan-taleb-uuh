
import React from 'react';
import { FileText, Clock, Users, ChevronLeft, Plus, Search, Cloud } from 'lucide-react';
import { RequestEntry, AppSettings } from '../types';

interface DashboardProps {
  requests: RequestEntry[];
  onNavigate: (tab: 'add' | 'search') => void;
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ requests, onNavigate, settings }) => {
  const stats = [
    { label: 'إجمالي الأرشفة', value: requests.length, icon: FileText, color: 'bg-slate-800' },
    { label: 'طلبات اليوم', value: requests.filter(r => r.date === new Date().toISOString().split('T')[0]).length, icon: Clock, color: 'primary' },
    { label: 'المستخدمين', value: '3', icon: Users, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">مرحباً بك في {settings.systemName}</h2>
          <p className="text-slate-500 mt-1 font-medium italic">نظام الأرشفة الذكي المعتمد - الإصدار الثالث</p>
        </div>
        <button 
          onClick={() => onNavigate('add')}
          className="flex items-center gap-2 px-8 py-4 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl font-black"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Plus size={20} strokeWidth={3} />
          إضافة طلب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isPrimary = stat.color === 'primary';
          return (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-900">آخر المستندات</h3>
            <button 
              onClick={() => onNavigate('search')}
              className="text-sm font-black flex items-center gap-1 transition-colors hover:brightness-75"
              style={{ color: settings.primaryColor }}
            >
              عرض الأرشيف الكامل
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {requests.slice(0, 5).length > 0 ? requests.slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-primary-soft">
                    <FileText size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{req.applicantName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.subject.length > 30 ? req.subject.substring(0, 30) + '...' : req.subject}</p>
                  </div>
                </div>
                <div className="text-left">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{req.date}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-16 text-slate-300">
                <FileText size={64} className="mx-auto mb-4 opacity-10" />
                <p className="font-bold">لا توجد طلبات مؤرشفة بعد</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="text-primary" size={24} />
              <h3 className="text-2xl font-black">حالة الأرشيف</h3>
            </div>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">
              نظامك يعمل حالياً في وضع المزامنة {settings.googleSheetsUrl ? 'السحابية الكاملة' : 'المحلية فقط'}. يمكنك تعديل رابط الربط من إعدادات المطور.
            </p>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="ابحث في الأرشيف..."
                onFocus={() => onNavigate('search')}
                className="w-full pr-12 pl-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 transition-all text-white placeholder-slate-600 font-bold"
                style={{ '--tw-ring-color': settings.primaryColor } as any}
              />
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="p-5 rounded-[1.5rem] bg-slate-800/50 border border-slate-700/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">دقة التحليل AI</p>
              <p className="text-2xl font-black text-white">99.9%</p>
            </div>
            <div className="p-5 rounded-[1.5rem] bg-slate-800/50 border border-slate-700/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">سرعة المعالجة</p>
              <p className="text-2xl font-black text-white">0.4s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
