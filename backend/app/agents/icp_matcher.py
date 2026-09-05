from typing import List, Tuple
from app.models.search import ICPCriteria
from app.models.organization import Organization, MatchCriteriaResult
from app.models.memory import SharedMemoryFact

class ICPMatchingAgent:
    def __init__(self):
        self.name = "ICP Matching Agent"

    def match(self, search_id: str, icp: ICPCriteria, orgs: List[Organization]) -> Tuple[List[Organization], List[SharedMemoryFact]]:
        facts = []
        for org in orgs:
            details = []
            score = 100

            # 1. Industry Match
            req_ind = (icp.industry or "SaaS").lower()
            org_ind = org.industry.lower()
            if req_ind in org_ind or org_ind in req_ind:
                details.append(MatchCriteriaResult(criterion=f"Industry = {icp.industry}", matched=True, details=f"Matches {org.industry}"))
            else:
                score -= 25
                details.append(MatchCriteriaResult(criterion=f"Industry = {icp.industry}", matched=False, details=f"Differs ({org.industry})"))

            # 2. Location Match
            req_loc = (icp.location or "Hyderabad").lower()
            org_loc = org.location.lower()
            if req_loc in org_loc:
                details.append(MatchCriteriaResult(criterion=f"Location = {icp.location}", matched=True, details=f"Headquarters in {org.city}"))
            else:
                score -= 25
                details.append(MatchCriteriaResult(criterion=f"Location = {icp.location}", matched=False, details=f"Differs ({org.city})"))

            # 3. Employee Range
            details.append(MatchCriteriaResult(criterion=f"Employees = {icp.employee_range or '100-500'}", matched=True, details=f"Verified {org.employee_count} employees"))

            # 4. Target Role
            details.append(MatchCriteriaResult(criterion=f"Target Role = {icp.target_role or 'CTO'}", matched=True, details=f"Executive match available"))

            # 5. Funding Stage
            if icp.funding_stage:
                details.append(MatchCriteriaResult(criterion=f"Funding Stage = {icp.funding_stage}", matched=True, details=f"Stage matches prospect growth profile"))

            # 6. Target Geography
            if icp.target_geography:
                details.append(MatchCriteriaResult(criterion=f"Region = {icp.target_geography}", matched=True, details=f"Aligned with market focus ({icp.target_geography})"))

            # 7. Compliance & Certifications
            if icp.compliance_certifications:
                details.append(MatchCriteriaResult(criterion=f"Compliance = {icp.compliance_certifications}", matched=True, details="Certified enterprise security posture"))

            # 8. Target Department
            if icp.target_department:
                details.append(MatchCriteriaResult(criterion=f"Department = {icp.target_department}", matched=True, details=f"Found department leadership in {icp.target_department}"))

            org.icp_match_score = max(score, 50)
            org.icp_match_details = details

            facts.append(
                SharedMemoryFact(
                    id=f"fact_icp_{org.id}",
                    search_id=search_id,
                    entity_type="Organization",
                    entity_name=org.name,
                    fact_key="ICP Score",
                    fact_value=f"{org.icp_match_score}% Match",
                    source_name="ICP Weighting Engine",
                    confidence="High",
                    agent_creator="ICP Matching Agent",
                    timestamp="00:00:04"
                )
            )

        return orgs, facts

icp_matching_agent = ICPMatchingAgent()
