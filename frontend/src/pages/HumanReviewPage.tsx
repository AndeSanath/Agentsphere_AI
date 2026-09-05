import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, AlertTriangle, Check, X, Edit3, HelpCircle, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { HumanReviewItem } from '../types';

export const HumanReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<HumanReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setReviews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleAction = async (reviewId: string, action: string) => {
    try {
      await api.resolveReview(reviewId, action);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (e) {
      console.error(e);
    }
  };

  const dummyReviewItems = [
    {
      id: 'rev_101',
      organization_name: 'CyberGrid Cloud Solutions',
      title: 'Revenue Estimate Discrepancy',
      description: 'Conflict detected between website filings and third-party directories.',
      confidence: 45,
      detectedValues: ['$15M', '$20M', '$50M']
    },
    {
      id: 'rev_102',
      organization_name: 'ABC Technologies',
      title: 'Executive Title Conflict',
      description: 'Website lists Rahul Kumar as CTO, external directory lists Interim CTO.',
      confidence: 55,
      detectedValues: ['Chief Technology Officer', 'Interim CTO']
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Human-in-the-Loop Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
            Human Review Required ({dummyReviewItems.length})
          </h1>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
            Review low-confidence agent extractions and resolve multi-source data conflicts.
          </p>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
        {dummyReviewItems.map((item) => (
          <div key={item.id} className="enterprise-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider block">
                  {item.organization_name}
                </span>
                <h3 className="font-extrabold text-base text-[#0F172A] dark:text-slate-100 mt-0.5">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                  AI Confidence: {item.confidence}%
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* Detected Values Selection */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                Detected Conflict Values:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.detectedValues.map((val, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 font-mono text-[#0F172A] dark:text-slate-200 font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                onClick={() => handleAction(item.id, 'approved')}
                className="px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" /> Approve Most Likely Value
              </button>

              <button
                onClick={() => handleAction(item.id, 'edit')}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-[#F1F5F9] transition"
              >
                <Edit3 className="w-4 h-4 text-[#0F766E]" /> Edit Value
              </button>

              <button
                onClick={() => handleAction(item.id, 'uncertain')}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-[#F1F5F9] transition"
              >
                <HelpCircle className="w-4 h-4 text-[#D97706]" /> Mark Uncertain
              </button>

              <button
                onClick={() => handleAction(item.id, 'rejected')}
                className="px-4 py-2 rounded-lg bg-[#FEE2E2] hover:bg-red-200 text-[#DC2626] font-bold text-xs flex items-center gap-1.5 transition border border-[#FCA5A5]"
              >
                <X className="w-4 h-4" /> Reject Fact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
