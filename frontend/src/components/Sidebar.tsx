import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Building2,
  Activity,
  UserCheck,
  BarChart3,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface SidebarProps {
  pendingReviewsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ pendingReviewsCount = 1 }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/icp', label: 'Ideal Customer Profiles', icon: Target },
    { to: '/prospects', label: 'Prospects', icon: Building2 },
    { to: '/activity', label: 'Research Activity', icon: Activity },
    { to: '/review', label: 'Human Review', icon: UserCheck, count: pendingReviewsCount },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between shrink-0 select-none min-h-screen transition-all duration-200 z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Branding Header */}
        <div className="p-5 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <h1 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 truncate">
                  AgentSphere AI
                </h1>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                  B2B Prospect Intelligence
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] dark:text-slate-400">
              Platform Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4]'
                      : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Accent Left Border */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0F766E] dark:bg-[#14B8A6] rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.count !== undefined && item.count > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800/80 border border-[#E2E8F0] dark:border-slate-700 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#64748B] dark:text-slate-400 font-medium text-[11px]">System Status</span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            <span className="text-[#16A34A] font-semibold text-[11px]">
              Live Engine Connected
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
