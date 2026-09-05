import re
from typing import Dict, Any, Tuple, List
from app.models.search import ICPCriteria, TaskPlanItem
from app.models.memory import SharedMemoryFact

class PlannerAgent:
    def __init__(self):
        self.name = "Planner Agent"
        self.code = "PLANNER"

    def plan(self, query: str, provided_icp: ICPCriteria = None) -> Tuple[ICPCriteria, List[TaskPlanItem], List[SharedMemoryFact]]:
        icp = provided_icp if provided_icp else ICPCriteria()

        if query:
            # Extract Industry
            if re.search(r'saas', query, re.IGNORECASE):
                icp.industry = "SaaS"
            elif re.search(r'fintech', query, re.IGNORECASE):
                icp.industry = "FinTech"
            elif re.search(r'health', query, re.IGNORECASE):
                icp.industry = "Healthcare Tech"

            # Extract Location
            if re.search(r'hyderabad', query, re.IGNORECASE):
                icp.location = "Hyderabad"
            elif re.search(r'bangalore|bengaluru', query, re.IGNORECASE):
                icp.location = "Bangalore"
            elif re.search(r'mumbai', query, re.IGNORECASE):
                icp.location = "Mumbai"

            # Extract Employee Range
            emp_match = re.search(r'(\d+-\d+)\s+employees', query, re.IGNORECASE)
            if emp_match:
                icp.employee_range = emp_match.group(1)

            # Extract Target Role
            if re.search(r'cto|chief technology officer', query, re.IGNORECASE):
                icp.target_role = "CTO"
            elif re.search(r'vp engineering|vp eng', query, re.IGNORECASE):
                icp.target_role = "VP Engineering"
            elif re.search(r'ceo', query, re.IGNORECASE):
                icp.target_role = "CEO"

            # Extract Funding Stage
            if re.search(r'series a', query, re.IGNORECASE):
                icp.funding_stage = "Series A"
            elif re.search(r'series b', query, re.IGNORECASE):
                icp.funding_stage = "Series B"
            elif re.search(r'seed', query, re.IGNORECASE):
                icp.funding_stage = "Seed"
            elif re.search(r'bootstrapped', query, re.IGNORECASE):
                icp.funding_stage = "Bootstrapped"

            # Extract Target Geography / Region
            if re.search(r'apac|asia', query, re.IGNORECASE):
                icp.target_geography = "APAC"
            elif re.search(r'emea|europe', query, re.IGNORECASE):
                icp.target_geography = "EMEA"
            elif re.search(r'north america|us|usa', query, re.IGNORECASE):
                icp.target_geography = "North America"

            # Extract Compliance Certifications
            if re.search(r'soc2|soc 2', query, re.IGNORECASE):
                icp.compliance_certifications = "SOC2"
            elif re.search(r'iso|iso27001', query, re.IGNORECASE):
                icp.compliance_certifications = "ISO 27001"
            elif re.search(r'hipaa', query, re.IGNORECASE):
                icp.compliance_certifications = "HIPAA"

            # Extract Target Department
            if re.search(r'engineering|tech', query, re.IGNORECASE):
                icp.target_department = "Engineering & Technology"
            elif re.search(r'sales|revenue', query, re.IGNORECASE):
                icp.target_department = "Sales & Revenue"
            elif re.search(r'security|cybersecurity', query, re.IGNORECASE):
                icp.target_department = "Cybersecurity"

        tasks = [
            TaskPlanItem(id=1, name="Discover Organizations", agent="Company Discovery Agent", description=f"Scan authorized business databases for {icp.industry} in {icp.location}", status="waiting"),
            TaskPlanItem(id=2, name="Research Organization Specs", agent="Company Research Agent", description="Extract company websites, products & employee sizes", status="waiting"),
            TaskPlanItem(id=3, name="ICP Criteria Match Scoring", agent="ICP Matching Agent", description=f"Evaluate compliance with ICP criteria ({icp.industry}, {icp.location}, {icp.employee_range}, {icp.funding_stage})", status="waiting"),
            TaskPlanItem(id=4, name="Multi-Source Data Validation", agent="Validation Agent", description="Cross-check website data vs APIs & detect conflicts", status="waiting"),
            TaskPlanItem(id=5, name="Decision-Maker Identification", agent="Decision-Maker Agent", description=f"Identify key decision makers for target role ({icp.target_role}) in {icp.target_department or 'Tech'}", status="waiting"),
            TaskPlanItem(id=6, name="Contact Information Enrichment", agent="Contact Enrichment Agent", description="Enrich verified business email & phone lines", status="waiting"),
            TaskPlanItem(id=7, name="Generate Prospect Summary", agent="Summary Agent", description="Synthesize executive intelligence briefing & next sales steps", status="waiting")
        ]

        facts = [
            SharedMemoryFact(
                id=f"fact_plan_ind_{icp.industry}",
                search_id="",
                entity_type="ICP_Rule",
                entity_name="Search Criteria",
                fact_key="Parsed Industry",
                fact_value=icp.industry or "General Tech",
                source_name="Planner Agent Parser",
                confidence="High",
                agent_creator="Planner Agent",
                timestamp="00:00:01"
            ),
            SharedMemoryFact(
                id=f"fact_plan_loc_{icp.location}",
                search_id="",
                entity_type="ICP_Rule",
                entity_name="Search Criteria",
                fact_key="Parsed Location",
                fact_value=icp.location or "Global",
                source_name="Planner Agent Parser",
                confidence="High",
                agent_creator="Planner Agent",
                timestamp="00:00:01"
            ),
            SharedMemoryFact(
                id=f"fact_plan_role_{icp.target_role}",
                search_id="",
                entity_type="ICP_Rule",
                entity_name="Search Criteria",
                fact_key="Target Executive Role",
                fact_value=icp.target_role or "CTO",
                source_name="Planner Agent Parser",
                confidence="High",
                agent_creator="Planner Agent",
                timestamp="00:00:01"
            ),
            SharedMemoryFact(
                id=f"fact_plan_funding_{icp.funding_stage}",
                search_id="",
                entity_type="ICP_Rule",
                entity_name="Search Criteria",
                fact_key="Target Funding Stage",
                fact_value=icp.funding_stage or "Series A / Bootstrapped",
                source_name="Planner Agent Parser",
                confidence="High",
                agent_creator="Planner Agent",
                timestamp="00:00:01"
            ),
            SharedMemoryFact(
                id=f"fact_plan_dept_{icp.target_department}",
                search_id="",
                entity_type="ICP_Rule",
                entity_name="Search Criteria",
                fact_key="Target Department",
                fact_value=icp.target_department or "Engineering & Technology",
                source_name="Planner Agent Parser",
                confidence="High",
                agent_creator="Planner Agent",
                timestamp="00:00:01"
            )
        ]

        return icp, tasks, facts

planner_agent = PlannerAgent()
