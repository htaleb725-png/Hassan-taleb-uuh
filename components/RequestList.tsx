
import React, { useState } from 'react';
import { Search, Eye, Calendar, User, FileText, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { RequestEntry, AppSettings } from '../types';

interface RequestListProps {
  requests: RequestEntry[];
  onView: (req: RequestEntry) => void;
  settings: AppSettings;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onView, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = requests.filter(r => 
    r.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.ocrText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">الأرشيف المركزي</h2>
          <p className="text-slate-500 font-medium mt-1">إدارة كافة المستندات والطلبات الصادرة والواردة</p>
        </div>
        
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="ابحث بالاسم، الموضوع، أو الجهة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-14 pl-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 transition-all shadow-sm font-bold text-slate-800"
            style={{ '--tw-ring-color': `${settings.primaryColor}15` } as any}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">صاحب الطلب</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">الجهة الموجه إليها</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">الموضوع</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">تاريخ الطلب</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border shadow-sm"
                        style={{ backgroundColor: `${settings.primaryColor}10`, color: settings.primaryColor, borderColor: `${settings.primaryColor}20` }}
                      >
                        {req.applicantName.charAt(0)}
                      </div>
                      <span className="font-black text-slate-800 text-sm tracking-tight">{req.applicantName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-black border border-slate-200 inline-block uppercase tracking-tighter">
                      {req.recipient}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-600 font-medium line-clamp-1 max-w-[240px] leading-relaxed">{req.subject}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <Calendar size={14} className="opacity-60" />
                      {req.date}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => onView(req)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-xs font-black border shadow-sm transition-all hover:text-white"
                      style={{ 
                        color: settings.primaryColor, 
                        borderColor: `${settings.primaryColor}30`,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings.primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <Eye size={16} />
                      التفاصيل
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-8 bg-slate-50 rounded-full shadow-inner">
                        <Search size={56} className="opacity-10" />
                      </div>
                      <p className="font-black text-lg">لا توجد نتائج بحث مطابقة</p>
                      <button onClick={() => setSearchTerm('')} className="text-xs font-bold underline" style={{ color: settings.primaryColor }}>إعادة تعيين البحث</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي المسجلات: {filtered.length} طلب</p>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
