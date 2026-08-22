# ⚡ AI Event Manager — Frontend & Agentic AI Backend Integration

> Autonomous Multi-Agent Campus Event Management System featuring Role-Based Portals, People Agent, Resource Agent, Review Agent, RAG-driven Policy Auditing, and Workflow State Preservation.

---

## 🏛️ System Architecture

```
                                  USER
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │         FRONTEND          │
                      │ HTML5 / CSS3 / Vanilla JS │
                      │        Bootstrap 5        │
                      └─────────────┬─────────────┘
                                    │
                                    │ REST API
                                    ▼
                      ┌───────────────────────────┐
                      │        BACKEND API        │
                      │     Python / FastAPI      │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  MAIN AGENT   │
                            └───────┬───────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
 ┌────────────┐               ┌────────────┐               ┌────────────┐
 │PEOPLE AGENT│               │RESOURCE AG.│               │REVIEW AGENT│
 └─────┬──────┘               └─────┬──────┘               └─────┬──────┘
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
               ┌───────────┐                 ┌───────────┐
               │   TOOLS   │                 │    RAG    │
               └─────┬─────┘                 └─────┬─────┘
                     │                             │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │MEMORY /STATE│
                             └──────┬──────┘
                                    │
                                    ▼
                             FINAL DECISION
                                    │
                                    ▼
                                 FRONTEND
```

---

## 📂 Project Structure

```
AI-Event-Manager/
├── FRONTEND/
│   ├── index.html                  # Role-based Portal Login (Admin, Staff, Student)
│   ├── README.md                   # Full Architectural & API Documentation
│   ├── css/
│   │   └── style.css               # Responsive Dark Theme & Bootstrap 5 enhancements
│   ├── js/
│   │   ├── api.js                  # Centralized REST API client (API_BASE_URL: http://localhost:8000)
│   │   ├── auth.js                 # Authentication controller & role router
│   │   ├── common.js               # Global UI utilities, navbar, toasts & session management
│   │   ├── admin.js                # Command Center, system metrics & event actions
│   │   ├── events.js               # Autonomous AI Event Planner & result renderer
│   │   ├── staff.js                # Faculty Coordinator requests & response handling
│   │   ├── student.js              # Student Volunteer duty acceptance & OD tracking
│   │   ├── notifications.js        # In-app notification center & unread counter
│   │   └── data.js                 # Campus seed datasets & offline state store
│   ├── pages/
│   │   ├── admin-dashboard.html    # Admin Event Command Center
│   │   ├── event-form.html         # Autonomous AI Event Planner Form
│   │   ├── staff-dashboard.html    # Faculty Staff Coordinator Dashboard
│   │   └── student-dashboard.html  # Student Volunteer Dashboard
│   └── assets/
│       └── images/
├── UI/
│   ├── verify_data.py              # Schema contract & test validation engine
│   ├── users.json                  # 96 Users (1 Admin, 15 Staff, 80 Students)
│   ├── staff.json                  # 15 Faculty Staff profiles
│   ├── students.json               # 80 Student profiles & OD eligibility
│   ├── venues.json                 # 8 Campus Venues & capacities
│   ├── resources.json              # 12 Equipment & logistics resources
│   ├── rules.json                  # 12 Campus statutes & RAG policy texts
│   ├── events.json                 # Dynamic event workflow state records
│   └── responses.json              # Standardized YES/NO response store
└── AGENTIC AI/
    ├── main_agent/                 # MainAgent orchestrator
    ├── people_agent/               # PeopleAgent (Faculty coordinators & student volunteers)
    ├── resource_agent/             # ResourceAgent (Venue selection & equipment inventory)
    ├── review_agent/               # ReviewAgent (12-rule compliance & failure detection)
    ├── tools/                      # Concrete tools (venue, resource, people, compliance)
    ├── rag/                        # RAG Engine indexing rules.json with citations
    ├── memory/
    │   └── state/                  # EventStateManager preserving lifecycle states
    ├── server.py                   # FastAPI REST API Backend Server
    └── requirements.txt            # Python dependencies
```

---

## 🔑 Demo Login Credentials

All 96 users from `UI/users.json` are fully supported:

| Role | Registration ID | Password | Name / Designation |
| :--- | :--- | :--- | :--- |
| **Admin** | `ADM001` | `AdminPass#2026` | Dr. Aris Thorne (Chief Academic Administrator) |
| **Staff (CSE)** | `STF001` | `StaffPass#001` | Prof. Rajesh Raman (Computer Science & Eng.) |
| **Staff (ECE)** | `STF002` | `StaffPass#002` | Dr. Meenakshi Sundaram (Electronics & Comm.) |
| **Staff (IT)** | `STF004` | `StaffPass#004` | Dr. Ananya Deshmukh (Information Technology) |
| **Student** | `STU001` | `StudentPass#001` | Aarav Sharma (Year 3, CSE) |
| **Student** | `STU002` | `StudentPass#002` | Aditi Verma (Year 3, AI&DS) |
| **Student** | `STU003` | `StudentPass#003` | Advait Gupta (Year 3, ECE) |

---

## 🚀 How to Run the Application

### 1. Start the Agentic AI Backend (FastAPI)
```bash
# Navigate to AGENTIC AI folder
cd "AGENTIC AI"

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the FastAPI server on port 8000
python server.py
```
> The API server will be live at: **`http://localhost:8000`** (Interactive OpenAPI docs: **`http://localhost:8000/docs`**).

---

### 2. Start the Frontend Web Server
```bash
# Navigate to FRONTEND folder
cd FRONTEND

# Start local HTTP server on port 5500
python -m http.server 5500
```
> Open your web browser and navigate to: **`http://localhost:5500`**

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate user with `registration_id` and `password` |
| `GET` | `/api/users` | List all campus users |
| `GET` | `/api/staff` | List all faculty staff records |
| `GET` | `/api/students` | List student records (`?volunteers_only=true` filter) |
| `GET` | `/api/venues` | List campus venues with capacity & suitability tags |
| `GET` | `/api/resources` | List equipment inventory & rental costs |
| `GET` | `/api/rules` | List 12 campus statutes & RAG policy texts |
| `GET` | `/api/events` | List all events with live workflow states |
| `GET` | `/api/events/{id}` | Get complete event record with coordinators & compliance |
| `POST` | `/api/ai/plan-event` | **Trigger Main Agent Autonomous Planning Pipeline** |
| `POST` | `/api/events/{id}/staff-response` | Submit faculty coordinator response (`YES` / `NO`) |
| `POST` | `/api/events/{id}/student-response` | Submit student volunteer response (`YES` / `NO`, `STUDENT_INTEREST`) |
| `POST` | `/api/events/{id}/approve` | Transition event to `APPROVED` state |
| `POST` | `/api/events/{id}/publish` | Transition event to `PUBLISHED` state |
| `POST` | `/api/events/{id}/replan` | Re-run agent pipeline with adjusted constraints |
| `GET` | `/api/events/{id}/compliance` | Get rule compliance audit breakdown |
| `GET` | `/api/events/{id}/state` | Get current workflow state & pending requirements |
| `GET` | `/api/notifications` | Get in-app notifications for user (`?registration_id=...`) |
| `POST` | `/api/notifications/{id}/read` | Mark in-app notification as read |

---

## 📋 Data Contract Compliance (`UI/verify_data.py`)

- **Event Object Contract**:
  - `event_id`, `title`, `description`, `event_type`, `date`, `start_time`, `end_time`, `expected_attendees`, `budget`, `status`, `workflow_state`, `pending_requirements`, `identified_problems`, `failure_reasons`, `replan_count`, `last_agent_action`, `created_at`, `updated_at`.
- **Response Object Contract**:
  - `response_id`, `event_id`, `user_id`, `request_type` (`"STAFF_AVAILABILITY"` / `"STUDENT_INTEREST"`), `response` (strictly `"YES"` or `"NO"`), `status` (`"COMPLETED"`), `timestamp`.
- **12 Campus Policy Enforcement**:
  - Curfews (`RUL_TIME_001`), Venue Capacity (`RUL_VEN_001`), Budget Ceiling (`RUL_BUD_001`), Faculty Oversight (`RUL_STF_001`), 1:25 Volunteer Ratio (`RUL_VOL_001`), On-Duty Attendance (`RUL_ATT_001`), 72h Advance Resource Notice (`RUL_RES_001`), Acoustic Limits (`RUL_SND_001`), Campus Security (`RUL_SEC_001`), Green Protocol (`RUL_GRN_001`), Food Hygiene (`RUL_FOD_001`), 2-Hour Cleanup Audit (`RUL_CLN_001`).
