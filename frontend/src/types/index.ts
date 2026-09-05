export type SearchStatus =
  | 'idle'
  | 'planning'
  | 'discovering'
  | 'researching'
  | 'matching'
  | 'validating'
  | 'identifying_decision_makers'
  | 'enriching_contacts'
  | 'needs_human_review'
  | 'completed'
  | 'failed';

export interface ICPCriteria {
  industry?: string;
  location?: string;
  employee_range?: string;
  target_role?: string;
  technology?: string;
  revenue_range?: string;
  business_type?: string;
  funding_stage?: string;
  growth_signals?: string;
  target_geography?: string;
  compliance_certifications?: string;
  target_department?: string;
  other_requirements?: string;
}

export interface TaskPlanItem {
  id: number;
  name: string;
  agent: string;
  description: string;
  status: 'waiting' | 'running' | 'completed' | 'failed' | 'needs_review';
  duration_ms?: number;
  output_summary?: string;
}

export interface SearchRecord {
  id: string;
  query: string;
  icp: ICPCriteria;
  status: SearchStatus;
  tasks: TaskPlanItem[];
  total_organizations_found: number;
  qualified_prospects_count: number;
  decision_makers_found: number;
  pending_reviews_count: number;
  created_at: string;
  updated_at: string;
}

export type ValidationStatus = 'Verified' | 'Partially Verified' | 'Conflicting' | 'Insufficient Data';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type ContactVerification = 'Verified' | 'Unverified' | 'Unavailable';

export interface DataSource {
  name: string;
  url?: string;
  last_checked: string;
  is_demo: boolean;
}

export interface MatchCriteriaResult {
  criterion: string;
  matched: boolean;
  details: string;
}

export interface DecisionMaker {
  id: string;
  name: string;
  role: string;
  organization_id: string;
  organization_name: string;
  email?: string;
  email_status: ContactVerification;
  phone?: string;
  phone_status: ContactVerification;
  linkedin_url?: string;
  source: DataSource;
  confidence: ConfidenceLevel;
  is_conflicting?: boolean;
  conflict_details?: string;
}

export interface ContactInfo {
  email?: string;
  email_status: ContactVerification;
  phone?: string;
  phone_status: ContactVerification;
  website?: string;
  address?: string;
}

export interface FieldVerification {
  field_name: string;
  value_source_a: string;
  source_a_name: string;
  value_source_b?: string;
  source_b_name?: string;
  status: ValidationStatus;
  final_value: string;
}

export interface Organization {
  id: string;
  search_id: string;
  name: string;
  website: string;
  logo_url?: string;
  industry: string;
  description: string;
  products_services: string[];
  location: string;
  city: string;
  country: string;
  employee_count: number;
  employee_range: string;
  revenue_range?: string;
  business_type: string;
  target_market: string;
  icp_match_score: number;
  icp_match_details: MatchCriteriaResult[];
  validation_status: ValidationStatus;
  confidence: ConfidenceLevel;
  sources: DataSource[];
  decision_makers: DecisionMaker[];
  contact_info: ContactInfo;
  field_verifications: FieldVerification[];
  summary: string;
  recommended_action: string;
  is_demo_data: boolean;
}

export type AgentStatus = 'Idle' | 'Active' | 'Waiting' | 'Disabled' | 'Needs Review';

export interface AgentInfo {
  id: string;
  name: string;
  code: string;
  purpose: string;
  status: AgentStatus;
  model: string;
  tools: string[];
  last_execution: string;
  total_executions: number;
  success_rate: number;
  avg_latency_ms: number;
  enabled: boolean;
}

export interface SharedMemoryFact {
  id: string;
  search_id: string;
  entity_type: string;
  entity_name: string;
  fact_key: string;
  fact_value: string;
  source_name: string;
  confidence: string;
  agent_creator: string;
  timestamp: string;
}

export interface HumanReviewItem {
  id: string;
  search_id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  description: string;
  conflict_type: string;
  source_a_val: string;
  source_a_label: string;
  source_b_val: string;
  source_b_label: string;
  status: 'pending' | 'approved' | 'rejected' | 'uncertain' | 'resolved';
  selected_option?: string;
  created_at: string;
}

export interface DashboardStats {
  total_searches: number;
  organizations_found: number;
  qualified_prospects: number;
  decision_makers_found: number;
  pending_reviews: number;
  icp_match_rate: string;
  validation_confidence: string;
  prospect_quality: string;
  demo_mode: boolean;
}
