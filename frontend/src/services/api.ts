import {
  SearchRecord, ICPCriteria, Organization, AgentInfo,
  SharedMemoryFact, HumanReviewItem, DashboardStats
} from '../types';

const API_BASE = '/api';

export const api = {
  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        total_searches: 12,
        organizations_found: 148,
        qualified_prospects: 84,
        decision_makers_found: 112,
        pending_reviews: 1,
        icp_match_rate: "94.2%",
        validation_confidence: "98.1%",
        prospect_quality: "High Grade",
        demo_mode: true
      };
    }
  },

  async planSearch(query?: string, icp?: ICPCriteria) {
    const res = await fetch(`${API_BASE}/planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, icp })
    });
    return res.json();
  },

  async startSearch(query?: string, icp?: ICPCriteria): Promise<SearchRecord> {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, icp })
    });
    return res.json();
  },

  async getSearches(): Promise<SearchRecord[]> {
    const res = await fetch(`${API_BASE}/searches`);
    return res.json();
  },

  async getSearch(id: string): Promise<SearchRecord> {
    const res = await fetch(`${API_BASE}/search/${id}`);
    return res.json();
  },

  async deleteSearch(id: string) {
    const res = await fetch(`${API_BASE}/searches/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async clearAllSearches() {
    const res = await fetch(`${API_BASE}/searches`, { method: 'DELETE' });
    return res.json();
  },

  async getProspects(filters?: {
    search_id?: string;
    industry?: string;
    location?: string;
    min_icp_score?: number;
    validation_status?: string;
    confidence?: string;
    sort_by?: string;
  }): Promise<Organization[]> {
    const queryParams = new URLSearchParams();
    if (filters?.search_id) queryParams.append('search_id', filters.search_id);
    if (filters?.industry) queryParams.append('industry', filters.industry);
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.min_icp_score) queryParams.append('min_icp_score', filters.min_icp_score.toString());
    if (filters?.validation_status) queryParams.append('validation_status', filters.validation_status);
    if (filters?.confidence) queryParams.append('confidence', filters.confidence);
    if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);

    const res = await fetch(`${API_BASE}/prospects?${queryParams.toString()}`);
    return res.json();
  },

  async getOrganization(id: string): Promise<Organization> {
    const res = await fetch(`${API_BASE}/prospects/${id}`);
    return res.json();
  },

  async getReviews(status?: string): Promise<HumanReviewItem[]> {
    const url = status ? `${API_BASE}/reviews?status=${status}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    return res.json();
  },

  async resolveReview(review_id: string, action: string, selected_option?: string) {
    const res = await fetch(`${API_BASE}/reviews/${review_id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, selected_option })
    });
    return res.json();
  },

  async getAgents(): Promise<AgentInfo[]> {
    const res = await fetch(`${API_BASE}/agents`);
    return res.json();
  },

  async updateAgent(agent_id: string, enabled?: boolean, model?: string) {
    const res = await fetch(`${API_BASE}/agents/${agent_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, model })
    });
    return res.json();
  },

  async getMemory(search_id?: string): Promise<SharedMemoryFact[]> {
    const url = search_id ? `${API_BASE}/memory/${search_id}` : `${API_BASE}/memory`;
    const res = await fetch(url);
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  }
};
