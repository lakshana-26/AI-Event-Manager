"""
AI Event Manager - FastAPI REST Backend API Server
Seamlessly bridges Frontend requests to the Agentic AI Multi-Agent System.
"""

import json
import os
import sys
from typing import Dict, List, Any, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field

# Add agentic root to sys.path
AGENTIC_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(AGENTIC_DIR)

from main_agent.agent import main_agent
from people_agent.agent import people_agent
from resource_agent.agent import resource_agent
from review_agent.agent import review_agent
from memory.state.event_state import state_manager
from tools.venue_tools import load_venues
from tools.resource_tools import load_resources
from tools.people_tools import load_staff, load_students
from tools.compliance_tools import load_rules

UI_DIR = os.path.abspath(os.path.join(AGENTIC_DIR, "..", "UI"))
FRONTEND_DIR = os.path.abspath(os.path.join(AGENTIC_DIR, "..", "FRONTEND"))
USERS_FILE = os.path.join(UI_DIR, "users.json")
NOTIFICATIONS_FILE = os.path.join(UI_DIR, "notifications.json")


def load_users() -> List[Dict[str, Any]]:
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def load_notifications() -> List[Dict[str, Any]]:
    try:
        if os.path.exists(NOTIFICATIONS_FILE):
            with open(NOTIFICATIONS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return []


def save_notifications(notifs: List[Dict[str, Any]]):
    try:
        with open(NOTIFICATIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(notifs, f, indent=2)
    except Exception as e:
        print(f"Error saving notifications: {e}")


app = FastAPI(
    title="AI Event Manager API",
    description="Autonomous Agentic Backend API for Campus Event Management",
    version="2.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount FRONTEND static files if folder exists
if os.path.exists(FRONTEND_DIR):
    app.mount("/FRONTEND", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
    app.mount("/pages", StaticFiles(directory=os.path.join(FRONTEND_DIR, "pages"), html=True), name="pages")
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")

@app.get("/")
def root_redirect():
    return RedirectResponse(url="/FRONTEND/index.html")


# --- Request/Response Models ---

class LoginRequest(BaseModel):
    registration_id: str
    password: str


class EventPlanRequest(BaseModel):
    title: str
    category: Optional[str] = "Technical Symposium"
    event_type: Optional[str] = "Technical Symposium"
    department: Optional[str] = "Computer Science and Engineering"
    description: Optional[str] = ""
    expected_attendees: int = 100
    start_date: str = "2026-09-15"
    start_time: str = "09:00"
    end_date: Optional[str] = "2026-09-15"
    end_time: str = "17:00"
    date: Optional[str] = "2026-09-15"
    venue_id: Optional[str] = None
    budget_cap: Optional[float] = 50000.0
    budget: Optional[float] = 50000.0
    selected_resources: Optional[List[Dict[str, Any]]] = []
    coordinator_ids: Optional[List[str]] = []
    volunteer_ids: Optional[List[str]] = []
    created_by: Optional[str] = "ADM001"


class StaffResponseRequest(BaseModel):
    registration_id: str
    decision: str = Field(..., description="'YES' or 'NO'")
    remarks: Optional[str] = ""


class StudentResponseRequest(BaseModel):
    registration_id: str
    decision: str = Field(..., description="'YES' or 'NO'")


class ReplanRequest(BaseModel):
    budget_cap: Optional[float] = None
    expected_attendees: Optional[int] = None
    venue_id: Optional[str] = None


# --- Endpoints ---

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AI Event Manager Agentic Backend",
        "version": "2.0.0",
        "endpoints": "/docs"
    }


@app.post("/api/login")
def login(req: LoginRequest):
    users = load_users()
    clean_reg = req.registration_id.strip().upper()
    clean_pass = req.password.strip()

    user = next((u for u in users if u.get("registration_id", "").upper() == clean_reg and u.get("password") == clean_pass), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Registration ID or Password")

    user_data = dict(user)
    user_data.pop("password", None)

    # Attach staff or student profile metadata
    if user_data.get("role") == "staff":
        staff_records = load_staff()
        staff_info = next((s for s in staff_records if s.get("user_id") == user_data.get("user_id")), {})
        user_data.update(staff_info)
    elif user_data.get("role") == "student":
        student_records = load_students()
        stu_info = next((st for st in student_records if st.get("user_id") == user_data.get("user_id")), {})
        user_data.update(stu_info)

    return {"success": True, "user": user_data}


@app.get("/api/users")
def get_users():
    users = load_users()
    return [{"user_id": u.get("user_id"), "registration_id": u.get("registration_id"), "name": u.get("name"), "role": u.get("role"), "department": u.get("department")} for u in users]


@app.get("/api/staff")
def get_staff():
    return load_staff()


@app.get("/api/students")
def get_students(volunteers_only: bool = False):
    students = load_students()
    if volunteers_only:
        return [s for s in students if s.get("is_volunteer")]
    return students


@app.get("/api/venues")
def get_venues():
    return load_venues()


@app.get("/api/resources")
def get_resources():
    return load_resources()


@app.get("/api/rules")
def get_rules():
    return load_rules()


@app.get("/api/events")
def get_events():
    return state_manager.load_events()


@app.get("/api/events/{event_id}")
def get_event(event_id: str):
    event = state_manager.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@app.post("/api/events")
def create_event(req: EventPlanRequest):
    return state_manager.create_event(req.dict())


@app.post("/api/ai/plan-event")
def ai_plan_event(req: EventPlanRequest):
    """
    Main Agent Planning Pipeline Execution
    """
    planned_event = main_agent.plan_event_pipeline(req.dict())
    
    # Generate in-app notifications
    notifs = load_notifications()
    now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    for coord in planned_event.get("coordinators", []):
        notifs.insert(0, {
            "id": f"NOTIF_{int(datetime.utcnow().timestamp()*1000)}_{coord.get('registration_id')}",
            "recipient_id": coord.get("registration_id"),
            "title": "Faculty Coordinator Request",
            "message": f"You have been requested to coordinate '{planned_event.get('title')}' scheduled for {planned_event.get('date')}.",
            "type": "REQUEST",
            "event_id": planned_event.get("event_id"),
            "timestamp": now_iso,
            "read": False,
            "action_required": True
        })

    for vol in planned_event.get("volunteers", []):
        notifs.insert(0, {
            "id": f"NOTIF_{int(datetime.utcnow().timestamp()*1000)}_{vol.get('registration_id')}",
            "recipient_id": vol.get("registration_id"),
            "title": "Volunteer Assignment Request",
            "message": f"You are invited to volunteer for '{planned_event.get('title')}' ({vol.get('task')}). On-Duty credit eligible.",
            "type": "REQUEST",
            "event_id": planned_event.get("event_id"),
            "timestamp": now_iso,
            "read": False,
            "action_required": True
        })

    save_notifications(notifs)
    return planned_event


@app.post("/api/events/{event_id}/staff-response")
def staff_response(event_id: str, req: StaffResponseRequest):
    """
    Processes Faculty Coordinator response through PeopleAgent
    """
    resp = people_agent.process_staff_response(event_id, req.registration_id, req.decision, req.remarks)
    event = state_manager.get_event(event_id)
    return {"success": True, "response": resp, "event": event}


@app.post("/api/events/{event_id}/student-response")
def student_response(event_id: str, req: StudentResponseRequest):
    """
    Processes Student Volunteer response through PeopleAgent
    """
    resp = people_agent.process_student_response(event_id, req.registration_id, req.decision)
    event = state_manager.get_event(event_id)
    return {"success": True, "response": resp, "event": event}


@app.post("/api/events/{event_id}/approve")
def approve_event(event_id: str):
    updated = state_manager.update_event_state(event_id, {
        "status": "APPROVED",
        "workflow_state": "APPROVED",
        "last_agent_action": "ADMIN_APPROVED"
    })
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"success": True, "event": updated}


@app.post("/api/events/{event_id}/publish")
def publish_event(event_id: str):
    updated = state_manager.update_event_state(event_id, {
        "status": "PUBLISHED",
        "workflow_state": "PUBLISHED",
        "last_agent_action": "ADMIN_PUBLISHED"
    })
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"success": True, "event": updated}


@app.post("/api/events/{event_id}/replan")
def replan_event(event_id: str, req: ReplanRequest):
    event = state_manager.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    adjustments = req.dict(exclude_unset=True)
    if "budget_cap" in adjustments:
        event["budget"] = adjustments["budget_cap"]
        event["budget_cap"] = adjustments["budget_cap"]
    if "expected_attendees" in adjustments:
        event["expected_attendees"] = adjustments["expected_attendees"]
    if "venue_id" in adjustments:
        event["venue_id"] = adjustments["venue_id"]

    event["replan_count"] = event.get("replan_count", 0) + 1
    # Re-run pipeline
    reこと = main_agent.plan_event_pipeline(event)
    return {"success": True, "event": reこと}


@app.get("/api/events/{event_id}/compliance")
def get_compliance(event_id: str):
    event = state_manager.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event.get("compliance", {})


@app.get("/api/events/{event_id}/state")
def get_event_state(event_id: str):
    event = state_manager.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "event_id": event.get("event_id"),
        "status": event.get("status"),
        "workflow_state": event.get("workflow_state"),
        "pending_requirements": event.get("pending_requirements", []),
        "identified_problems": event.get("identified_problems", []),
        "replan_count": event.get("replan_count", 0),
        "last_agent_action": event.get("last_agent_action")
    }


@app.get("/api/notifications")
def get_notifications(registration_id: Optional[str] = None):
    notifs = load_notifications()
    if registration_id:
        return [n for n in notifs if n.get("recipient_id") == registration_id or n.get("recipient_id") == "ALL"]
    return notifs


@app.post("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str):
    notifs = load_notifications()
    for n in notifs:
        if n.get("id") == notification_id:
            n["read"] = True
    save_notifications(notifs)
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    print("Starting AI Event Manager FastAPI Server on http://127.0.0.1:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
