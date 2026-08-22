"""
Resource Agent Module
Coordinates campus venue selection, safety buffer enforcement, and equipment allocation.
"""

from typing import Dict, List, Any
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tools.venue_tools import find_suitable_venue, check_venue_availability, load_venues
from tools.resource_tools import calculate_resources_cost, load_resources


class ResourceAgent:
    def __init__(self):
        self.name = "Resource Agent"

    def plan_resources(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Selects venue and calculates itemized resource costs.
        """
        event_type = event_data.get("event_type") or event_data.get("category", "Technical Symposium")
        expected_attendees = int(event_data.get("expected_attendees", 50))
        requested_resources = event_data.get("selected_resources", [])
        date = event_data.get("date") or event_data.get("start_date", "2026-09-15")
        start_time = event_data.get("start_time", "09:00")
        end_time = event_data.get("end_time", "17:00")

        # Check if user specified preferred venue_id
        venue_id = event_data.get("venue_id")
        selected_venue = None
        if venue_id:
            all_venues = load_venues()
            selected_venue = next((v for v in all_venues if v.get("venue_id") == venue_id), None)

        if not selected_venue:
            selected_venue = find_suitable_venue(event_type, expected_attendees)

        # Check availability
        avail_check = check_venue_availability(selected_venue.get("venue_id"), date, start_time, end_time)

        # Calculate costs
        cost_data = calculate_resources_cost(requested_resources, expected_attendees)

        return {
            "venue": selected_venue,
            "venue_availability": avail_check,
            "resources": cost_data.get("allocated_resources", []),
            "equipment_cost": cost_data.get("equipment_cost", 0.0),
            "refreshment_cost": cost_data.get("refreshment_cost", 0.0),
            "grand_total": cost_data.get("grand_total", 0.0)
        }


resource_agent = ResourceAgent()
