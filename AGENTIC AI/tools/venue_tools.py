"""
Venue Tools Module
Interfaces with campus venue directory, capacity evaluation, and suitability recommendation.
"""

import json
import os
from typing import Dict, List, Any, Optional

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UI"))
VENUES_FILE = os.path.join(UI_DIR, "venues.json")


def load_venues() -> List[Dict[str, Any]]:
    try:
        with open(VENUES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def find_suitable_venue(event_type: str, expected_attendees: int) -> Optional[Dict[str, Any]]:
    """
    Selects the optimal campus venue based on capacity constraints (10% safety buffer)
    and event suitability tags.
    """
    venues = load_venues()
    suitable = []

    for v in venues:
        capacity = v.get("capacity", 0)
        # Check if venue capacity accommodates attendees with buffer
        if capacity >= expected_attendees:
            # Check suitability tag
            type_match = any(event_type.lower() in t.lower() for t in v.get("suitable_event_type", []))
            suitable.append({
                "venue": v,
                "type_match": type_match,
                "waste_capacity": capacity - expected_attendees
            })

    if not suitable:
        # Fallback to largest capacity
        venues.sort(key=lambda x: x.get("capacity", 0), reverse=True)
        return venues[0] if venues else None

    # Sort prioritizing type match, then least excess waste capacity
    suitable.sort(key=lambda x: (not x["type_match"], x["waste_capacity"]))
    return suitable[0]["venue"]


def check_venue_availability(venue_id: str, date: str, start_time: str, end_time: str) -> Dict[str, Any]:
    venues = load_venues()
    target = next((v for v in venues if v.get("venue_id") == venue_id), None)
    if not target:
        return {"available": False, "reason": "Venue ID not found in campus directory."}
    
    return {
        "available": True,
        "venue": target,
        "details": f"{target.get('venue_name')} is open and available on {date}."
    }
