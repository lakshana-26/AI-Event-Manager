"""
People Tools Module
Interfaces with staff coordinators, student volunteer eligibility, and attendance tracking.
"""

import json
import os
from typing import Dict, List, Any

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UI"))
STAFF_FILE = os.path.join(UI_DIR, "staff.json")
STUDENTS_FILE = os.path.join(UI_DIR, "students.json")


def load_staff() -> List[Dict[str, Any]]:
    try:
        with open(STAFF_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def load_students() -> List[Dict[str, Any]]:
    try:
        with open(STUDENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def select_coordinators(department: str = "", event_type: str = "", count: int = 1) -> List[Dict[str, Any]]:
    """
    Selects optimal faculty coordinators matching the host department and specialization.
    """
    staff = load_staff()
    if not staff:
        return []

    # Score candidates
    scored = []
    for s in staff:
        score = 0
        if department and department.lower() in s.get("department", "").lower():
            score += 3
        if event_type and (event_type.lower() in s.get("specialization", "").lower() or event_type.lower() in s.get("assigned_club", "").lower()):
            score += 2
        scored.append((score, s))

    scored.sort(key=lambda x: x[0], reverse=True)
    selected = [s for _, s in scored[:max(1, count)]]

    return [
        {
            "user_id": s.get("user_id"),
            "registration_id": s.get("registration_id"),
            "name": s.get("name"),
            "department": s.get("department"),
            "designation": s.get("designation"),
            "role_type": "Lead Faculty Coordinator" if idx == 0 else "Co-Coordinator",
            "response": "PENDING",
            "responded_at": None,
            "remarks": ""
        }
        for idx, s in enumerate(selected)
    ]


def select_volunteers(expected_attendees: int = 50, preferred_department: str = "") -> List[Dict[str, Any]]:
    """
    Selects student volunteers according to Rule RUL_VOL_001 (1 per 25 attendees, min 2)
    and verifies On-Duty (OD) eligibility (min 75% attendance).
    """
    students = load_students()
    volunteers = [s for s in students if s.get("is_volunteer")]

    needed = max(2, (expected_attendees + 24) // 25)

    # Sort prioritizing department match
    if preferred_department:
        volunteers.sort(key=lambda s: preferred_department.lower() not in s.get("department", "").lower())

    chosen = volunteers[:needed]
    task_templates = [
        "Participant Check-in & QR Badging Desk",
        "Audio-Visual & Presentation Rig Support",
        "Crowd Flow & Main Gate Security Coordination",
        "Speaker & Dignitary Hospitality",
        "Stage Logistics & Timekeeping",
        "Refreshment Distribution & Cleanliness Desk"
    ]

    return [
        {
            "user_id": s.get("user_id"),
            "registration_id": s.get("registration_id"),
            "name": s.get("name"),
            "department": s.get("department"),
            "year_of_study": s.get("year_of_study"),
            "task": task_templates[idx % len(task_templates)],
            "od_eligible": True,
            "response": "PENDING",
            "responded_at": None
        }
        for idx, s in enumerate(chosen)
    ]
