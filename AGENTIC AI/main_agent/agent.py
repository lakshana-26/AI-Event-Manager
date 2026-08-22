"""
Main Agent Module
Coordinates the complete Autonomous Event Planning Agentic Workflow.
"""

from typing import Dict, List, Any
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from people_agent.agent import people_agent
from resource_agent.agent import resource_agent
from review_agent.agent import review_agent
from memory.state.event_state import state_manager


class MainAgent:
    def __init__(self):
        self.name = "Main Event Coordinator Agent"

    def plan_event_pipeline(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the end-to-end multi-agent event planning workflow:
        1. People Agent -> Coordinators & Volunteers
        2. Resource Agent -> Venue & Equipment
        3. Review Agent -> 12 Rules & RAG Compliance
        4. State Manager -> Workflow state & Persistence
        """
        # Step 1: People Planning
        people_plan = people_agent.plan_people(event_data)
        coordinators = people_plan.get("coordinators", [])
        volunteers = people_plan.get("volunteers", [])

        # Step 2: Resource Planning
        resource_plan = resource_agent.plan_resources(event_data)
        venue = resource_plan.get("venue", {})
        resources = resource_plan.get("resources", [])
        cost_data = {
            "equipment_cost": resource_plan.get("equipment_cost", 0.0),
            "refreshment_cost": resource_plan.get("refreshment_cost", 0.0),
            "grand_total": resource_plan.get("grand_total", 0.0)
        }

        # Step 3: Review & Compliance Evaluation
        review_plan = review_agent.review_event(event_data, venue, cost_data, coordinators, volunteers)
        compliance = review_plan.get("compliance", {})
        recommendations = review_plan.get("recommendations", [])

        # Step 4: Schedule Generation
        start_time = event_data.get("start_time", "09:00")
        end_time = event_data.get("end_time", "17:00")
        venue_name = venue.get("venue_name", "Campus Venue")

        schedule = [
            {"time": f"{start_time} - 10:00", "activity": "Delegate Registration, QR Badging & Breakfast", "venue": f"{venue_name} Foyer"},
            {"time": "10:00 - 11:30", "activity": "Inaugural Keynote & Problem Statement Briefing", "venue": venue_name},
            {"time": "11:30 - 13:00", "activity": "Core Technical Track & Hands-on Session", "venue": venue_name},
            {"time": "13:00 - 14:00", "activity": "Networking Lunch & Refreshments", "venue": "Designated Dining Area"},
            {"time": f"14:00 - {end_time}", "activity": "Track Pitching, Valedictory & Award Ceremony", "venue": venue_name}
        ]

        # Step 5: Construct Event State Payload
        assembled_event = {
            "title": event_data.get("title", "Campus Event"),
            "description": event_data.get("description", ""),
            "event_type": event_data.get("event_type") or event_data.get("category", "Technical Symposium"),
            "date": event_data.get("date") or event_data.get("start_date", "2026-09-15"),
            "start_time": start_time,
            "end_time": end_time,
            "expected_attendees": int(event_data.get("expected_attendees", 50)),
            "budget": float(event_data.get("budget") or event_data.get("budget_cap", 50000.0)),
            "calculated_cost": cost_data.get("grand_total", 0.0),
            "venue_id": venue.get("venue_id"),
            "venue_name": venue_name,
            "status": "COLLECTING_RESPONSES",
            "workflow_state": "COLLECTING_RESPONSES",
            "pending_requirements": ["STAFF_AVAILABILITY", "STUDENT_INTEREST"],
            "identified_problems": compliance.get("problems", []),
            "failure_reasons": [],
            "replan_count": 0,
            "last_agent_action": "MAIN_AGENT_COORDINATED_PLAN",
            "created_by": event_data.get("created_by", "ADM001"),
            "coordinators": coordinators,
            "volunteers": volunteers,
            "resources": resources,
            "schedule": schedule,
            "compliance": compliance,
            "ai_recommendations": recommendations
        }

        # Save to memory and UI/events.json
        created_event = state_manager.create_event(assembled_event)
        return created_event


main_agent = MainAgent()
