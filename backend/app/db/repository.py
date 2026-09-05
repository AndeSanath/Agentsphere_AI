import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any

from app.models.search import SearchRecord, SearchStatus, ICPCriteria, TaskPlanItem
from app.models.organization import (
    Organization, ValidationStatus, ConfidenceLevel, ContactVerification,
    DataSource, MatchCriteriaResult, DecisionMaker, ContactInfo, FieldVerification
)
from app.models.agent import AgentInfo, AgentStatus
from app.models.memory import SharedMemoryFact, HumanReviewItem

class Repository:
    def __init__(self):
        self.searches: Dict[str, SearchRecord] = {}
        self.organizations: Dict[str, Organization] = {}
        self.agents: Dict[str, AgentInfo] = {}
        self.shared_memory: List[SharedMemoryFact] = []
        self.human_reviews: Dict[str, HumanReviewItem] = {}
        
        self._init_default_agents()
        self._seed_demo_data()

    def _init_default_agents(self):
        default_agents = [
            AgentInfo(
                id="agent_planner",
                name="Planner Agent",
                code="PLANNER",
                purpose="Parses natural language requirements into structured ICP criteria and task execution DAGs.",
                status=AgentStatus.IDLE,
                model="gpt-4o-mini",
                tools=["NL-Parser", "ICP-Decomposer", "DAG-Scheduler"],
                last_execution="Just now",
                total_executions=142,
                success_rate=99.2,
                avg_latency_ms=450
            ),
            AgentInfo(
                id="agent_discovery",
                name="Company Discovery Agent",
                code="DISCOVERY",
                purpose="Scans permitted external databases, public directories, and authorized company APIs for candidate organizations.",
                status=AgentStatus.IDLE,
                model="gpt-4o",
                tools=["SearchAPI", "DirectoryScanner", "CompanyWebsiteFinder"],
                last_execution="Just now",
                total_executions=138,
                success_rate=98.5,
                avg_latency_ms=1200
            ),
            AgentInfo(
                id="agent_research",
                name="Company Research Agent",
                code="RESEARCH",
                purpose="Extracts company web metadata, products/services, employee counts, revenue, and public leadership disclosures.",
                status=AgentStatus.IDLE,
                model="gpt-4o",
                tools=["WebExtractor", "ProductScraper", "MetadataParser"],
                last_execution="Just now",
                total_executions=135,
                success_rate=97.8,
                avg_latency_ms=1800
            ),
            AgentInfo(
                id="agent_icp_matcher",
                name="ICP Matching Agent",
                code="ICP_MATCH",
                purpose="Evaluates company features against required target criteria and scores percentage match breakdown.",
                status=AgentStatus.IDLE,
                model="gpt-4o-mini",
                tools=["ICPEvaluator", "WeightingEngine", "RuleMatcher"],
                last_execution="Just now",
                total_executions=135,
                success_rate=99.5,
                avg_latency_ms=350
            ),
            AgentInfo(
                id="agent_validation",
                name="Validation Agent",
                code="VALIDATION",
                purpose="Cross-checks facts across multiple independent data sources, flags data conflicts, and assigns confidence levels.",
                status=AgentStatus.IDLE,
                model="gpt-4o",
                tools=["MultiSourceComparer", "ConflictDetector", "ConfidenceScorer"],
                last_execution="Just now",
                total_executions=130,
                success_rate=96.4,
                avg_latency_ms=900
            ),
            AgentInfo(
                id="agent_decision_maker",
                name="Decision-Maker Agent",
                code="DECISION_MAKER",
                purpose="Identifies key decision makers (CTO, VP Eng, CEO, VP Sales) from authorized executive directories.",
                status=AgentStatus.IDLE,
                model="gpt-4o",
                tools=["ExecutiveResolver", "RoleMatcher", "OrgChartParser"],
                last_execution="Just now",
                total_executions=128,
                success_rate=95.1,
                avg_latency_ms=1400
            ),
            AgentInfo(
                id="agent_contact_enricher",
                name="Contact Enrichment Agent",
                code="CONTACT_ENRICHMENT",
                purpose="Verifies and enriches available business email addresses, direct lines, and professional profiles.",
                status=AgentStatus.IDLE,
                model="gpt-4o-mini",
                tools=["EmailVerifier", "PhoneLookup", "ProfileLinker"],
                last_execution="Just now",
                total_executions=125,
                success_rate=94.0,
                avg_latency_ms=850
            ),
            AgentInfo(
                id="agent_summary",
                name="Summary & Action Agent",
                code="SUMMARY",
                purpose="Synthesizes findings into an executive prospect summary and recommends tailored next sales outreach actions.",
                status=AgentStatus.IDLE,
                model="gpt-4o",
                tools=["ExecutiveSummarizer", "SalesActionRecommender"],
                last_execution="Just now",
                total_executions=125,
                success_rate=99.0,
                avg_latency_ms=600
            )
        ]
        for ag in default_agents:
            self.agents[ag.id] = ag

    def _seed_demo_data(self):
        # Create initial seed search
        search_id = "search_hyderabad_saas_100"
        init_icp = ICPCriteria(
            industry="SaaS",
            location="Hyderabad",
            employee_range="100-500",
            target_role="CTO",
            business_type="Enterprise B2B",
            funding_stage="Series A / Bootstrapped",
            growth_signals="Hiring, Expansion",
            target_geography="Global / APAC",
            compliance_certifications="SOC2, ISO27001",
            target_department="Engineering & Technology"
        )
        
        task_plan = [
            TaskPlanItem(id=1, name="Discover Organizations", agent="Company Discovery Agent", description="Query public B2B directories in Hyderabad", status="completed", duration_ms=1120, output_summary="Found 5 candidate organizations"),
            TaskPlanItem(id=2, name="Research Organization Specs", agent="Company Research Agent", description="Extract web profiles, products & employee counts", status="completed", duration_ms=1650, output_summary="Processed 5 company websites & filings"),
            TaskPlanItem(id=3, name="ICP Criteria Match Scoring", agent="ICP Matching Agent", description="Score industry, location & employee filters", status="completed", duration_ms=340, output_summary="3 organizations achieved >90% ICP match"),
            TaskPlanItem(id=4, name="Multi-Source Data Validation", agent="Validation Agent", description="Cross-reference facts & check for title conflicts", status="completed", duration_ms=880, output_summary="1 conflict flagged for Human Review"),
            TaskPlanItem(id=5, name="Decision-Maker Identification", agent="Decision-Maker Agent", description="Identify target CTO / VP Engineering roles", status="completed", duration_ms=1320, output_summary="Identified 5 executive profiles"),
            TaskPlanItem(id=6, name="Contact Information Enrichment", agent="Contact Enrichment Agent", description="Enrich email addresses and phone lines", status="completed", duration_ms=790, output_summary="4 verified business emails enriched"),
            TaskPlanItem(id=7, name="Generate Prospect Summary", agent="Summary Agent", description="Synthesize executive briefing & sales recommendations", status="completed", duration_ms=580, output_summary="Generated 5 prospect summaries")
        ]

        search_rec = SearchRecord(
            id=search_id,
            query="Find SaaS companies in Hyderabad with 100-500 employees and identify CTOs.",
            icp=init_icp,
            status=SearchStatus.COMPLETED,
            tasks=task_plan,
            total_organizations_found=5,
            qualified_prospects_count=4,
            decision_makers_found=5,
            pending_reviews_count=1,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        self.searches[search_id] = search_rec

        # Seed Companies
        companies = [
            Organization(
                id="org_abc_tech",
                search_id=search_id,
                name="ABC Technologies",
                website="https://abctechnologies.demo.io",
                logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
                industry="SaaS",
                description="ABC Technologies builds AI-powered workforce intelligence and automated enterprise HR automation platforms.",
                products_services=["Workforce AI", "HR Workflow Automation", "Talent Intelligence"],
                location="Hyderabad, Telangana, India",
                city="Hyderabad",
                country="India",
                employee_count=250,
                employee_range="100-500",
                revenue_range="$15M - $25M",
                business_type="Enterprise B2B SaaS",
                target_market="Global Mid-Market & Enterprise",
                icp_match_score=100,
                icp_match_details=[
                    MatchCriteriaResult(criterion="Industry = SaaS", matched=True, details="Core product is B2B Cloud Software"),
                    MatchCriteriaResult(criterion="Location = Hyderabad", matched=True, details="Headquarters in HITEC City, Hyderabad"),
                    MatchCriteriaResult(criterion="Employees = 100-500", matched=True, details="Verified 250 active employees"),
                    MatchCriteriaResult(criterion="Target Role = CTO", matched=True, details="Active Chief Technology Officer present")
                ],
                validation_status=ValidationStatus.VERIFIED,
                confidence=ConfidenceLevel.HIGH,
                sources=[
                    DataSource(name="Company Website", url="https://abctechnologies.demo.io/about", last_checked="2026-08-08", is_demo=True),
                    DataSource(name="Authorized Data API", url="https://api.b2bdata.demo/orgs/abc", last_checked="2026-08-08", is_demo=True)
                ],
                decision_makers=[
                    DecisionMaker(
                        id="dm_rahul_kumar",
                        name="Rahul Kumar",
                        role="Chief Technology Officer (CTO)",
                        organization_id="org_abc_tech",
                        organization_name="ABC Technologies",
                        email="rahul.kumar@abctechnologies.demo.io",
                        email_status=ContactVerification.VERIFIED,
                        phone="+91 40 4918 2001",
                        phone_status=ContactVerification.VERIFIED,
                        linkedin_url="https://linkedin.demo/in/rahulkumar-cto",
                        source=DataSource(name="Company Website", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.HIGH
                    ),
                    DecisionMaker(
                        id="dm_priya_sharma",
                        name="Priya Sharma",
                        role="VP of Engineering",
                        organization_id="org_abc_tech",
                        organization_name="ABC Technologies",
                        email="priya.sharma@abctechnologies.demo.io",
                        email_status=ContactVerification.VERIFIED,
                        phone="+91 40 4918 2002",
                        phone_status=ContactVerification.UNVERIFIED,
                        linkedin_url="https://linkedin.demo/in/priyasharma-vpeng",
                        source=DataSource(name="Authorized Data API", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.HIGH
                    )
                ],
                contact_info=ContactInfo(
                    email="contact@abctechnologies.demo.io",
                    email_status=ContactVerification.VERIFIED,
                    phone="+91 40 4918 2000",
                    phone_status=ContactVerification.VERIFIED,
                    website="https://abctechnologies.demo.io",
                    address="Building 4, Mindspace IT Park, HITEC City, Hyderabad 500081"
                ),
                field_verifications=[
                    FieldVerification(field_name="Industry", value_source_a="SaaS", source_a_name="Company Website", value_source_b="SaaS", source_b_name="Data Provider", status=ValidationStatus.VERIFIED, final_value="SaaS"),
                    FieldVerification(field_name="Employee Count", value_source_a="250", source_a_name="Company Website", value_source_b="245", source_b_name="Data Provider", status=ValidationStatus.VERIFIED, final_value="250"),
                    FieldVerification(field_name="Headquarters", value_source_a="Hyderabad", source_a_name="Company Website", value_source_b="Hyderabad", source_b_name="Data Provider", status=ValidationStatus.VERIFIED, final_value="Hyderabad")
                ],
                summary="ABC Technologies is an established SaaS organization based in Hyderabad with approximately 250 employees. It matches 100% of your ICP criteria across industry, location, and company headcount. Key tech executive identified is CTO Rahul Kumar.",
                recommended_action="Initiate executive email outreach to CTO Rahul Kumar showcasing cloud integration software.",
                is_demo_data=True
            ),
            Organization(
                id="org_cyber_grid",
                search_id=search_id,
                name="CyberGrid Cloud Solutions",
                website="https://cybergrid.demo.io",
                logo_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=60",
                industry="SaaS",
                description="CyberGrid provides automated cloud security posture management and real-time vulnerability detection for Kubernetes.",
                products_services=["CloudGuard AI", "KubeShield", "DevSecOps Pipeline"],
                location="Hyderabad, Telangana, India",
                city="Hyderabad",
                country="India",
                employee_count=180,
                employee_range="100-500",
                revenue_range="$10M - $18M",
                business_type="B2B SaaS Security",
                target_market="FinTech & HealthTech Enterprises",
                icp_match_score=100,
                icp_match_details=[
                    MatchCriteriaResult(criterion="Industry = SaaS", matched=True, details="Cloud CyberSecurity SaaS"),
                    MatchCriteriaResult(criterion="Location = Hyderabad", matched=True, details="Financial District, Gachibowli, Hyderabad"),
                    MatchCriteriaResult(criterion="Employees = 100-500", matched=True, details="180 employees"),
                    MatchCriteriaResult(criterion="Target Role = CTO", matched=True, details="Conflicting CTO records flagged")
                ],
                validation_status=ValidationStatus.CONFLICTING,
                confidence=ConfidenceLevel.MEDIUM,
                sources=[
                    DataSource(name="Company Website", url="https://cybergrid.demo.io", last_checked="2026-08-08", is_demo=True),
                    DataSource(name="Search Service API", url="https://searchapi.demo/cybergrid", last_checked="2026-08-08", is_demo=True)
                ],
                decision_makers=[
                    DecisionMaker(
                        id="dm_vikram_aditya",
                        name="Vikram Aditya",
                        role="Co-Founder & CTO (Source A)",
                        organization_id="org_cyber_grid",
                        organization_name="CyberGrid Cloud Solutions",
                        email="vikram.a@cybergrid.demo.io",
                        email_status=ContactVerification.VERIFIED,
                        phone="+91 40 6820 1102",
                        phone_status=ContactVerification.UNVERIFIED,
                        linkedin_url="https://linkedin.demo/in/vikramaditya-cto",
                        source=DataSource(name="Company Website", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.MEDIUM,
                        is_conflicting=True,
                        conflict_details="Listed as CTO on Website, but External Directory lists Ananya Roy as Interim CTO."
                    ),
                    DecisionMaker(
                        id="dm_ananya_roy",
                        name="Ananya Roy",
                        role="Interim CTO / Head of Engineering (Source B)",
                        organization_id="org_cyber_grid",
                        organization_name="CyberGrid Cloud Solutions",
                        email="ananya.roy@cybergrid.demo.io",
                        email_status=ContactVerification.UNVERIFIED,
                        phone=None,
                        phone_status=ContactVerification.UNAVAILABLE,
                        linkedin_url="https://linkedin.demo/in/ananyaroy-tech",
                        source=DataSource(name="Search Service API", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.LOW,
                        is_conflicting=True,
                        conflict_details="External directory updated 2 weeks ago lists Ananya Roy as CTO."
                    )
                ],
                contact_info=ContactInfo(
                    email="info@cybergrid.demo.io",
                    email_status=ContactVerification.VERIFIED,
                    phone="+91 40 6820 1100",
                    phone_status=ContactVerification.VERIFIED,
                    website="https://cybergrid.demo.io",
                    address="Level 5, Cyber Towers, HITEC City, Hyderabad"
                ),
                field_verifications=[
                    FieldVerification(field_name="Industry", value_source_a="SaaS Security", source_a_name="Company Website", value_source_b="Cybersecurity SaaS", source_b_name="External Search", status=ValidationStatus.VERIFIED, final_value="SaaS Security"),
                    FieldVerification(field_name="CTO Title", value_source_a="Vikram Aditya", source_a_name="Company Website", value_source_b="Ananya Roy", source_b_name="External Search", status=ValidationStatus.CONFLICTING, final_value="Requires Human Review")
                ],
                summary="CyberGrid Cloud Solutions is a fast-growing 180-person Cloud Security SaaS provider in Gachibowli, Hyderabad. Matches ICP 100%. Data Validation flagged a title discrepancy between Vikram Aditya and Ananya Roy for the CTO position.",
                recommended_action="Resolve CTO title conflict in Human Review tab before dispatching personalized sequence.",
                is_demo_data=True
            ),
            Organization(
                id="org_nexus_data",
                search_id=search_id,
                name="Nexus Data Fabric",
                website="https://nexusdata.demo.io",
                logo_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60",
                industry="SaaS",
                description="Nexus Data Fabric provides enterprise real-time data streaming, ETL pipelines, and graph analytics infrastructure.",
                products_services=["Nexus Stream", "DataFabric OS", "GraphQL Engine"],
                location="Hyderabad, Telangana, India",
                city="Hyderabad",
                country="India",
                employee_count=320,
                employee_range="100-500",
                revenue_range="$20M - $35M",
                business_type="B2B Infrastructure SaaS",
                target_market="Data Engineers & CIOs",
                icp_match_score=95,
                icp_match_details=[
                    MatchCriteriaResult(criterion="Industry = SaaS", matched=True, details="Enterprise Infrastructure SaaS"),
                    MatchCriteriaResult(criterion="Location = Hyderabad", matched=True, details="Kavuri Hills, Madhapur, Hyderabad"),
                    MatchCriteriaResult(criterion="Employees = 100-500", matched=True, details="320 employees"),
                    MatchCriteriaResult(criterion="Target Role = CTO", matched=True, details="Found Chief Technology Officer profile")
                ],
                validation_status=ValidationStatus.VERIFIED,
                confidence=ConfidenceLevel.HIGH,
                sources=[
                    DataSource(name="Company Website", url="https://nexusdata.demo.io", last_checked="2026-08-08", is_demo=True),
                    DataSource(name="Authorized Data API", url="https://api.b2bdata.demo/nexus", last_checked="2026-08-08", is_demo=True)
                ],
                decision_makers=[
                    DecisionMaker(
                        id="dm_siddharth_v",
                        name="Siddharth Verma",
                        role="Chief Technology Officer",
                        organization_id="org_nexus_data",
                        organization_name="Nexus Data Fabric",
                        email="siddharth.v@nexusdata.demo.io",
                        email_status=ContactVerification.VERIFIED,
                        phone="+91 40 4012 8899",
                        phone_status=ContactVerification.VERIFIED,
                        linkedin_url="https://linkedin.demo/in/siddharthverma-cto",
                        source=DataSource(name="Authorized Data API", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.HIGH
                    )
                ],
                contact_info=ContactInfo(
                    email="connect@nexusdata.demo.io",
                    email_status=ContactVerification.VERIFIED,
                    phone="+91 40 4012 8800",
                    phone_status=ContactVerification.VERIFIED,
                    website="https://nexusdata.demo.io",
                    address="Nexus Tower, Kavuri Hills, Madhapur, Hyderabad"
                ),
                field_verifications=[
                    FieldVerification(field_name="Industry", value_source_a="Data Infrastructure SaaS", source_a_name="Website", value_source_b="Enterprise SaaS", source_b_name="API", status=ValidationStatus.VERIFIED, final_value="Data Infrastructure SaaS")
                ],
                summary="Nexus Data Fabric (320 employees, Madhapur Hyderabad) offers real-time enterprise data orchestration. High confidence match with verified CTO Siddharth Verma.",
                recommended_action="Schedule initial technical demo session with CTO Siddharth Verma.",
                is_demo_data=True
            ),
            Organization(
                id="org_zenith_health",
                search_id=search_id,
                name="Zenith Health Systems",
                website="https://zenithhealth.demo.io",
                logo_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=60",
                industry="Healthcare Tech",
                description="Zenith Health delivers hospital management software and telemedicine platforms across South Asia.",
                products_services=["Zenith EHR", "TeleHealth Connect", "PharmaERP"],
                location="Hyderabad, Telangana, India",
                city="Hyderabad",
                country="India",
                employee_count=450,
                employee_range="100-500",
                revenue_range="$30M - $50M",
                business_type="HealthTech B2B Software",
                target_market="Hospitals & Clinic Chains",
                icp_match_score=75,
                icp_match_details=[
                    MatchCriteriaResult(criterion="Industry = SaaS", matched=False, details="Healthcare Tech (Partial Match with SaaS)"),
                    MatchCriteriaResult(criterion="Location = Hyderabad", matched=True, details="Banjara Hills, Hyderabad"),
                    MatchCriteriaResult(criterion="Employees = 100-500", matched=True, details="450 employees"),
                    MatchCriteriaResult(criterion="Target Role = CTO", matched=True, details="Found Chief Information Officer")
                ],
                validation_status=ValidationStatus.PARTIALLY_VERIFIED,
                confidence=ConfidenceLevel.MEDIUM,
                sources=[
                    DataSource(name="Public Directory", url="https://directory.demo/zenith", last_checked="2026-08-08", is_demo=True)
                ],
                decision_makers=[
                    DecisionMaker(
                        id="dm_dr_ramesh",
                        name="Dr. Ramesh Rao",
                        role="Chief Information & Technology Officer",
                        organization_id="org_zenith_health",
                        organization_name="Zenith Health Systems",
                        email="ramesh.rao@zenithhealth.demo.io",
                        email_status=ContactVerification.UNVERIFIED,
                        phone="+91 40 2335 9011",
                        phone_status=ContactVerification.UNVERIFIED,
                        linkedin_url="https://linkedin.demo/in/drrameshrao-cio",
                        source=DataSource(name="Public Directory", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.MEDIUM
                    )
                ],
                contact_info=ContactInfo(
                    email="info@zenithhealth.demo.io",
                    email_status=ContactVerification.UNVERIFIED,
                    phone="+91 40 2335 9000",
                    phone_status=ContactVerification.VERIFIED,
                    website="https://zenithhealth.demo.io",
                    address="Road No 12, Banjara Hills, Hyderabad"
                ),
                field_verifications=[
                    FieldVerification(field_name="Industry", value_source_a="Healthcare Software", source_a_name="Public Directory", value_source_b="None", source_b_name="N/A", status=ValidationStatus.PARTIALLY_VERIFIED, final_value="Healthcare Tech")
                ],
                summary="Zenith Health Systems is a 450-person Healthcare Tech provider in Banjara Hills, Hyderabad. Achieved 75% ICP match (HealthTech vs pure SaaS).",
                recommended_action="Evaluate secondary pitch for healthcare-specific cloud solutions.",
                is_demo_data=True
            ),
            Organization(
                id="org_finpulse",
                search_id=search_id,
                name="FinPulse Core",
                website="https://finpulse.demo.io",
                logo_url="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=60",
                industry="FinTech",
                description="FinPulse builds API-first core banking and automated compliance engines for neo-banks.",
                products_services=["CoreBank API", "AML Check Engine", "UPI Gateway"],
                location="Hyderabad, Telangana, India",
                city="Hyderabad",
                country="India",
                employee_count=120,
                employee_range="100-500",
                revenue_range="$8M - $15M",
                business_type="B2B FinTech SaaS",
                target_market="Banks & NBFCs",
                icp_match_score=90,
                icp_match_details=[
                    MatchCriteriaResult(criterion="Industry = SaaS", matched=True, details="FinTech B2B SaaS"),
                    MatchCriteriaResult(criterion="Location = Hyderabad", matched=True, details="Kondapur, Hyderabad"),
                    MatchCriteriaResult(criterion="Employees = 100-500", matched=True, details="120 employees"),
                    MatchCriteriaResult(criterion="Target Role = CTO", matched=True, details="Found VP of Technology")
                ],
                validation_status=ValidationStatus.VERIFIED,
                confidence=ConfidenceLevel.HIGH,
                sources=[
                    DataSource(name="Company Website", url="https://finpulse.demo.io", last_checked="2026-08-08", is_demo=True),
                    DataSource(name="Authorized Data API", url="https://api.b2bdata.demo/finpulse", last_checked="2026-08-08", is_demo=True)
                ],
                decision_makers=[
                    DecisionMaker(
                        id="dm_neha_gupta",
                        name="Neha Gupta",
                        role="VP of Technology & Product",
                        organization_id="org_finpulse",
                        organization_name="FinPulse Core",
                        email="neha.gupta@finpulse.demo.io",
                        email_status=ContactVerification.VERIFIED,
                        phone="+91 40 4882 3344",
                        phone_status=ContactVerification.VERIFIED,
                        linkedin_url="https://linkedin.demo/in/nehagupta-tech",
                        source=DataSource(name="Company Website", last_checked="2026-08-08", is_demo=True),
                        confidence=ConfidenceLevel.HIGH
                    )
                ],
                contact_info=ContactInfo(
                    email="contact@finpulse.demo.io",
                    email_status=ContactVerification.VERIFIED,
                    phone="+91 40 4882 3300",
                    phone_status=ContactVerification.VERIFIED,
                    website="https://finpulse.demo.io",
                    address="Kondapur Main Road, Hyderabad"
                ),
                field_verifications=[
                    FieldVerification(field_name="Industry", value_source_a="FinTech SaaS", source_a_name="Company Website", value_source_b="FinTech SaaS", source_b_name="API", status=ValidationStatus.VERIFIED, final_value="FinTech SaaS")
                ],
                summary="FinPulse Core is a 120-person B2B FinTech SaaS provider in Kondapur, Hyderabad. 90% ICP match with verified VP of Technology Neha Gupta.",
                recommended_action="Send developer API integration proposal to Neha Gupta.",
                is_demo_data=True
            )
        ]

        for comp in companies:
            self.organizations[comp.id] = comp

        # Seed Human Review item
        review_item = HumanReviewItem(
            id="rev_cybergrid_cto",
            search_id=search_id,
            organization_id="org_cyber_grid",
            organization_name="CyberGrid Cloud Solutions",
            title="Decision Maker Title Conflict: CTO Role",
            description="Two conflicting entries were discovered for Chief Technology Officer at CyberGrid Cloud Solutions.",
            conflict_type="title_conflict",
            source_a_val="Vikram Aditya (Co-Founder & CTO)",
            source_a_label="Company Website (Updated Today)",
            source_b_val="Ananya Roy (Interim CTO)",
            source_b_label="External Search API (Updated 2 weeks ago)",
            status="pending",
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        self.human_reviews[review_item.id] = review_item

        # Seed Shared Memory Facts
        seed_facts = [
            SharedMemoryFact(id="mem_1", search_id=search_id, entity_type="ICP_Rule", entity_name="Search Criteria", fact_key="Required Industry", fact_value="SaaS", source_name="Planner Agent", confidence="High", agent_creator="Planner Agent", timestamp="10:00:01"),
            SharedMemoryFact(id="mem_2", search_id=search_id, entity_type="ICP_Rule", entity_name="Search Criteria", fact_key="Target City", fact_value="Hyderabad", source_name="Planner Agent", confidence="High", agent_creator="Planner Agent", timestamp="10:00:01"),
            SharedMemoryFact(id="mem_3", search_id=search_id, entity_type="Organization", entity_name="ABC Technologies", fact_key="Employee Count", fact_value="250 employees", source_name="Company Website & API", confidence="High", agent_creator="Company Research Agent", timestamp="10:00:03"),
            SharedMemoryFact(id="mem_4", search_id=search_id, entity_type="Organization", entity_name="CyberGrid Cloud Solutions", fact_key="CTO Conflict", fact_value="Vikram Aditya vs Ananya Roy", source_name="Multi-Source Validation Engine", confidence="Medium", agent_creator="Validation Agent", timestamp="10:00:05"),
            SharedMemoryFact(id="mem_5", search_id=search_id, entity_type="DecisionMaker", entity_name="Rahul Kumar", fact_key="Email Status", fact_value="rahul.kumar@abctechnologies.demo.io (VERIFIED)", source_name="Contact Enrichment Agent", confidence="High", agent_creator="Contact Enrichment Agent", timestamp="10:00:07")
        ]
        self.shared_memory.extend(seed_facts)

db = Repository()
