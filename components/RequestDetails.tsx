
import React from 'react';
import { 
  ArrowRight, 
  Printer, 
  FileText, 
  Table, 
  FileCheck, 
  Calendar, 
  User, 
  MapPin, 
  StickyNote,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import { RequestEntry, AppSettings } from '../types';

interface RequestDetailsProps {
  request: RequestEntry;
  onBack: () => void;
  settings: AppSettings;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onBack, settings }) => {

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['المعرف', 'اسم صاحب الطلب', 'الجهة الموجه إليها', 'الموضوع', 'التاريخ', 'ملاحظات', 'النص المستخرج'];
    const data = [
      request.id,
      request.applicantName,
      request.recipient,
      request.subject,
      request.date,
      request.notes,
      request.ocrText.replace(/\n/g, ' ')
    ];
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      headers.join(",") + "\n" + 
      data.map(field => `"${field}"`).join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `طلب_${request.applicantName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWord = () => {
    const content = `
      ${settings.systemName}
      ------------------------------------------
      بيانات الطلب:
      اسم صاحب الطلب: ${request.applicantName}
      الجهة الموجه إليها: ${request.recipient}
      الموضوع: ${request.subject}
      التاريخ: ${request.date}
      ملاحظات: ${request.notes}
      
      النص المستخرج (OCR):
      ${request.ocrText}
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `طلب_${request.applicantName}.doc`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold"
        >
          <ArrowRight size={20} />
          العودة للأرشيف
        </button>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all"
          >
            <Printer size={18} />
            طباعة (A4)
          </button>
          
          <button 
            onClick={handleExportWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
          >
            <FileText size={18} />
            حفظ Word
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all"
          >
            <Download size={18} />
            حفظ PDF
          </button>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Table size={18} />
            تصدير Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-24 h-24 border-4 rounded-full flex items-center justify-center -rotate-12 opacity-50 select-none" style={{ borderColor: `${settings.primaryColor}30` }}>
              <span className="font-black text-center text-[10px] uppercase" style={{ color: `${settings.primaryColor}40` }}>الأرشفة الرسمية<br/>{settings.systemName}</span>
            </div>

            <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                  <FileCheck size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800">{request.applicantName}</h1>
                  <p className="text-slate-500 font-medium">طلب مؤرشف برقم: #{request.id}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-400">تاريخ الأرشفة</p>
                <p className="font-bold text-slate-700">{new Date(request.createdAt).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={20}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">الجهة الموجه إليها</p>
                    <p className="font-bold text-slate-700">{request.recipient}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><StickyNote size={20}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">موضوع الطلب</p>
                    <p className="font-bold text-slate-700 leading-relaxed">{request.subject}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Calendar size={20}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">تاريخ الطلب</p>
                    <p className="font-bold text-slate-700">{request.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><User size={20}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">ملاحظات المكتب</p>
                    <p className="font-bold text-slate-700">{request.notes || "لا توجد ملاحظات"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText size={20} style={{ color: settings.primaryColor }} />
                النص المستخرج (OCR)
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {request.ocrText}
                </p>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">
              <div className="text-center w-48">
                <p className="text-sm font-bold text-slate-800 mb-8">ختم الصادر</p>
                <div className="w-32 h-32 mx-auto border-2 border-slate-200 border-dashed rounded-full"></div>
              </div>
              <div className="text-center w-48">
                <p className="text-sm font-bold text-slate-800 mb-10">توقيع المسؤول المختص</p>
                <p className="border-t border-slate-300 pt-2 text-xs text-slate-400">حرر في: {request.date}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6 no-print">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ImageIcon size={20} style={{ color: settings.primaryColor }} />
              صورة المستند الأصلية
            </h3>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-inner group relative">
              <img 
                src={request.imageUri} 
                alt="Document" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in">
                <button 
                  onClick={() => window.open(request.imageUri)}
                  className="bg-white text-slate-800 px-4 py-2 rounded-xl font-bold text-sm shadow-xl"
                >
                  فتح الصورة بحجم كامل
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 text-center">تم الحفظ بجودة عالية للاستخدام القانوني</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
