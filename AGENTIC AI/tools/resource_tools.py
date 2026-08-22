"""
Resource Tools Module
Interfaces with equipment inventory, cost calculation, and allocation limits.
"""

import json
import os
from typing import Dict, List, Any

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UI"))
RESOURCES_FILE = os.path.join(UI_DIR, "resources.json")


def load_resources() -> List[Dict[str, Any]]:
    try:
        with open(RESOURCES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def calculate_resources_cost(requested_items: List[Dict[str, Any]], expected_attendees: int = 50) -> Dict[str, Any]:
    """
    Calculates itemized resource requisition costs plus per-head catering refreshment estimate.
    """
    inventory = {r["resource_id"]: r for r in load_resources()}
    allocated = []
    total_equipment_cost = 0.0

    for item in requested_items:
        res_id = item.get("resource_id")
        qty = int(item.get("quantity", 1))
        res = inventory.get(res_id)
        if res:
            unit_cost = float(res.get("unit_cost", 0.0))
            subtotal = unit_cost * qty
            total_equipment_cost += subtotal
            allocated.append({
                "resource_id": res_id,
                "resource_name": res.get("resource_name"),
                "category": res.get("category"),
                "quantity": qty,
                "unit_cost": unit_cost,
                "total_cost": subtotal
            })

    # Rule RUL_BUD_001 refreshment per head estimate (₹80/head up to ₹15,000 cap)
    refreshment_cost = min(expected_attendees * 80.0, 15000.0)
    grand_total = total_equipment_cost + refreshment_cost

    return {
        "allocated_resources": allocated,
        "equipment_cost": total_equipment_cost,
        "refreshment_cost": refreshment_cost,
        "grand_total": grand_total
    }
