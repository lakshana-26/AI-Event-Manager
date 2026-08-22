"""
Event Memory and State Management Module
Maintains event lifecycle states, problem logs, and response histories.
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "UI"))
EVENTS_FILE = os.path.join(UI_DIR, "events.json")
RESPONSES_FILE = os.path.join(UI_DIR, "responses.json")
NOTIFICATIONS_FILE = os.path.join(UI_DIR, "notifications.json")


class EventStateManager:
    """
    State Manager for Campus AI Events
    Preserves event workflow states and logs responses with full referential integrity.
    """

    STATES = [
        "DRAFT",
        "COLLECTING_RESPONSES",
        "STAFF_AVAILABILITY",
        "STUDENT_INTEREST",
        "RESOURCE_PLANNING",
        "COMPLIANCE_REVIEW",
        "RE_PLANNING",
        "APPROVED",
        "PUBLISHED"
    ]

    def __init__(self):
        self._ensure_files()

    def _ensure_files(self):
        for path in [EVENTS_FILE, RESPONSES_FILE]:
            if not os.path.exists(path):
                with open(path, "w", encoding="utf-8") as f:
                    json.dump([], f, indent=2)

    def load_events(self) -> List[Dict[str, Any]]:
        try:
            with open(EVENTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def save_events(self, events: List[Dict[str, Any]]) -> bool:
        try:
            with open(EVENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(events, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving events: {e}")
            return False

    def load_responses(self) -> List[Dict[str, Any]]:
        try:
            with open(RESPONSES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def save_responses(self, responses: List[Dict[str, Any]]) -> bool:
        try:
            with open(RESPONSES_FILE, "w", encoding="utf-8") as f:
                json.dump(responses, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving responses: {e}")
            return False

    def get_event(self, event_id: str) -> Optional[Dict[str, Any]]:
        events = self.load_events()
        for e in events:
            if e.get("event_id") == event_id:
                return e
        return None

    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        events = self.load_events()
        
        # Generate next event ID
        event_num = len(events) + 1
        event_id = event_data.get("event_id") or f"EVT{event_num:03d}"
        now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        new_event = {
            "event_id": event_id,
            "title": event_data.get("title", "Campus Event"),
            "description": event_data.get("description", ""),
            "event_type": event_data.get("event_type") or event_data.get("category", "Technical Symposium"),
            "date": event_data.get("date") or event_data.get("start_date", "2026-09-15"),
            "start_time": event_data.get("start_time", "09:00"),
            "end_time": event_data.get("end_time", "17:00"),
            "expected_attendees": int(event_data.get("expected_attendees", 100)),
            "budget": float(event_data.get("budget") or event_data.get("budget_cap", 50000.0)),
            "status": event_data.get("status", "COLLECTING_RESPONSES"),
            "workflow_state": event_data.get("workflow_state", "COLLECTING_RESPONSES"),
            "pending_requirements": event_data.get("pending_requirements", ["STAFF_AVAILABILITY", "STUDENT_INTEREST"]),
            "identified_problems": event_data.get("identified_problems", []),
            "failure_reasons": event_data.get("failure_reasons", []),
            "replan_count": int(event_data.get("replan_count", 0)),
            "last_agent_action": event_data.get("last_agent_action", "PEOPLE_AGENT_CHECK_AVAILABILITY"),
            "created_by": event_data.get("created_by", "ADM001"),
            "created_at": event_data.get("created_at", now_iso),
            "updated_at": now_iso,
            # Supporting extended frontend objects
            "venue_id": event_data.get("venue_id"),
            "venue_name": event_data.get("venue_name"),
            "coordinators": event_data.get("coordinators", []),
            "volunteers": event_data.get("volunteers", []),
            "resources": event_data.get("resources", []),
            "schedule": event_data.get("schedule", []),
            "compliance": event_data.get("compliance", {}),
            "ai_recommendations": event_data.get("ai_recommendations", [])
        }

        # Update or prepend
        events = [e for e in events if e.get("event_id") != event_id]
        events.insert(0, new_event)
        self.save_events(events)
        return new_event

    def update_event_state(self, event_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        events = self.load_events()
        now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        for i, e in enumerate(events):
            if e.get("event_id") == event_id:
                events[i].update(updates)
                events[i]["updated_at"] = now_iso
                self.save_events(events)
                return events[i]
        return None

    def record_response(self, event_id: str, user_id: str, request_type: str, decision: str) -> Dict[str, Any]:
        """
        Records a response adhering strictly to verify_data.py schema:
        response_id, event_id, user_id, request_type ('STAFF_AVAILABILITY' / 'STUDENT_INTEREST'),
        response ('YES' / 'NO'), status ('COMPLETED'), timestamp.
        """
        responses = self.load_responses()
        resp_id = f"RESP{len(responses) + 1:03d}"
        now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        new_resp = {
            "response_id": resp_id,
            "event_id": event_id,
            "user_id": user_id,
            "request_type": request_type,
            "response": "YES" if decision.upper() == "YES" else "NO",
            "status": "COMPLETED",
            "timestamp": now_iso
        }

        # Update existing or append
        responses = [r for r in responses if not (r.get("event_id") == event_id and r.get("user_id") == user_id and r.get("request_type") == request_type)]
        responses.append(new_resp)
        self.save_responses(responses)

        # Update event coordinator/volunteer status in event state
        event = self.get_event(event_id)
        if event:
            if request_type == "STAFF_AVAILABILITY":
                for c in event.get("coordinators", []):
                    if c.get("user_id") == user_id or c.get("registration_id") == user_id:
                        c["response"] = "APPROVED" if new_resp["response"] == "YES" else "DECLINED"
                        c["responded_at"] = now_iso
            elif request_type == "STUDENT_INTEREST":
                for v in event.get("volunteers", []):
                    if v.get("user_id") == user_id or v.get("registration_id") == user_id:
                        v["response"] = "APPROVED" if new_resp["response"] == "YES" else "DECLINED"
                        v["responded_at"] = now_iso

            # Check if pending requirements are resolved
            coordinators = event.get("coordinators", [])
            volunteers = event.get("volunteers", [])
            has_pending_staff = any(c.get("response") == "PENDING" for c in coordinators)
            has_pending_students = any(v.get("response") == "PENDING" for v in volunteers)

            pending = []
            if has_pending_staff:
                pending.append("STAFF_AVAILABILITY")
            if has_pending_students:
                pending.append("STUDENT_INTEREST")

            self.update_event_state(event_id, {
                "coordinators": coordinators,
                "volunteers": volunteers,
                "pending_requirements": pending,
                "last_agent_action": f"RECORDED_{request_type}_{new_resp['response']}"
            })

        return new_resp


state_manager = EventStateManager()
