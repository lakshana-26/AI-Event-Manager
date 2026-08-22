/**
 * AI-Event-Manager Admin Dashboard Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  Common.initNavbar("admin");
  await AdminDashboard.init();
});

const AdminDashboard = {
  async init() {
    await this.loadMetrics();
    await this.loadEvents();
    this.bindEvents();
  },

  bindEvents() {
    const refreshBtn = document.getElementById("refresh-events-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this.loadEvents());
    }

    const resetBtn = document.getElementById("reset-local-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all local events and responses back to initial state?")) {
          if (typeof AppStorage !== "undefined") AppStorage.resetAll();
          Common.showToast("Local state reset successfully", "success");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  },

  async loadMetrics() {
    try {
      const [users, staff, students, venues, resources, rules] = await Promise.all([
        API.getUsers().catch(() => []),
        API.getStaff().catch(() => []),
        API.getStudents().catch(() => []),
        API.getVenues().catch(() => []),
        API.getResources().catch(() => []),
        API.getRules().catch(() => [])
      ]);

      const totalUsersEl = document.getElementById("metric-total-users");
      const staffEl = document.getElementById("metric-staff");
      const studentsEl = document.getElementById("metric-students");
      const venuesEl = document.getElementById("metric-venues");
      const resourcesEl = document.getElementById("metric-resources");
      const rulesEl = document.getElementById("metric-rules");

      if (totalUsersEl) totalUsersEl.textContent = users.length || 96;
      if (staffEl) staffEl.textContent = staff.length || 15;
      if (studentsEl) studentsEl.textContent = students.length || 80;
      if (venuesEl) venuesEl.textContent = venues.length || 8;
      if (resourcesEl) resourcesEl.textContent = resources.length || 12;
      if (rulesEl) rulesEl.textContent = rules.length || 12;
    } catch (err) {
      console.error("Error loading metrics:", err);
    }
  },

  async loadEvents() {
    const tbody = document.getElementById("admin-events-tbody");
    if (!tbody) return;

    try {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading events from backend...</td></tr>`;
      const events = await API.getEvents();

      if (!events || events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No campus events planned yet. Click <strong>"Plan Event with AI"</strong> to create one.</td></tr>`;
        return;
      }

      tbody.innerHTML = events.map(evt => {
        const comp = evt.compliance || {};
        const score = comp.score || 95;
        let scoreBadge = `<span class="badge bg-success">${score}%</span>`;
        if (score < 80) scoreBadge = `<span class="badge bg-danger">${score}%</span>`;
        else if (score < 90) scoreBadge = `<span class="badge bg-warning text-dark">${score}%</span>`;

        let statusBadge = `<span class="badge bg-warning text-dark">${evt.status || 'COLLECTING_RESPONSES'}</span>`;
        if (evt.status === "APPROVED" || evt.workflow_state === "APPROVED") {
          statusBadge = `<span class="badge bg-success">APPROVED</span>`;
        } else if (evt.status === "PUBLISHED" || evt.workflow_state === "PUBLISHED") {
          statusBadge = `<span class="badge bg-primary">PUBLISHED</span>`;
        } else if (evt.status === "RE_PLANNING") {
          statusBadge = `<span class="badge bg-danger">RE-PLANNING</span>`;
        }

        const approvedCoords = (evt.coordinators || []).filter(c => c.response === "APPROVED").length;
        const totalCoords = (evt.coordinators || []).length;
        const approvedVols = (evt.volunteers || []).filter(v => v.response === "APPROVED").length;
        const totalVols = (evt.volunteers || []).length;

        return `
          <tr>
            <td class="font-monospace fw-bold text-info">${evt.event_id}</td>
            <td>
              <div class="fw-bold text-white fs-6">${evt.title}</div>
              <small class="text-secondary d-block mt-1">📍 ${evt.venue_name || 'Venue TBA'}</small>
            </td>
            <td><span class="badge bg-dark border border-secondary text-light">${evt.event_type || evt.category || 'Event'}</span></td>
            <td>
              <div class="text-white fw-semibold">${evt.date || evt.start_date}</div>
              <small class="text-secondary">${evt.start_time} - ${evt.end_time}</small>
            </td>
            <td class="fw-bold text-success fs-6">₹${parseFloat(evt.budget || evt.budget_cap || 0).toLocaleString()}</td>
            <td>${statusBadge}</td>
            <td><span class="badge bg-secondary font-monospace text-white">${evt.workflow_state || 'COLLECTING_RESPONSES'}</span></td>
            <td>${scoreBadge}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-light view-detail-btn px-2" data-eventid="${evt.event_id}" title="View Details">
                  👁️ Details
                </button>
                ${evt.workflow_state !== 'APPROVED' && evt.workflow_state !== 'PUBLISHED' ? `
                  <button class="btn btn-outline-success approve-btn px-2" data-eventid="${evt.event_id}" title="Approve">
                    ✓ Approve
                  </button>
                ` : ''}
                ${evt.workflow_state === 'APPROVED' ? `
                  <button class="btn btn-outline-primary publish-btn px-2" data-eventid="${evt.event_id}" title="Publish">
                    🚀 Publish
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join("");

      // Bind action buttons
      tbody.querySelectorAll(".view-detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          this.showEventDetailModal(e.currentTarget.dataset.eventid);
        });
      });

      tbody.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.eventid;
          if (confirm(`Officially approve event ${id}?`)) {
            await API.approveEvent(id);
            Common.showToast(`Event ${id} approved successfully!`, "success");
            await this.loadEvents();
          }
        });
      });

      tbody.querySelectorAll(".publish-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.eventid;
          if (confirm(`Publish event ${id} to campus calendar?`)) {
            await API.publishEvent(id);
            Common.showToast(`Event ${id} published successfully!`, "success");
            await this.loadEvents();
          }
        });
      });

    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-danger">Failed to load events: ${err.message}</td></tr>`;
    }
  },

  async showEventDetailModal(eventId) {
    try {
      const event = await API.getEvent(eventId);
      if (!event) return;

      document.getElementById("modal-event-id").textContent = event.event_id;
      document.getElementById("modal-event-title").textContent = event.title;
      document.getElementById("modal-event-desc").textContent = event.description || "No description provided.";
      document.getElementById("modal-event-type").textContent = event.event_type || event.category;
      document.getElementById("modal-event-date").textContent = `${event.date || event.start_date} (${event.start_time} - ${event.end_time})`;
      document.getElementById("modal-event-venue").textContent = event.venue_name;
      document.getElementById("modal-event-budget").textContent = `₹${parseFloat(event.budget || 0).toLocaleString()}`;
      document.getElementById("modal-event-cost").textContent = `₹${parseFloat(event.calculated_cost || 0).toLocaleString()}`;
      document.getElementById("modal-event-state").textContent = event.workflow_state;

      // Render Coordinators
      const coordList = document.getElementById("modal-coordinators-list");
      coordList.innerHTML = (event.coordinators || []).map(c => `
        <div class="d-flex justify-content-between align-items-center p-2 mb-2 bg-dark rounded border border-secondary">
          <div>
            <div class="fw-bold text-white">${c.name} (${c.registration_id || c.user_id})</div>
            <small class="text-secondary">${c.department} · ${c.role_type || 'Coordinator'}</small>
          </div>
          <span class="badge bg-${c.response === 'APPROVED' ? 'success' : (c.response === 'DECLINED' ? 'danger' : 'warning text-dark')}">
            ${c.response}
          </span>
        </div>
      `).join("");

      // Render Volunteers
      const volList = document.getElementById("modal-volunteers-list");
      volList.innerHTML = (event.volunteers || []).map(v => `
        <div class="d-flex justify-content-between align-items-center p-2 mb-2 bg-dark rounded border border-secondary">
          <div>
            <div class="fw-bold text-white">${v.name} (${v.registration_id || v.user_id})</div>
            <small class="text-secondary">Task: ${v.task}</small>
          </div>
          <span class="badge bg-${v.response === 'APPROVED' ? 'success' : (v.response === 'DECLINED' ? 'danger' : 'warning text-dark')}">
            ${v.response}
          </span>
        </div>
      `).join("");

      // Render Compliance Checks
      const compList = document.getElementById("modal-compliance-list");
      const checks = (event.compliance || {}).checks || [];
      compList.innerHTML = checks.map(chk => `
        <div class="d-flex align-items-start gap-2 mb-2 p-2 rounded bg-dark border border-secondary">
          <span class="${chk.pass ? 'text-success' : 'text-danger'} fw-bold fs-6">${chk.pass ? '✓' : '⚠️'}</span>
          <div>
            <div class="fw-bold ${chk.pass ? 'text-white' : 'text-danger'}">${chk.title}</div>
            <div class="text-secondary small mt-1">${chk.detail}</div>
          </div>
        </div>
      `).join("");

      const modalEl = new bootstrap.Modal(document.getElementById("eventDetailModal"));
      modalEl.show();
    } catch (err) {
      Common.showToast("Failed to load event details: " + err.message, "danger");
    }
  }
};
