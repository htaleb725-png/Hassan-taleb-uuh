
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PlusCircle, Search, LogOut, FileText, Menu, X, User as UserIcon, Settings as SettingsIcon 
} from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddRequest from './components/AddRequest';
import RequestList from './components/RequestList';
import RequestDetails from './components/RequestDetails';
import SettingsPage from './components/SettingsPage';
import { RequestEntry, User, AppSettings } from './types';

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
    const savedReqs = localStorage.getItem('ministerial_requests');
    if (savedReqs) setRequests(JSON.parse(savedReqs));
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Generate a semi-transparent version for subtle backgrounds
    const r = parseInt(settings.primaryColor.slice(1, 3), 16);
    const g = parseInt(settings.primaryColor.slice(3, 5), 16);
    const b = parseInt(settings.primaryColor.slice(5, 7), 16);
    document.documentElement.style.setProperty('--primary-color-soft', `rgba(${r}, ${g}, ${b}, 0.1)`);
    document.documentElement.style.setProperty('--primary-color-border', `rgba(${r}, ${g}, ${b}, 0.2)`);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ministerial_requests', JSON.stringify(requests));
  }, [requests]);

  if (!user) return <Login onLogin={u => setUser(u)} settings={settings} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard requests={requests} onNavigate={setActiveTab} settings={settings} />;
      case 'add': return <AddRequest onSave={r => { setRequests([r, ...requests]); setActiveTab('search'); }} settings={settings} />;
      case 'search': return <RequestList requests={requests} onView={r => { setSelectedRequest(r); setActiveTab('details'); }} settings={settings} />;
      case 'details': return selectedRequest ? <RequestDetails request={selectedRequest} onBack={() => setActiveTab('search')} settings={settings} /> : null;
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
    <div className="flex h-screen bg-[#fdfdfd] overflow-hidden text-slate-800">
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

      <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-slate-900 text-white transition-transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-black/20">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight truncate w-40">{settings.systemName}</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">المكتب الإعلامي</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="border-t border-slate-800/50 pt-8 mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-800/30">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                <UserIcon size={16} />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.username}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('auth_user');
                setUser(null);
              }} 
              className="w-full flex items-center gap-3 px-5 py-2.5 text-slate-400 hover:text-rose-400 transition-colors font-bold text-sm"
            >
              <LogOut size={18} /> الخروج من النظام
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-10 relative">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="lg:hidden absolute top-4 right-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
