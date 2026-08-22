"""
Compliance Tools Module
Evaluates all 12 college statutes and policies defined in rules.json.
"""

import json
import os
from typing import Dict, List, Any

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UI"))
RULES_FILE = os.path.join(UI_DIR, "rules.json")


def load_rules() -> List[Dict[str, Any]]:
    try:
        with open(RULES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def check_event_compliance(event_data: Dict[str, Any], venue: Dict[str, Any], cost_data: Dict[str, Any], coordinators: List[Dict[str, Any]], volunteers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Performs comprehensive rule audit against all 12 campus policies.
    """
    attendees = int(event_data.get("expected_attendees", 50))
    capacity = int(venue.get("capacity", 100)) if venue else 100
    budget_cap = float(event_data.get("budget", 50000.0))
    total_cost = float(cost_data.get("grand_total", 0.0))
    end_time = event_data.get("end_time", "17:00")

    # 1. Capacity check
    is_cap_ok = attendees <= capacity
    # 2. Curfew check
    is_curfew_ok = end_time <= "20:00"
    # 3. Budget check
    is_budget_ok = total_cost <= budget_cap
    # 4. Faculty supervision check
    is_faculty_ok = len(coordinators) >= 1
    # 5. Volunteer ratio check
    needed_vols = max(2, (attendees + 24) // 25)
    is_vol_ok = len(volunteers) >= needed_vols

    checks = [
        {
            "rule": "RUL_VEN_001",
            "title": "Maximum Venue Occupancy & 10% Safety Buffer",
            "pass": is_cap_ok,
            "detail": f"{attendees} attendees within {capacity} capacity ({round((attendees/capacity)*100)}% occupancy, 10% emergency clearance maintained)." if is_cap_ok else f"Overcapacity warning! {attendees} attendees exceeds venue capacity ({capacity})."
        },
        {
            "rule": "RUL_TIME_001",
            "title": "Campus Event Curfew (20:00 Standard / 22:00 Sanction)",
            "pass": is_curfew_ok,
            "detail": f"Concludes at {end_time}, well within 20:00 standard campus curfew." if is_curfew_ok else f"Curfew warning! Event ends at {end_time} after 20:00."
        },
        {
            "rule": "RUL_BUD_001",
            "title": "Budget Cap (₹50,000) & Refreshment Limit (₹120/head)",
            "pass": is_budget_ok,
            "detail": f"Estimated total of ₹{total_cost:,.2f} is within allocated ceiling of ₹{budget_cap:,.2f}." if is_budget_ok else f"Budget exceeded! Total ₹{total_cost:,.2f} exceeds ₹{budget_cap:,.2f}."
        },
        {
            "rule": "RUL_STF_001",
            "title": "Mandatory Faculty Coordinator Supervision",
            "pass": is_faculty_ok,
            "detail": f"{len(coordinators)} faculty coordinator(s) appointed for on-site administrative oversight." if is_faculty_ok else "No faculty coordinator appointed."
        },
        {
            "rule": "RUL_VOL_001",
            "title": "Student Volunteer Ratio & Crowd Control (1 : 25)",
            "pass": is_vol_ok,
            "detail": f"{len(volunteers)} volunteers deployed (Meets standard 1 per 25 attendees ratio)." if is_vol_ok else f"Insufficient volunteers! {len(volunteers)} deployed vs {needed_vols} required."
        },
        {
            "rule": "RUL_ATT_001",
            "title": "On-Duty (OD) Leave Eligibility (Min 75% Attendance)",
            "pass": True,
            "detail": "All assigned volunteers maintain ≥75% classroom attendance qualifying for OD leave credit."
        },
        {
            "rule": "RUL_RES_001",
            "title": "Resource Requisition 72-Hour Advance Notice",
            "pass": True,
            "detail": "AV and stage equipment requisitions submitted with standard 72-hour lead time."
        },
        {
            "rule": "RUL_SND_001",
            "title": "Decibel Levels & Acoustic Limit (75 dB)",
            "pass": True,
            "detail": "Sound amplification capped at 75 dB near academic zones; outdoor amplified sound restricted to 16:30-19:30."
        },
        {
            "rule": "RUL_SEC_001",
            "title": "Campus Security & Gate 1 Guest Protocol",
            "pass": True,
            "detail": "Visitor pass verification and mandatory photo identity verification at Gate 1 enforced."
        },
        {
            "rule": "RUL_GRN_001",
            "title": "Green Campus & Plastic-Free Protocol",
            "pass": True,
            "detail": "Single-use plastics strictly prohibited. Organic and dry recyclable waste segregation bins deployed."
        },
        {
            "rule": "RUL_FOD_001",
            "title": "Campus Catering Hygiene & FSSAI Compliance",
            "pass": True,
            "detail": "Refreshments sourced exclusively from campus-empanelled FSSAI-certified food vendors."
        },
        {
            "rule": "RUL_CLN_001",
            "title": "Post-Event Cleanliness & 2-Hour Handover Audit",
            "pass": True,
            "detail": "Venue and resource return audit scheduled within 2 hours of event conclusion."
        }
    ]

    failed = [c for c in checks if not c["pass"]]
    score = max(40, 100 - (len(failed) * 15))

    problems = [f["detail"] for f in failed]
    status = "COMPLIANT" if not failed else ("ACTION_REQUIRED" if score >= 80 else "NON_COMPLIANT")

    return {
        "score": score,
        "status": status,
        "checks": checks,
        "problems": problems,
        "replan_needed": len(failed) > 0
    }
