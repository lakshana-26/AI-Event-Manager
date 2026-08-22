/**
 * AI-Event-Manager Main Application Controller
 * Pure Vanilla JavaScript (ES6+) - Single Page Architecture
 */

document.addEventListener("DOMContentLoaded", async () => {
  App.init();
});

const App = {
  currentUser: null,
  activeView: "auth-view",
  currentEventDetailId: null,

  async init() {
    // Check existing session
    this.currentUser = API.getCurrentUser();
    
    // Bind global DOM listeners
    this.bindEvents();

    if (this.currentUser) {
      this.routeToRole(this.currentUser.role);
    } else {
      this.showView("auth-view");
    }

    // Refresh notifications count periodically
    this.updateNotificationBadge();
  },

  /* ---------------- EVENT LISTENERS & DOM BINDINGS ---------------- */

  bindEvents() {
    // Auth Form Submit
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Logout Action
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }

    // Quick Demo Credentials Picker
    document.querySelectorAll(".demo-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        const regId = e.currentTarget.dataset.regid;
        const pass = e.currentTarget.dataset.pass;
        document.getElementById("login-reg-id").value = regId;
        document.getElementById("login-password").value = pass;
        this.showToast(`Auto-filled credentials for ${regId}`, "info");
      });
    });

    // Notification Bell Toggle
    const notifBell = document.getElementById("notif-bell-btn");
    const notifDropdown = document.getElementById("notif-dropdown");
    if (notifBell && notifDropdown) {
      notifBell.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("show");
        if (notifDropdown.classList.contains("show")) {
          this.renderNotificationList();
        }
      });

      document.addEventListener("click", (e) => {
        if (!notifDropdown.contains(e.target) && !notifBell.contains(e.target)) {
          notifDropdown.classList.remove("show");
        }
      });
    }

    // Mark All Read
    const markAllReadBtn = document.getElementById("mark-all-read-btn");
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", async () => {
        if (this.currentUser) {
          await API.markAllNotificationsRead(this.currentUser.registration_id);
          this.renderNotificationList();
          this.updateNotificationBadge();
          this.showToast("All notifications marked as read", "info");
        }
      });
    }

    // Admin Event Form Planner
    const eventForm = document.getElementById("plan-event-form");
    if (eventForm) {
      eventForm.addEventListener("submit", (e) => this.handlePlanEvent(e));
    }

    // Reset Data Helper Button
    const resetDataBtn = document.getElementById("reset-data-btn");
    if (resetDataBtn) {
      resetDataBtn.addEventListener("click", () => {
        if (confirm("Reset all local events and responses back to default campus seed data?")) {
          AppStorage.resetAll();
          this.showToast("Local data reset successfully!", "success");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }

    // Close Modals
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
      });
    });
  },

  /* ---------------- VIEW ROUTING & NAVIGATION ---------------- */

  showView(viewId) {
    document.querySelectorAll(".view-section").forEach(view => {
      view.classList.add("hidden");
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.remove("hidden");
      this.activeView = viewId;
    }

    // Update navbar user profile pill
    const userPill = document.getElementById("nav-user-pill");
    const navActions = document.getElementById("nav-actions");

    if (this.currentUser && viewId !== "auth-view") {
      userPill.classList.remove("hidden");
      navActions.classList.remove("hidden");
      document.getElementById("nav-user-name").textContent = this.currentUser.name;
      document.getElementById("nav-user-role").textContent = this.currentUser.role.toUpperCase();
      document.getElementById("nav-user-avatar").textContent = this.currentUser.name.charAt(0);
      this.updateNotificationBadge();
    } else {
      userPill.classList.add("hidden");
      navActions.classList.add("hidden");
    }
  },

  routeToRole(role) {
    if (role === "admin") {
      this.showView("admin-dashboard-view");
      this.loadAdminDashboard();
    } else if (role === "staff") {
      this.showView("staff-dashboard-view");
      this.loadStaffDashboard();
    } else if (role === "student") {
      this.showView("student-dashboard-view");
      this.loadStudentDashboard();
    } else {
      this.showView("auth-view");
    }
  },

  /* ---------------- AUTHENTICATION HANDLERS ---------------- */

  async handleLogin(e) {
    e.preventDefault();
    const regId = document.getElementById("login-reg-id").value;
    const pass = document.getElementById("login-password").value;
    const submitBtn = document.getElementById("login-submit-btn");

    if (!regId || !pass) {
      this.showToast("Please enter both Registration ID and Password", "warning");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Authenticating...</span>";

      const user = await API.login(regId, pass);
      this.currentUser = user;
      this.showToast(`Welcome back, ${user.name}!`, "success");
      
      this.routeToRole(user.role);
    } catch (err) {
      this.showToast(err.message || "Authentication failed", "danger");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<span>Sign In</span>";
    }
  },

  handleLogout() {
    API.logout();
    this.currentUser = null;
    this.showToast("Signed out successfully", "info");
    this.showView("auth-view");
  },

  /* ---------------- ADMIN DASHBOARD ---------------- */

  async loadAdminDashboard() {
    // Populate stats
    const stats = await API.getSystemOverview();
    document.getElementById("stat-active-events").textContent = stats.activeEvents;
    document.getElementById("stat-venues-booked").textContent = stats.totalVenues;
    document.getElementById("stat-total-staff").textContent = stats.totalStaff;
    document.getElementById("stat-total-volunteers").textContent = stats.totalVolunteers;

    // Load Venues into Dropdown
    const venues = await API.getVenues();
    const venueSelect = document.getElementById("event-venue-select");
    if (venueSelect) {
      venueSelect.innerHTML = venues.map(v => 
        `<option value="${v.venue_id}">${v.venue_name} (Max Capacity: ${v.capacity})</option>`
      ).join("");
    }

    // Load Resources List with Qty Controls
    const resources = await API.getResources();
    const resourcesContainer = document.getElementById("planner-resources-list");
    if (resourcesContainer) {
      resourcesContainer.innerHTML = resources.map(r => `
        <div class="resource-row">
          <div>
            <div class="font-semibold text-sm">${r.resource_name}</div>
            <div class="text-xs text-muted">₹${r.unit_cost.toLocaleString()} / unit · ${r.category}</div>
          </div>
          <div class="flex items-center gap-2">
            <input type="number" class="qty-input resource-qty-input" data-resid="${r.resource_id}" min="0" max="${r.available_quantity}" value="0" />
            <span class="text-xs text-muted">/ ${r.available_quantity}</span>
          </div>
        </div>
      `).join("");
    }

    // Load Faculty Coordinators Picker Checkboxes
    const staffList = await API.getStaffList();
    const staffContainer = document.getElementById("planner-coordinators-list");
    if (staffContainer) {
      staffContainer.innerHTML = staffList.map((s, idx) => `
        <label class="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer text-sm">
          <input type="checkbox" name="coord-checkbox" value="${s.registration_id}" ${idx === 0 ? 'checked' : ''} />
          <div>
            <span class="font-semibold">${s.name}</span>
            <span class="text-xs text-muted block">${s.designation} · ${s.department}</span>
          </div>
        </label>
      `).join("");
    }

    // Load Student Volunteers Picker Checkboxes
    const volunteersList = await API.getStudentVolunteers();
    const volContainer = document.getElementById("planner-volunteers-list");
    if (volContainer) {
      volContainer.innerHTML = volunteersList.map((v, idx) => `
        <label class="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer text-sm">
          <input type="checkbox" name="vol-checkbox" value="${v.registration_id}" ${idx < 3 ? 'checked' : ''} />
          <div>
            <span class="font-semibold">${v.name} (${v.registration_id})</span>
            <span class="text-xs text-muted block">Year ${v.year_of_study} ${v.department} · OD Eligible (${v.attendance_pct || 85}%)</span>
          </div>
        </label>
      `).join("");
    }

    // Load Recent Events Table
    this.renderAdminEventsTable();
  },

  async renderAdminEventsTable() {
    const events = await API.getEvents();
    const tableBody = document.getElementById("admin-events-tbody");
    if (!tableBody) return;

    if (events.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-6">No events created yet. Use the planner on the left to schedule an event.</td></tr>`;
      return;
    }

    tableBody.innerHTML = events.map(evt => {
      let statusBadge = `<span class="badge badge-warning">Collecting Responses</span>`;
      if (evt.status === "APPROVED" || evt.workflow_state === "APPROVED") statusBadge = `<span class="badge badge-success">Approved</span>`;
      else if (evt.status === "RE_PLANNING" || evt.workflow_state === "RE_PLANNING") statusBadge = `<span class="badge badge-danger">Re-Planning</span>`;

      const approvedCoords = evt.coordinators.filter(c => c.response === "APPROVED").length;
      const totalCoords = evt.coordinators.length;

      const approvedVols = evt.volunteers.filter(v => v.response === "APPROVED").length;
      const totalVols = evt.volunteers.length;

      return `
        <tr>
          <td>
            <div class="font-bold text-white">${evt.title}</div>
            <div class="text-xs text-muted">${evt.category} · ${evt.event_id}</div>
          </td>
          <td>
            <div class="text-sm">${evt.venue_name}</div>
            <div class="text-xs text-muted">${evt.expected_attendees} Expected Attendees</div>
          </td>
          <td>
            <div class="text-sm">${evt.start_date}</div>
            <div class="text-xs text-muted">${evt.start_time} - ${evt.end_time}</div>
          </td>
          <td>
            <div class="text-xs">
              <span class="text-success font-semibold">Faculty: ${approvedCoords}/${totalCoords}</span> · 
              <span class="text-primary font-semibold">Volunteers: ${approvedVols}/${totalVols}</span>
            </div>
            <div class="text-xs text-muted">₹${(evt.calculated_cost || 0).toLocaleString()} (Cap: ₹${(evt.budget_cap || 0).toLocaleString()})</div>
          </td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-outline view-event-btn" data-eventid="${evt.event_id}">
              <span>View Plan</span>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Bind event detail buttons
    document.querySelectorAll(".view-event-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const eventId = e.currentTarget.dataset.eventid;
        this.openEventPlanView(eventId);
      });
    });
  },

  async handlePlanEvent(e) {
    e.preventDefault();
    const title = document.getElementById("event-title").value.trim();
    const category = document.getElementById("event-category").value;
    const department = document.getElementById("event-department").value.trim();
    const description = document.getElementById("event-description").value.trim();
    const expectedAttendees = parseInt(document.getElementById("event-attendees").value) || 50;
    const startDate = document.getElementById("event-start-date").value;
    const startTime = document.getElementById("event-start-time").value;
    const endDate = document.getElementById("event-end-date").value || startDate;
    const endTime = document.getElementById("event-end-time").value;
    const venueId = document.getElementById("event-venue-select").value;
    const budgetCap = parseFloat(document.getElementById("event-budget").value) || 50000;

    if (!title || !startDate || !startTime || !endTime) {
      this.showToast("Please fill in the required event details.", "warning");
      return;
    }

    // Collect selected resources
    const selectedResources = [];
    document.querySelectorAll(".resource-qty-input").forEach(input => {
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        selectedResources.push({
          resource_id: input.dataset.resid,
          quantity: qty
        });
      }
    });

    // Collect chosen staff
    const coordinatorIds = Array.from(document.querySelectorAll("input[name='coord-checkbox']:checked")).map(cb => cb.value);
    const volunteerIds = Array.from(document.querySelectorAll("input[name='vol-checkbox']:checked")).map(cb => cb.value);

    const payload = {
      title,
      category,
      department,
      description,
      expected_attendees: expectedAttendees,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      venue_id: venueId,
      budget_cap: budgetCap,
      selected_resources: selectedResources,
      coordinator_ids: coordinatorIds,
      volunteer_ids: volunteerIds,
      created_by: this.currentUser ? this.currentUser.user_id : "ADM001"
    };

    const submitBtn = document.getElementById("plan-event-submit-btn");
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>AI Agent Optimizing & Planning...</span>";

      const createdEvent = await API.planEvent(payload);
      this.showToast("Event planned successfully by AI Engine!", "success");
      
      // Reset form
      document.getElementById("plan-event-form").reset();
      
      // Open the generated plan overview
      this.openEventPlanView(createdEvent.event_id);
    } catch (err) {
      this.showToast(err.message || "Failed to plan event", "danger");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<span>⚡ Plan Event with AI</span>";
    }
  },

  /* ---------------- EVENT FINAL RESULT / PLAN OVERVIEW VIEW ---------------- */

  async openEventPlanView(eventId) {
    try {
      const event = await API.getEventById(eventId);
      this.currentEventDetailId = eventId;

      this.showView("event-plan-result-view");

      // Populate Hero Banner
      document.getElementById("plan-title").textContent = event.title;
      document.getElementById("plan-category").textContent = event.category || event.event_type;
      document.getElementById("plan-event-id").textContent = event.event_id;
      document.getElementById("plan-department").textContent = event.department;
      document.getElementById("plan-description").textContent = event.description;

      let statusBadge = `<span class="badge badge-warning">Collecting Responses</span>`;
      if (event.status === "APPROVED" || event.workflow_state === "APPROVED") statusBadge = `<span class="badge badge-success">Approved & Sanctioned</span>`;
      else if (event.status === "RE_PLANNING" || event.workflow_state === "RE_PLANNING") statusBadge = `<span class="badge badge-danger">Re-Planning</span>`;
      document.getElementById("plan-status-badge").innerHTML = statusBadge;

      // Meta Stats
      document.getElementById("plan-meta-venue").textContent = event.venue_name;
      document.getElementById("plan-meta-datetime").textContent = `${event.start_date} (${event.start_time} - ${event.end_time})`;
      document.getElementById("plan-meta-attendees").textContent = `${event.expected_attendees} Pax`;
      document.getElementById("plan-meta-cost").textContent = `₹${(event.calculated_cost || 0).toLocaleString()} / ₹${(event.budget_cap || 0).toLocaleString()}`;

      // Compliance Gauge & Checks
      const comp = event.compliance || { score: 95, status: "COMPLIANT", checks: [] };
      document.getElementById("plan-compliance-score").textContent = `${comp.score}%`;
      const compContainer = document.getElementById("plan-compliance-checks");
      compContainer.innerHTML = (comp.checks || []).map(chk => `
        <div class="check-item">
          <span class="check-icon ${chk.pass ? 'text-success' : 'text-danger'}">${chk.pass ? '✓' : '⚠️'}</span>
          <div>
            <div class="font-semibold text-sm ${chk.pass ? 'text-white' : 'text-danger'}">${chk.title}</div>
            <div class="text-xs text-muted">${chk.detail}</div>
          </div>
        </div>
      `).join("");

      // AI Recommendations
      const aiRecs = document.getElementById("plan-ai-recommendations");
      aiRecs.innerHTML = (event.ai_recommendations || []).map(r => `
        <li class="flex items-start gap-2 text-sm text-muted mb-2">
          <span class="text-primary font-bold">✦</span>
          <span>${r}</span>
        </li>
      `).join("");

      // Resources Table
      const resContainer = document.getElementById("plan-resources-list");
      if ((event.resources || []).length === 0) {
        resContainer.innerHTML = `<div class="text-xs text-muted py-2">No special AV resources requested.</div>`;
      } else {
        resContainer.innerHTML = event.resources.map(r => `
          <div class="flex justify-between items-center py-2 border-b border-white/5 text-sm">
            <div>
              <span class="text-white font-medium">${r.resource_name}</span>
              <span class="text-xs text-muted block">Qty: ${r.quantity} × ₹${r.unit_cost.toLocaleString()}</span>
            </div>
            <span class="font-semibold text-white">₹${r.total_cost.toLocaleString()}</span>
          </div>
        `).join("");
      }

      // Schedule Timeline
      const scheduleContainer = document.getElementById("plan-schedule-timeline");
      scheduleContainer.innerHTML = (event.schedule || []).map(s => `
        <div class="timeline-node">
          <div class="text-xs font-bold text-primary">${s.time}</div>
          <div class="font-semibold text-sm text-white">${s.activity}</div>
          <div class="text-xs text-muted">📍 ${s.venue}</div>
        </div>
      `).join("");

      // Faculty Coordinator Roster
      const coordContainer = document.getElementById("plan-coordinators-roster");
      coordContainer.innerHTML = (event.coordinators || []).map(c => {
        let badge = `<span class="badge badge-warning">Pending</span>`;
        if (c.response === "APPROVED") badge = `<span class="badge badge-success">Approved (YES)</span>`;
        else if (c.response === "DECLINED") badge = `<span class="badge badge-danger">Declined (NO)</span>`;

        return `
          <div class="roster-chip">
            <div>
              <div class="font-semibold text-sm text-white">${c.name}</div>
              <div class="text-xs text-muted">${c.department} · ${c.role_type}</div>
              ${c.remarks ? `<div class="text-xs text-subtle italic mt-1">"${c.remarks}"</div>` : ''}
            </div>
            <div>${badge}</div>
          </div>
        `;
      }).join("");

      // Student Volunteer Roster
      const volContainer = document.getElementById("plan-volunteers-roster");
      volContainer.innerHTML = (event.volunteers || []).map(v => {
        let badge = `<span class="badge badge-warning">Pending</span>`;
        if (v.response === "APPROVED") badge = `<span class="badge badge-success">Confirmed (YES)</span>`;
        else if (v.response === "DECLINED") badge = `<span class="badge badge-danger">Declined (NO)</span>`;

        return `
          <div class="roster-chip">
            <div>
              <div class="font-semibold text-sm text-white">${v.name} (${v.department})</div>
              <div class="text-xs text-muted">Task: ${v.task}</div>
            </div>
            <div>${badge}</div>
          </div>
        `;
      }).join("");

      // Bind Final Action Buttons
      const approveBtn = document.getElementById("plan-approve-btn");
      if (approveBtn) {
        approveBtn.onclick = async () => {
          if (confirm(`Officially sanction and publish '${event.title}'?`)) {
            await API.approveAndPublishEvent(event.event_id);
            this.showToast("Event officially sanctioned and published!", "success");
            this.openEventPlanView(event.event_id);
          }
        };
      }

      const replanBtn = document.getElementById("plan-replan-btn");
      if (replanBtn) {
        replanBtn.onclick = () => {
          this.openReplanModal(event);
        };
      }

      const backBtn = document.getElementById("plan-back-btn");
      if (backBtn) {
        backBtn.onclick = () => {
          if (this.currentUser) this.routeToRole(this.currentUser.role);
          else this.showView("auth-view");
        };
      }

    } catch (err) {
      this.showToast(err.message || "Failed to load event plan", "danger");
    }
  },

  openReplanModal(event) {
    const modal = document.getElementById("replan-modal");
    if (!modal) return;

    document.getElementById("replan-event-title").textContent = event.title;
    document.getElementById("replan-budget").value = event.budget_cap;
    document.getElementById("replan-attendees").value = event.expected_attendees;

    const replanForm = document.getElementById("replan-form");
    replanForm.onsubmit = async (e) => {
      e.preventDefault();
      const newBudget = document.getElementById("replan-budget").value;
      const newAttendees = document.getElementById("replan-attendees").value;

      try {
        await API.replanEvent(event.event_id, {
          budget_cap: newBudget,
          expected_attendees: newAttendees
        });
        modal.classList.add("hidden");
        this.showToast("Event re-planned and updated successfully!", "success");
        this.openEventPlanView(event.event_id);
      } catch (err) {
        this.showToast(err.message || "Failed to re-plan", "danger");
      }
    };

    modal.classList.remove("hidden");
  },

  /* ---------------- STAFF DASHBOARD ---------------- */

  async loadStaffDashboard() {
    if (!this.currentUser) return;
    const staff = this.currentUser;

    document.getElementById("staff-profile-name").textContent = staff.name;
    document.getElementById("staff-profile-dept").textContent = `${staff.designation || 'Faculty Coordinator'} · ${staff.department}`;
    document.getElementById("staff-profile-room").textContent = staff.office_room || "Academic Block";
    document.getElementById("staff-profile-spec").textContent = staff.specialization || "General Coordination";

    // Load Coordinator Event Requests
    const events = await API.getEvents();
    const pendingRequests = [];
    const coordinatedEvents = [];

    events.forEach(evt => {
      const myCoord = (evt.coordinators || []).find(c => c.registration_id === staff.registration_id || c.user_id === staff.user_id);
      if (myCoord) {
        if (myCoord.response === "PENDING") {
          pendingRequests.push({ event: evt, coordinator: myCoord });
        } else {
          coordinatedEvents.push({ event: evt, coordinator: myCoord });
        }
      }
    });

    // Render Pending Requests
    const pendingContainer = document.getElementById("staff-pending-requests");
    if (pendingRequests.length === 0) {
      pendingContainer.innerHTML = `
        <div class="card p-6 text-center text-muted">
          <div class="text-2xl mb-2">🎉</div>
          <div>No pending coordinator requests at this time.</div>
        </div>
      `;
    } else {
      pendingContainer.innerHTML = pendingRequests.map(req => `
        <div class="request-card pending">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="badge badge-warning mb-1">Response Required</span>
              <h3 class="text-lg font-bold text-white">${req.event.title}</h3>
              <p class="text-xs text-muted">${req.event.category} · Scheduled: ${req.event.start_date} (${req.event.start_time} - ${req.event.end_time})</p>
            </div>
            <span class="text-sm font-semibold text-primary">📍 ${req.event.venue_name}</span>
          </div>
          
          <p class="text-sm text-muted mb-3">${req.event.description}</p>
          
          <div class="bg-input p-3 rounded-md mb-3 text-xs flex justify-between">
            <span><strong>Role Assigned:</strong> ${req.coordinator.role_type}</span>
            <span><strong>Expected Pax:</strong> ${req.event.expected_attendees}</span>
            <span><strong>Budget:</strong> ₹${(req.event.calculated_cost || 0).toLocaleString()}</span>
          </div>

          <div class="request-actions">
            <button class="btn btn-success btn-sm staff-yes-btn" data-eventid="${req.event.event_id}">
              <span>✓ YES, Accept Coordination</span>
            </button>
            <button class="btn btn-danger btn-sm staff-no-btn" data-eventid="${req.event.event_id}">
              <span>✕ NO, Decline Request</span>
            </button>
            <button class="btn btn-outline btn-sm view-event-btn" data-eventid="${req.event.event_id}">
              <span>View Full AI Plan</span>
            </button>
          </div>
        </div>
      `).join("");
    }

    // Render Coordinated Events History
    const historyContainer = document.getElementById("staff-coordinated-events");
    if (coordinatedEvents.length === 0) {
      historyContainer.innerHTML = `
        <div class="card p-6 text-center text-muted">
          <div>No accepted events yet. Pending requests will appear above.</div>
        </div>
      `;
    } else {
      historyContainer.innerHTML = coordinatedEvents.map(item => `
        <div class="request-card ${item.coordinator.response === 'APPROVED' ? 'approved' : 'declined'}">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-white">${item.event.title}</h4>
              <p class="text-xs text-muted">${item.event.start_date} · ${item.event.venue_name}</p>
            </div>
            <span class="badge ${item.coordinator.response === 'APPROVED' ? 'badge-success' : 'badge-danger'}">
              ${item.coordinator.response === 'APPROVED' ? 'Accepted' : 'Declined'}
            </span>
          </div>
          ${item.coordinator.remarks ? `<div class="text-xs text-muted mt-2"><strong>Remarks:</strong> "${item.coordinator.remarks}"</div>` : ''}
          <div class="mt-3">
            <button class="btn btn-outline btn-sm view-event-btn" data-eventid="${item.event.event_id}">
              <span>View Plan Overview</span>
            </button>
          </div>
        </div>
      `).join("");
    }

    // Bind Staff Actions
    document.querySelectorAll(".staff-yes-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const eventId = e.currentTarget.dataset.eventid;
        await API.respondAsStaff(eventId, staff.registration_id, "YES", "Faculty coordination confirmed.");
        this.showToast("You have accepted the coordination role!", "success");
        this.loadStaffDashboard();
      });
    });

    document.querySelectorAll(".staff-no-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const eventId = e.currentTarget.dataset.eventid;
        const reason = prompt("Optional: Provide a reason for declining:") || "Declined due to prior schedule.";
        API.respondAsStaff(eventId, staff.registration_id, "NO", reason).then(() => {
          this.showToast("You have declined the request.", "warning");
          this.loadStaffDashboard();
        });
      });
    });

    document.querySelectorAll(".view-event-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.openEventPlanView(e.currentTarget.dataset.eventid);
      });
    });
  },

  /* ---------------- STUDENT DASHBOARD ---------------- */

  async loadStudentDashboard() {
    if (!this.currentUser) return;
    const student = this.currentUser;

    document.getElementById("student-profile-name").textContent = student.name;
    document.getElementById("student-profile-info").textContent = `Year ${student.year_of_study || 3}, Section ${student.section || 'A'} · ${student.department}`;
    
    // On-Duty Attendance Badge
    const attPct = student.attendance_pct || 88;
    const odEligible = attPct >= 75;
    const odBadge = document.getElementById("student-od-badge");
    if (odBadge) {
      odBadge.innerHTML = odEligible 
        ? `<span class="badge badge-success">✓ OD Leave Eligible (${attPct}% Classroom Attendance)</span>`
        : `<span class="badge badge-danger">⚠️ OD Attendance Warning (${attPct}%)</span>`;
    }

    // Clubs
    const clubsList = student.club_memberships || ["ACM Chapter", "Robotics Club"];
    document.getElementById("student-clubs-tags").innerHTML = clubsList.map(c => 
      `<span class="badge badge-primary">${c}</span>`
    ).join(" ");

    // Load Volunteer Invitations
    const events = await API.getEvents();
    const pendingVolRequests = [];
    const myAssignments = [];

    events.forEach(evt => {
      const myVol = (evt.volunteers || []).find(v => v.registration_id === student.registration_id || v.user_id === student.user_id);
      if (myVol) {
        if (myVol.response === "PENDING") {
          pendingVolRequests.push({ event: evt, volunteer: myVol });
        } else {
          myAssignments.push({ event: evt, volunteer: myVol });
        }
      }
    });

    // Render Pending Volunteer Requests
    const reqContainer = document.getElementById("student-volunteer-requests");
    if (pendingVolRequests.length === 0) {
      reqContainer.innerHTML = `
        <div class="card p-6 text-center text-muted">
          <div class="text-2xl mb-2">✨</div>
          <div>No pending volunteer requests right now.</div>
        </div>
      `;
    } else {
      reqContainer.innerHTML = pendingVolRequests.map(item => `
        <div class="request-card pending">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="badge badge-warning mb-1">Volunteer Assignment</span>
              <h3 class="text-lg font-bold text-white">${item.event.title}</h3>
              <p class="text-xs text-muted">${item.event.start_date} · 📍 ${item.event.venue_name}</p>
            </div>
            <span class="badge badge-cyan">OD Credit Guaranteed</span>
          </div>

          <div class="bg-input p-3 rounded-md mb-3 text-sm">
            <strong>Assigned Responsibility:</strong>
            <div class="text-white mt-1">🎯 ${item.volunteer.task}</div>
          </div>

          <p class="text-xs text-muted mb-3">${item.event.description}</p>

          <div class="request-actions">
            <button class="btn btn-success btn-sm student-yes-btn" data-eventid="${item.event.event_id}">
              <span>✓ YES, Accept Volunteer Duty</span>
            </button>
            <button class="btn btn-danger btn-sm student-no-btn" data-eventid="${item.event.event_id}">
              <span>✕ NO, Cannot Attend</span>
            </button>
            <button class="btn btn-outline btn-sm view-event-btn" data-eventid="${item.event.event_id}">
              <span>View Event Details</span>
            </button>
          </div>
        </div>
      `).join("");
    }

    // Render Assignments History
    const historyContainer = document.getElementById("student-assigned-tasks");
    if (myAssignments.length === 0) {
      historyContainer.innerHTML = `
        <div class="card p-6 text-center text-muted">
          <div>No active assignments. Accept pending requests above to build your volunteer portfolio.</div>
        </div>
      `;
    } else {
      historyContainer.innerHTML = myAssignments.map(item => `
        <div class="request-card ${item.volunteer.response === 'APPROVED' ? 'approved' : 'declined'}">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-white">${item.event.title}</h4>
              <p class="text-xs text-muted">Task: ${item.volunteer.task} · Date: ${item.event.start_date}</p>
            </div>
            <span class="badge ${item.volunteer.response === 'APPROVED' ? 'badge-success' : 'badge-danger'}">
              ${item.volunteer.response === 'APPROVED' ? 'Duty Confirmed' : 'Declined'}
            </span>
          </div>
          <div class="mt-3">
            <button class="btn btn-outline btn-sm view-event-btn" data-eventid="${item.event.event_id}">
              <span>View Full Schedule</span>
            </button>
          </div>
        </div>
      `).join("");
    }

    // Bind Student Action Buttons
    document.querySelectorAll(".student-yes-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const eventId = e.currentTarget.dataset.eventid;
        await API.respondAsStudent(eventId, student.registration_id, "YES");
        this.showToast("Volunteer duty accepted! On-Duty attendance logged.", "success");
        this.loadStudentDashboard();
      });
    });

    document.querySelectorAll(".student-no-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const eventId = e.currentTarget.dataset.eventid;
        await API.respondAsStudent(eventId, student.registration_id, "NO");
        this.showToast("Volunteer assignment declined.", "warning");
        this.loadStudentDashboard();
      });
    });

    document.querySelectorAll(".view-event-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.openEventPlanView(e.currentTarget.dataset.eventid);
      });
    });
  },

  /* ---------------- NOTIFICATIONS IN-APP ---------------- */

  async updateNotificationBadge() {
    if (!this.currentUser) return;
    const notifications = await API.getNotifications(this.currentUser.registration_id);
    const unreadCount = notifications.filter(n => !n.read).length;

    const badge = document.getElementById("notif-badge-count");
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  },

  async renderNotificationList() {
    if (!this.currentUser) return;
    const notifs = await API.getNotifications(this.currentUser.registration_id);
    const container = document.getElementById("notif-items-list");
    if (!container) return;

    if (notifs.length === 0) {
      container.innerHTML = `<div class="text-center text-muted text-xs py-4">No notifications yet.</div>`;
      return;
    }

    container.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-notifid="${n.id}" data-eventid="${n.event_id || ''}">
        <div class="flex justify-between items-start">
          <strong class="text-xs ${n.read ? 'text-muted' : 'text-white'}">${n.title}</strong>
          ${!n.read ? `<span class="badge badge-primary text-xs">New</span>` : ''}
        </div>
        <p class="text-xs text-muted mt-1">${n.message}</p>
        <div class="notif-time">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `).join("");

    // Clicking notification marks read & opens event
    document.querySelectorAll(".notif-item").forEach(el => {
      el.addEventListener("click", async (e) => {
        const notifId = e.currentTarget.dataset.notifid;
        const eventId = e.currentTarget.dataset.eventid;
        await API.markNotificationRead(notifId);
        this.updateNotificationBadge();
        document.getElementById("notif-dropdown").classList.remove("show");
        if (eventId) {
          this.openEventPlanView(eventId);
        }
      });
    });
  },

  /* ---------------- TOAST SYSTEM ---------------- */

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : (type === 'danger' ? '⚠️' : 'ℹ️')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
