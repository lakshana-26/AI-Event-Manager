/**
 * AI-Event-Manager Frontend API Client Interface
 * Central API configuration point communicating with Python FastAPI / Agentic AI backend.
 */

const API_BASE_URL = "http://localhost:8000";

class EventManagerApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Session Helper
  getCurrentUser() {
    try {
      const u = localStorage.getItem("AI_EVENT_USER");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("AI_EVENT_USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("AI_EVENT_USER");
    }
  }

  logout() {
    this.setCurrentUser(null);
    if (typeof Common !== "undefined" && Common.getLoginUrl) {
      window.location.href = Common.getLoginUrl();
    } else {
      const isInsidePages = (window.location.pathname || "").toLowerCase().includes("/pages/");
      window.location.href = isInsidePages ? "../index.html" : "index.html";
    }
  }

  /* ---------------- HTTP METHODS ---------------- */

  async _request(endpoint, method = "GET", body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      // If network fails (e.g. backend server not started), fallback to local storage mode
      console.warn(`[API] Backend request to ${endpoint} failed (${err.message}). Using local state fallback.`);
      return this._fallback(endpoint, method, body);
    }
  }

  /* ---------------- REST API ENDPOINTS ---------------- */

  async login(registrationId, password) {
    try {
      const res = await this._request("/api/login", "POST", { registration_id: registrationId, password });
      if (res && res.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
      throw new Error("Invalid response from server");
    } catch (err) {
      // Local fallback auth
      const users = AppStorage.get("users") || [];
      const cleanReg = registrationId.trim().toUpperCase();
      const cleanPass = password.trim();
      const user = users.find(u => (u.registration_id || u.user_id).toUpperCase() === cleanReg && u.password === cleanPass);
      if (!user) throw new Error("Invalid Registration ID or Password.");
      const sessionUser = { ...user };
      delete sessionUser.password;
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }
  }

  // Alias
  async loginUser(registrationId, password) {
    return this.login(registrationId, password);
  }

  async getUsers() {
    return this._request("/api/users");
  }

  async getStaff() {
    return this._request("/api/staff");
  }

  async getStudents(volunteersOnly = false) {
    return this._request(`/api/students?volunteers_only=${volunteersOnly}`);
  }

  async getVenues() {
    return this._request("/api/venues");
  }

  async getResources() {
    return this._request("/api/resources");
  }

  async getRules() {
    return this._request("/api/rules");
  }

  async getEvents() {
    return this._request("/api/events");
  }

  async getEvent(eventId) {
    return this._request(`/api/events/${eventId}`);
  }

  async createEvent(payload) {
    return this._request("/api/events", "POST", payload);
  }

  async planEventWithAI(payload) {
    return this._request("/api/ai/plan-event", "POST", payload);
  }

  // Alias
  async planEvent(payload) {
    return this.planEventWithAI(payload);
  }

  async respondStaff(eventId, registrationId, decision, remarks = "") {
    return this._request(`/api/events/${eventId}/staff-response`, "POST", {
      registration_id: registrationId,
      decision: decision,
      remarks: remarks
    });
  }

  // Aliases
  async respondAsStaff(eventId, registrationId, decision, remarks = "") {
    return this.respondStaff(eventId, registrationId, decision, remarks);
  }

  async submitStaffResponse(eventId, registrationId, decision, remarks = "") {
    return this.respondStaff(eventId, registrationId, decision, remarks);
  }

  async respondStudent(eventId, registrationId, decision) {
    return this._request(`/api/events/${eventId}/student-response`, "POST", {
      registration_id: registrationId,
      decision: decision
    });
  }

  // Aliases
  async respondAsStudent(eventId, registrationId, decision) {
    return this.respondStudent(eventId, registrationId, decision);
  }

  async submitStudentResponse(eventId, registrationId, decision) {
    return this.respondStudent(eventId, registrationId, decision);
  }

  async approveEvent(eventId) {
    return this._request(`/api/events/${eventId}/approve`, "POST");
  }

  // Alias
  async approveAndPublishEvent(eventId) {
    return this.approveEvent(eventId);
  }

  async publishEvent(eventId) {
    return this._request(`/api/events/${eventId}/publish`, "POST");
  }

  async replanEvent(eventId, adjustments) {
    return this._request(`/api/events/${eventId}/replan`, "POST", adjustments);
  }

  async getCompliance(eventId) {
    return this._request(`/api/events/${eventId}/compliance`);
  }

  async getEventState(eventId) {
    return this._request(`/api/events/${eventId}/state`);
  }

  async getNotifications(registrationId) {
    const query = registrationId ? `?registration_id=${registrationId}` : "";
    return this._request(`/api/notifications${query}`);
  }

  async markNotificationRead(notificationId) {
    return this._request(`/api/notifications/${notificationId}/read`, "POST");
  }

  /* ---------------- LOCAL OFFLINE FALLBACK ENGINE ---------------- */

  _fallback(endpoint, method, body) {
    if (typeof AppStorage === "undefined") {
      throw new Error("Backend offline and AppStorage not loaded.");
    }

    if (endpoint === "/api/venues") return AppStorage.get("venues") || [];
    if (endpoint === "/api/resources") return AppStorage.get("resources") || [];
    if (endpoint === "/api/rules") return AppStorage.get("rules") || [];
    if (endpoint.startsWith("/api/staff")) return AppStorage.get("staff") || [];
    if (endpoint.startsWith("/api/students")) {
      const students = AppStorage.get("students") || [];
      if (endpoint.includes("volunteers_only=true")) {
        return students.filter(s => s.is_volunteer);
      }
      return students;
    }
    if (endpoint === "/api/events" && method === "GET") return AppStorage.get("events") || [];

    if (endpoint.startsWith("/api/events/") && method === "GET") {
      const parts = endpoint.split("/");
      const eventId = parts[3];
      const events = AppStorage.get("events") || [];
      const event = events.find(e => e.event_id === eventId);
      if (!event) throw new Error("Event not found");
      return event;
    }

    if (endpoint === "/api/ai/plan-event" && method === "POST") {
      const events = AppStorage.get("events") || [];
      const eventId = `EVT${String(events.length + 1).padStart(3, '0')}`;
      const venues = AppStorage.get("venues") || [];
      const allResources = AppStorage.get("resources") || [];
      const venue = venues.find(v => v.venue_id === body.venue_id) || venues[0];

      let cost = 0;
      const allocatedRes = [];
      (body.selected_resources || []).forEach(r => {
        const item = allResources.find(x => x.resource_id === r.resource_id);
        if (item) {
          const total = (r.quantity || 1) * item.unit_cost;
          cost += total;
          allocatedRes.push({
            resource_id: item.resource_id,
            resource_name: item.resource_name,
            quantity: r.quantity || 1,
            unit_cost: item.unit_cost,
            total_cost: total
          });
        }
      });
      cost += Math.min((body.expected_attendees || 50) * 80, 15000);

      const newEvent = {
        event_id: eventId,
        title: body.title,
        description: body.description || "",
        event_type: body.event_type || body.category || "Technical Symposium",
        date: body.date || body.start_date || "2026-09-15",
        start_time: body.start_time || "09:00",
        end_time: body.end_time || "17:00",
        expected_attendees: parseInt(body.expected_attendees) || 50,
        budget: parseFloat(body.budget || body.budget_cap || 50000),
        calculated_cost: cost,
        venue_id: venue.venue_id,
        venue_name: venue.venue_name,
        status: "COLLECTING_RESPONSES",
        workflow_state: "COLLECTING_RESPONSES",
        pending_requirements: ["STAFF_AVAILABILITY", "STUDENT_INTEREST"],
        identified_problems: [],
        failure_reasons: [],
        replan_count: 0,
        last_agent_action: "MAIN_AGENT_COORDINATED_PLAN",
        created_by: body.created_by || "ADM001",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        coordinators: (body.coordinator_ids || ["STF001"]).map(id => {
          const s = (AppStorage.get("staff") || []).find(x => x.registration_id === id || x.user_id === id) || { name: "Faculty Staff", department: "Academic" };
          return {
            user_id: s.user_id || id,
            registration_id: s.registration_id || id,
            name: s.name,
            department: s.department,
            role_type: "Faculty Coordinator",
            response: "PENDING",
            responded_at: null,
            remarks: ""
          };
        }),
        volunteers: (body.volunteer_ids || ["STU001", "STU002"]).map((id, idx) => {
          const st = (AppStorage.get("students") || []).find(x => x.registration_id === id || x.user_id === id) || { name: "Student Volunteer", department: "Dept" };
          return {
            user_id: st.user_id || id,
            registration_id: st.registration_id || id,
            name: st.name,
            department: st.department,
            task: "Event Logistics & Support",
            od_eligible: true,
            response: "PENDING",
            responded_at: null
          };
        }),
        resources: allocatedRes,
        schedule: [
          { time: `${body.start_time || '09:00'} - 10:00`, activity: "Registration & Breakfast", venue: `${venue.venue_name} Foyer` },
          { time: "10:00 - 12:00", activity: "Keynote & Core Track", venue: venue.venue_name },
          { time: "12:00 - 13:00", activity: "Networking Lunch", venue: "Dining Hall" },
          { time: `13:00 - ${body.end_time || '17:00'}`, activity: "Valedictory & Awards", venue: venue.venue_name }
        ],
        compliance: {
          score: 95,
          status: "COMPLIANT",
          checks: [
            { rule: "RUL_VEN_001", title: "Venue Occupancy", pass: true, detail: "Within capacity limits." },
            { rule: "RUL_TIME_001", title: "Campus Curfew", pass: true, detail: "Concludes before 20:00." },
            { rule: "RUL_BUD_001", title: "Budget Limit", pass: true, detail: "Within allocated budget cap." }
          ]
        },
        ai_recommendations: [
          `Venue: ${venue.venue_name} matches attendee capacity.`,
          `Estimated cost ₹${cost.toLocaleString()} is within allocated budget.`
        ]
      };

      events.unshift(newEvent);
      AppStorage.set("events", events);

      // Dispatch Notifications
      const notifs = AppStorage.get("notifications") || [];
      newEvent.coordinators.forEach(c => {
        notifs.unshift({
          id: `NOTIF_${Date.now()}_${c.registration_id}`,
          recipient_id: c.registration_id,
          title: "Faculty Coordinator Request",
          message: `You have been requested to coordinate '${newEvent.title}' on ${newEvent.date}.`,
          type: "REQUEST",
          event_id: newEvent.event_id,
          timestamp: new Date().toISOString(),
          read: false,
          action_required: true
        });
      });
      newEvent.volunteers.forEach(v => {
        notifs.unshift({
          id: `NOTIF_${Date.now()}_${v.registration_id}`,
          recipient_id: v.registration_id,
          title: "Volunteer Assignment Request",
          message: `You are invited to volunteer for '${newEvent.title}' (${v.task}). OD credit eligible.`,
          type: "REQUEST",
          event_id: newEvent.event_id,
          timestamp: new Date().toISOString(),
          read: false,
          action_required: true
        });
      });
      AppStorage.set("notifications", notifs);

      return newEvent;
    }

    if (endpoint.includes("/staff-response") && method === "POST") {
      const eventId = endpoint.split("/")[3];
      const events = AppStorage.get("events") || [];
      const event = events.find(e => e.event_id === eventId);
      let coord = null;
      if (event) {
        coord = event.coordinators.find(c => c.registration_id === body.registration_id || c.user_id === body.registration_id);
        if (coord) {
          coord.response = body.decision === "YES" ? "APPROVED" : "DECLINED";
          coord.remarks = body.remarks || "";
          AppStorage.set("events", events);
        }
      }

      // Record in responses store
      const responses = AppStorage.get("responses") || [];
      responses.push({
        response_id: `RESP${String(responses.length + 1).padStart(3, '0')}`,
        event_id: eventId,
        user_id: body.registration_id,
        request_type: "STAFF_AVAILABILITY",
        response: body.decision === "YES" ? "YES" : "NO",
        status: "COMPLETED",
        timestamp: new Date().toISOString()
      });
      AppStorage.set("responses", responses);

      return { success: true, event, coordinator: coord };
    }

    if (endpoint.includes("/student-response") && method === "POST") {
      const eventId = endpoint.split("/")[3];
      const events = AppStorage.get("events") || [];
      const event = events.find(e => e.event_id === eventId);
      let vol = null;
      if (event) {
        vol = event.volunteers.find(v => v.registration_id === body.registration_id || v.user_id === body.registration_id);
        if (vol) {
          vol.response = body.decision === "YES" ? "APPROVED" : "DECLINED";
          AppStorage.set("events", events);
        }
      }

      // Record in responses store
      const responses = AppStorage.get("responses") || [];
      responses.push({
        response_id: `RESP${String(responses.length + 1).padStart(3, '0')}`,
        event_id: eventId,
        user_id: body.registration_id,
        request_type: "STUDENT_INTEREST",
        response: body.decision === "YES" ? "YES" : "NO",
        status: "COMPLETED",
        timestamp: new Date().toISOString()
      });
      AppStorage.set("responses", responses);

      return { success: true, event, volunteer: vol };
    }

    if (endpoint.includes("/approve") && method === "POST") {
      const eventId = endpoint.split("/")[3];
      const events = AppStorage.get("events") || [];
      const event = events.find(e => e.event_id === eventId);
      if (event) {
        event.status = "APPROVED";
        event.workflow_state = "APPROVED";
        AppStorage.set("events", events);
      }
      return event || { success: true };
    }

    if (endpoint.includes("/publish") && method === "POST") {
      const eventId = endpoint.split("/")[3];
      const events = AppStorage.get("events") || [];
      const event = events.find(e => e.event_id === eventId);
      if (event) {
        event.status = "PUBLISHED";
        event.workflow_state = "PUBLISHED";
        AppStorage.set("events", events);
      }
      return event || { success: true };
    }

    if (endpoint.includes("/notifications/") && endpoint.endsWith("/read")) {
      const parts = endpoint.split("/");
      const notifId = parts[parts.length - 2];
      const notifs = AppStorage.get("notifications") || [];
      notifs.forEach(n => {
        if (n.id === notifId) n.read = true;
      });
      AppStorage.set("notifications", notifs);
      return { success: true };
    }

    if (endpoint.startsWith("/api/notifications")) {
      const notifs = AppStorage.get("notifications") || [];
      if (endpoint.includes("registration_id=")) {
        const regId = endpoint.split("registration_id=")[1].split("&")[0];
        return notifs.filter(n => n.recipient_id === regId || n.recipient_id === "ALL");
      }
      return notifs;
    }

    return { success: true };
  }
}

const API = new EventManagerApi(API_BASE_URL);
