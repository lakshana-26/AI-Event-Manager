"""
People Agent Module
Coordinates faculty coordinator assignment, volunteer ratio calculations, and response tracking.
"""

from typing import Dict, List, Any
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tools.people_tools import select_coordinators, select_volunteers, load_staff, load_students
from memory.state.event_state import state_manager


class PeopleAgent:
    def __init__(self):
        self.name = "People Agent"

    def plan_people(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Plans staff coordinators and volunteer deployment matrix.
        """
        department = event_data.get("department", "")
        event_type = event_data.get("event_type") or event_data.get("category", "")
        expected_attendees = int(event_data.get("expected_attendees", 50))

        # Check if user already picked specific coordinator IDs
        custom_coord_ids = event_data.get("coordinator_ids")
        if custom_coord_ids:
            all_staff = {s["registration_id"]: s for s in load_staff()}
            coordinators = []
            for cid in custom_coord_ids:
                s = all_staff.get(cid)
                if s:
                    coordinators.append({
                        "user_id": s["user_id"],
                        "registration_id": s["registration_id"],
                        "name": s["name"],
                        "department": s["department"],
                        "designation": s["designation"],
                        "role_type": "Faculty Coordinator",
                        "response": "PENDING",
                        "responded_at": None,
                        "remarks": ""
                    })
            if not coordinators:
                coordinators = select_coordinators(department, event_type, count=2)
        else:
            coordinators = select_coordinators(department, event_type, count=2)

        # Check if user already picked specific volunteer IDs
        custom_vol_ids = event_data.get("volunteer_ids")
        if custom_vol_ids:
            all_students = {st["registration_id"]: st for st in load_students()}
            volunteers = []
            task_templates = [
                "Participant Check-in & QR Badging Desk",
                "Audio-Visual & Presentation Rig Support",
                "Crowd Flow & Main Gate Security Coordination",
                "Speaker & Dignitary Hospitality",
                "Stage Logistics & Timekeeping",
                "Refreshment Distribution & Cleanliness Desk"
            ]
            for idx, vid in enumerate(custom_vol_ids):
                st = all_students.get(vid)
                if st:
                    volunteers.append({
                        "user_id": st["user_id"],
                        "registration_id": st["registration_id"],
                        "name": st["name"],
                        "department": st["department"],
                        "year_of_study": st.get("year_of_study", 2),
                        "task": task_templates[idx % len(task_templates)],
                        "od_eligible": True,
                        "response": "PENDING",
                        "responded_at": None
                    })
            if not volunteers:
                volunteers = select_volunteers(expected_attendees, department)
        else:
            volunteers = select_volunteers(expected_attendees, department)

        return {
            "coordinators": coordinators,
            "volunteers": volunteers,
            "required_volunteers_count": max(2, (expected_attendees + 24) // 25)
        }

    def process_staff_response(self, event_id: str, staff_id: str, decision: str, remarks: str = "") -> Dict[str, Any]:
        resp = state_manager.record_response(event_id, staff_id, "STAFF_AVAILABILITY", decision)
        return resp

    def process_student_response(self, event_id: str, student_id: str, decision: str) -> Dict[str, Any]:
        resp = state_manager.record_response(event_id, student_id, "STUDENT_INTEREST", decision)
        return resp


people_agent = PeopleAgent()
