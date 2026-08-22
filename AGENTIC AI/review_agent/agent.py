"""
Review Agent Module
Evaluates campus rule compliance, problem identification, RAG policy citations, and replan decisions.
"""

from typing import Dict, List, Any
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tools.compliance_tools import check_event_compliance, load_rules
from rag.rag_engine import rag_engine


class ReviewAgent:
    def __init__(self):
        self.name = "Review Agent"

    def review_event(self, event_data: Dict[str, Any], venue: Dict[str, Any], cost_data: Dict[str, Any], coordinators: List[Dict[str, Any]], volunteers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Reviews event plan against all 12 rules, compiles RAG citations and recommendations.
        """
        compliance_eval = check_event_compliance(event_data, venue, cost_data, coordinators, volunteers)
        
        # Query RAG citations for event type & category
        event_type = event_data.get("event_type") or event_data.get("category", "Campus Event")
        rag_citations = rag_engine.get_citations(f"{event_type} venue budget curfew volunteers")

        # Generate intelligent recommendations
        recommendations = []
        if compliance_eval.get("replan_needed"):
            recommendations.append("Action required: Resolve flagged compliance warnings before administrative sanction.")
            for prob in compliance_eval.get("problems", []):
                recommendations.append(f"Address issue: {prob}")
        else:
            recommendations.append(f"Optimal venue selected: {venue.get('venue_name', '')} matches required attendee capacity.")
            recommendations.append(f"Total budget allocation ₹{cost_data.get('grand_total', 0):,.2f} complies with standard limits.")
            recommendations.append(f"Deployed {len(coordinators)} faculty coordinator(s) and {len(volunteers)} student volunteer(s).")

        return {
            "compliance": compliance_eval,
            "rag_citations": rag_citations,
            "recommendations": recommendations,
            "replan_needed": compliance_eval.get("replan_needed", False)
        }


review_agent = ReviewAgent()
