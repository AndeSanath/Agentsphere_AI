import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, Moon, Sun, ChevronDown, Building } from 'lucide-react';

interface NavbarProps {
  isDemoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isDemoMode = false }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#334155] px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Search Launcher */}
      <div className="flex items-center gap-4 w-1/3">
        <div
          onClick={() => navigate('/icp')}
          className="w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 text-xs cursor-pointer hover:border-[#0F766E] transition"
        >
          <Search className="w-3.5 h-3.5 text-[#0F766E]" />
          <span className="truncate">Search companies by industry, location or headcount...</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Workspace Selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-xs text-[#0F172A] dark:text-slate-200 font-semibold cursor-pointer">
          <Building className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Enterprise Org</span>
          <ChevronDown className="w-3 h-3 text-[#64748B]" />
        </div>

        {/* Live / Demo Mode Indicator */}
        {!isDemoMode ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] dark:bg-[#134E4A] text-[#16A34A] dark:text-[#5EEAD4] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LIVE API</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-semibold">
            <span>DEMO DATA</span>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Enterprise Theme" : "Switch to Dark Theme"}
          className="p-2 rounded-lg text-[#64748B] dark:text-slate-300 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-[#64748B] dark:text-slate-300 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0] dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
            SE
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Sales Executive</div>
            <div className="text-[10px] text-[#64748B] dark:text-slate-400">Enterprise Team</div>
          </div>
        </div>
      </div>
    </header>
  );
};
