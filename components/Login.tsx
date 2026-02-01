
import React, { useState } from 'react';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { User, AppSettings } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  settings: AppSettings;
}

const Login: React.FC<LoginProps> = ({ onLogin, settings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin({ username: 'مدير النظام', role: 'admin' });
    } else if (username === 'staff' && password === 'staff123') {
      onLogin({ username: 'موظف الأرشفة', role: 'staff' });
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 md:p-14 border border-slate-100">
          <div className="text-center mb-12">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] mb-6 shadow-xl shadow-primary/10"
              style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
            >
              <ShieldCheck size={48} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{settings.systemName}</h1>
            <p className="text-slate-500 mt-3 font-medium text-sm">بوابة الدخول الرسمية للموظفين</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">اسم المستخدم</label>
              <div className="relative">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all text-slate-800"
                  style={{ '--tw-ring-color': settings.primaryColor } as any}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all text-slate-800"
                  style={{ '--tw-ring-color': settings.primaryColor } as any}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-rose-600 text-xs font-bold text-center bg-rose-50 py-3 rounded-xl border border-rose-100">{error}</p>}

            <button
              type="submit"
              className="w-full py-5 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-[0.98] hover:brightness-110"
              style={{ backgroundColor: settings.primaryColor }}
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            جميع العمليات مسجلة للأغراض الرقابية
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
