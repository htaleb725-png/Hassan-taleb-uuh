
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PlusCircle, Search, LogOut, FileText, Menu, X, User as UserIcon, Settings as SettingsIcon 
} from 'lucide-react';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import AddRequest from './components/AddRequest.tsx';
import RequestList from './components/RequestList.tsx';
import RequestDetails from './components/RequestDetails.tsx';
import SettingsPage from './components/SettingsPage.tsx';
import { RequestEntry, User, AppSettings } from './types.ts';

const DEFAULT_SETTINGS: AppSettings = {
  googleSheetsUrl: '',
  primaryColor: '#10b981',
  systemName: 'نظام الأرشفة الوزارية',
  enableAutoFill: true
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'search' | 'details' | 'settings'>('dashboard');
  const [requests, setRequests] = useState<RequestEntry[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestEntry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const savedReqs = localStorage.getItem('ministerial_requests');
      if (savedReqs) setRequests(JSON.parse(savedReqs));
      
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("Error loading local storage data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    const hex = settings.primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    document.documentElement.style.setProperty('--primary-color-soft', `rgba(${r}, ${g}, ${b}, 0.1)`);
    document.documentElement.style.setProperty('--primary-color-border', `rgba(${r}, ${g}, ${b}, 0.2)`);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ministerial_requests', JSON.stringify(requests));
  }, [requests]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} settings={settings} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard requests={requests} onNavigate={setActiveTab} settings={settings} />;
      case 'add': return <AddRequest onSave={r => { setRequests([r, ...requests]); setActiveTab('search'); }} settings={settings} />;
      case 'search': return <RequestList requests={requests} onView={r => { setSelectedRequest(r); setActiveTab('details'); }} settings={settings} />;
      case 'details': return selectedRequest ? <RequestDetails request={selectedRequest} onBack={() => setActiveTab('search')} settings={settings} /> : <Dashboard requests={requests} onNavigate={setActiveTab} settings={settings} />;
      case 'settings': return <SettingsPage settings={settings} onUpdate={setSettings} />;
      default: return <Dashboard requests={requests} onNavigate={setActiveTab} settings={settings} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'add', label: 'إضافة طلب', icon: PlusCircle },
    { id: 'search', label: 'الأرشيف المركزي', icon: Search },
  ];
  if (user.role === 'admin') navItems.push({ id: 'settings', label: 'إعدادات المطور', icon: SettingsIcon });

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900">
      <style>{`
        :root { 
          --primary-color: ${settings.primaryColor}; 
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-primary-soft { background-color: var(--primary-color-soft); }
        .border-primary-soft { border-color: var(--primary-color-border); }
        .ring-primary:focus { --tw-ring-color: var(--primary-color); }
      `}</style>

      <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-black/30">
              <FileText className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-black text-lg leading-tight truncate w-44">{settings.systemName}</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">بوابة الأرشفة الذكية</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="border-t border-slate-800/50 pt-8 mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-2xl bg-slate-800/40 border border-slate-700/30">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-600">
                <UserIcon size={18} />
              </div>
              <div className="truncate">
                <p className="text-sm font-black text-white truncate">{user.username}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-4 px-5 py-3 text-slate-400 hover:text-rose-400 transition-colors font-bold text-sm"
            >
              <LogOut size={20} /> الخروج من النظام
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-10 relative">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-slate-900 text-white rounded-2xl shadow-2xl active:scale-95 transition-transform"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
