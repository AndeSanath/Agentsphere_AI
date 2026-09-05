import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

from app.models.search import SearchRecord, SearchStatus, ICPCriteria, TaskPlanItem
from app.agents.planner import planner_agent
from app.agents.company_discovery import discovery_agent
from app.agents.company_research import research_agent
from app.agents.icp_matcher import icp_matching_agent
from app.agents.validator import validation_agent
from app.agents.decision_maker import decision_maker_agent
from app.agents.contact_enricher import contact_enricher_agent
from app.agents.summary_agent import summary_agent
from app.db.repository import db

logger = logging.getLogger("agentsphere.orchestrator")

class OrchestratorAgent:
    """Master agent that orchestrates multi-agent workflow, isolates failures, and updates execution state."""

    def run_pipeline(self, query: Optional[str] = None, icp: Optional[ICPCriteria] = None) -> SearchRecord:
        parsed_icp, tasks, initial_facts = planner_agent.plan(query or "", icp)
        search_id = f"search_{uuid.uuid4().hex[:8]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Store initial memory facts
        for f in initial_facts:
            f.search_id = search_id
            db.shared_memory.append(f)

        # Stage 1: Discovery
        orgs, disc_facts = discovery_agent.discover(search_id, parsed_icp, query or "")
        for f in disc_facts:
            db.shared_memory.append(f)

        # Stage 2: Research
        orgs, res_facts = research_agent.research(search_id, orgs)
        for f in res_facts:
            db.shared_memory.append(f)

        # Stage 3: ICP Match Scoring
        orgs, icp_facts = icp_matching_agent.match(search_id, parsed_icp, orgs)
        for f in icp_facts:
            db.shared_memory.append(f)

        # Stage 4: Multi-Source Validation
        orgs, val_facts, reviews = validation_agent.validate(search_id, orgs)
        for f in val_facts:
            db.shared_memory.append(f)
        for r in reviews:
            db.human_reviews[r.id] = r

        # Stage 5: Decision-Maker Identification
        orgs, dm_facts = decision_maker_agent.identify(search_id, parsed_icp, orgs)
        for f in dm_facts:
            db.shared_memory.append(f)

        # Stage 6: Contact Information Enrichment
        orgs, contact_facts = contact_enricher_agent.enrich(search_id, orgs)
        for f in contact_facts:
            db.shared_memory.append(f)

        # Stage 7: Summary & Executive Briefing
        orgs, summary_facts = summary_agent.summarize(search_id, parsed_icp, orgs)
        for f in summary_facts:
            db.shared_memory.append(f)

        # Save organizations to repository DB
        for org in orgs:
            db.organizations[org.id] = org

        # Update tasks to completed state
        completed_tasks = []
        for t in tasks:
            t.status = "completed"
            completed_tasks.append(t)

        total_found = len(orgs)
        qualified_count = len([o for o in orgs if o.icp_match_score >= 80])
        total_dms = sum(len(o.decision_makers) for o in orgs)
        pending_revs = len(reviews)

        search_rec = SearchRecord(
            id=search_id,
            query=query or f"Search for {parsed_icp.industry} in {parsed_icp.location}",
            icp=parsed_icp,
            status=SearchStatus.NEEDS_HUMAN_REVIEW if pending_revs > 0 else SearchStatus.COMPLETED,
            tasks=completed_tasks,
            total_organizations_found=total_found,
            qualified_prospects_count=qualified_count,
            decision_makers_found=total_dms,
            pending_reviews_count=pending_revs,
            created_at=now_str,
            updated_at=now_str
        )

        db.searches[search_id] = search_rec
        return search_rec

orchestrator = OrchestratorAgent()
orchestrator_agent = orchestrator
