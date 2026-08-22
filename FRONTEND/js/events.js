/**
 * AI-Event-Manager Event Planner Controller
 * Interfaces with Main Agent, People Agent, Resource Agent, and Review Agent.
 */

document.addEventListener("DOMContentLoaded", async () => {
  Common.initNavbar("admin");
  await EventPlanner.init();
});

const EventPlanner = {
  async init() {
    await this.loadFormData();
    this.bindForm();
  },

  async loadFormData() {
    try {
      const [venues, resources, staff, students] = await Promise.all([
        API.getVenues().catch(() => []),
        API.getResources().catch(() => []),
        API.getStaff().catch(() => []),
        API.getStudents(true).catch(() => [])
      ]);

      // Populate Venues
      const venueSelect = document.getElementById("event-venue");
      if (venueSelect) {
        venueSelect.innerHTML = `<option value="">-- Let AI Recommend Optimal Venue --</option>` + venues.map(v => 
          `<option value="${v.venue_id}">${v.venue_name} (Capacity: ${v.capacity} pax)</option>`
        ).join("");
      }

      // Populate Resources List
      const resContainer = document.getElementById("resources-container");
      if (resContainer) {
        resContainer.innerHTML = resources.map(r => `
          <div class="col-md-6 mb-2">
            <div class="p-2 border border-secondary rounded bg-dark d-flex justify-content-between align-items-center">
              <div>
                <div class="small fw-bold text-white">${r.resource_name}</div>
                <div class="text-secondary small">₹${parseFloat(r.unit_cost).toLocaleString()} · ${r.category}</div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <input type="number" class="form-control form-control-sm text-center resource-qty text-white bg-dark border-secondary" data-resid="${r.resource_id}" min="0" max="${r.available_quantity}" value="0" style="width: 60px;">
                <span class="text-secondary small">/ ${r.available_quantity}</span>
              </div>
            </div>
          </div>
        `).join("");
      }

      // Populate Staff Coordinators Checkboxes
      const staffContainer = document.getElementById("staff-coordinators-container");
      if (staffContainer) {
        staffContainer.innerHTML = staff.map((s, idx) => `
          <div class="col-md-6 mb-2">
            <div class="form-check p-2 border border-secondary rounded bg-dark">
              <input class="form-check-input ms-1 coord-checkbox" type="checkbox" value="${s.registration_id || s.user_id}" id="staff_${s.user_id}" ${idx === 0 ? 'checked' : ''}>
              <label class="form-check-label ms-2 text-white small cursor-pointer" for="staff_${s.user_id}">
                <div class="fw-bold text-white">${s.name} (${s.registration_id || s.user_id})</div>
                <div class="text-secondary small">${s.designation} · ${s.department}</div>
              </label>
            </div>
          </div>
        `).join("");
      }

      // Populate Student Volunteers Checkboxes
      const volContainer = document.getElementById("student-volunteers-container");
      if (volContainer) {
        volContainer.innerHTML = students.map((st, idx) => `
          <div class="col-md-6 mb-2">
            <div class="form-check p-2 border border-secondary rounded bg-dark">
              <input class="form-check-input ms-1 vol-checkbox" type="checkbox" value="${st.registration_id || st.user_id}" id="stu_${st.user_id}" ${idx < 3 ? 'checked' : ''}>
              <label class="form-check-label ms-2 text-white small cursor-pointer" for="stu_${st.user_id}">
                <div class="fw-bold text-white">${st.name} (${st.registration_id || st.user_id})</div>
                <div class="text-secondary small">Year ${st.year_of_study} ${st.department} · OD Eligible</div>
              </label>
            </div>
          </div>
        `).join("");
      }

    } catch (err) {
      console.error("Error loading form data:", err);
    }
  },

  bindForm() {
    const form = document.getElementById("plan-event-form");
    const planBtn = document.getElementById("plan-event-btn");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("event-title").value.trim();
        const eventType = document.getElementById("event-type").value;
        const department = document.getElementById("event-department").value.trim();
        const description = document.getElementById("event-description").value.trim();
        const expectedAttendees = parseInt(document.getElementById("event-attendees").value) || 50;
        const budget = parseFloat(document.getElementById("event-budget").value) || 50000;
        const date = document.getElementById("event-date").value;
        const startTime = document.getElementById("event-start-time").value;
        const endTime = document.getElementById("event-end-time").value;
        const venueId = document.getElementById("event-venue").value || null;

        // Collect resources
        const selectedResources = [];
        document.querySelectorAll(".resource-qty").forEach(inp => {
          const qty = parseInt(inp.value) || 0;
          if (qty > 0) {
            selectedResources.push({
              resource_id: inp.dataset.resid,
              quantity: qty
            });
          }
        });

        // Collect coordinator IDs
        const coordinatorIds = Array.from(document.querySelectorAll(".coord-checkbox:checked")).map(cb => cb.value);
        // Collect volunteer IDs
        const volunteerIds = Array.from(document.querySelectorAll(".vol-checkbox:checked")).map(cb => cb.value);

        const payload = {
          title,
          category: eventType,
          event_type: eventType,
          department,
          description,
          expected_attendees: expectedAttendees,
          budget: budget,
          budget_cap: budget,
          date,
          start_date: date,
          end_date: date,
          start_time: startTime,
          end_time: endTime,
          venue_id: venueId,
          selected_resources: selectedResources,
          coordinator_ids: coordinatorIds,
          volunteer_ids: volunteerIds,
          created_by: API.getCurrentUser()?.user_id || "ADM001"
        };

        try {
          planBtn.disabled = true;
          planBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Main Agent Coordinating Multi-Agent Pipeline...`;

          const resultEvent = await API.planEventWithAI(payload);
          Common.showToast("Event successfully planned by Agentic AI!", "success");

          // Display Generated Plan Results Section
          this.renderPlanResult(resultEvent);

        } catch (err) {
          Common.showToast("Planning failed: " + err.message, "danger");
        } finally {
          planBtn.disabled = false;
          planBtn.innerHTML = `⚡ PLAN EVENT WITH AI`;
        }
      });
    }
  },

  renderPlanResult(event) {
    const resultCard = document.getElementById("ai-plan-result-card");
    if (!resultCard) return;

    resultCard.classList.remove("d-none");
    resultCard.scrollIntoView({ behavior: "smooth" });

    document.getElementById("res-event-id").textContent = event.event_id;
    document.getElementById("res-event-title").textContent = event.title;
    document.getElementById("res-event-state").textContent = event.workflow_state || event.status;
    document.getElementById("res-event-venue").textContent = `${event.venue_name} (ID: ${event.venue_id})`;
    document.getElementById("res-event-cost").textContent = `₹${parseFloat(event.calculated_cost || 0).toLocaleString()} (Cap: ₹${parseFloat(event.budget || 0).toLocaleString()})`;

    const comp = event.compliance || {};
    const score = comp.score || 95;
    const scoreBadge = document.getElementById("res-compliance-score");
    if (scoreBadge) {
      scoreBadge.textContent = `${score}%`;
      scoreBadge.className = `display-6 fw-bold ${score >= 90 ? 'text-success' : (score >= 80 ? 'text-warning' : 'text-danger')}`;
    }

    // Render Coordinators
    const coordList = document.getElementById("res-coordinators-list");
    coordList.innerHTML = (event.coordinators || []).map(c => `
      <div class="p-2 mb-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-bold text-white">${c.name}</span>
          <small class="text-secondary d-block">${c.department} · ${c.role_type}</small>
        </div>
        <span class="badge bg-warning text-dark font-monospace">${c.response}</span>
      </div>
    `).join("");

    // Render Volunteers
    const volList = document.getElementById("res-volunteers-list");
    volList.innerHTML = (event.volunteers || []).map(v => `
      <div class="p-2 mb-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-bold text-white">${v.name}</span>
          <small class="text-secondary d-block">${v.department} · Task: ${v.task}</small>
        </div>
        <span class="badge bg-warning text-dark font-monospace">${v.response}</span>
      </div>
    `).join("");

    // Render Compliance Checklist
    const compList = document.getElementById("res-compliance-checks");
    compList.innerHTML = (comp.checks || []).map(chk => `
      <div class="d-flex align-items-start gap-2 mb-2 p-2 rounded bg-dark border border-secondary">
        <span class="${chk.pass ? 'text-success' : 'text-danger'} fw-bold fs-6">${chk.pass ? '✓' : '⚠️'}</span>
        <div>
          <div class="fw-bold ${chk.pass ? 'text-white' : 'text-danger'}">${chk.title}</div>
          <div class="text-secondary small mt-1">${chk.detail}</div>
        </div>
      </div>
    `).join("");

    // AI Recommendations
    const recList = document.getElementById("res-recommendations-list");
    recList.innerHTML = (event.ai_recommendations || []).map(r => `
      <li class="small text-white mb-2 d-flex align-items-start gap-2">
        <span class="text-info fw-bold">✦</span>
        <span>${r}</span>
      </li>
    `).join("");
  }
};
