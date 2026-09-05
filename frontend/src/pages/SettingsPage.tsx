import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Key, Database, Sliders, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    openaiKey: '',
    apolloKey: '',
    hunterKey: '',
    dbUrl: 'sqlite:///./agentsphere.db',
    model: 'gemini-2.5-flash',
    autoApproveThreshold: '85'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Platform Settings & Key Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">System Settings</h1>
        <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
          Manage LLM parameters, external API integrations, database connections, and human approval threshold rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* LLM Model Configuration */}
        <div className="enterprise-card p-6 space-y-4">
          <h2 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0F766E]" />
            LLM Model Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-slate-400 mb-1">LLM / Gemini API Key</label>
              <input
                type="password"
                placeholder="LLM_API_KEY..."
                value={form.openaiKey}
                onChange={(e) => setForm({ ...form, openaiKey: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 text-xs focus:border-[#0F766E] outline-none font-mono"
              />
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 block">Configured via backend .env file</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-slate-400 mb-1">Default Model Architecture</label>
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 text-xs focus:border-[#0F766E] outline-none font-medium"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended for Real-Time Intelligence)</option>
                <option value="gpt-4o">GPT-4o (Multi-Agent Engine)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
