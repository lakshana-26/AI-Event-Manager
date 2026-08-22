/**
 * AI-Event-Manager Staff Coordinator Dashboard Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  Common.initNavbar("staff");
  await StaffDashboard.init();
});

const StaffDashboard = {
  async init() {
    this.renderProfile();
    await this.loadRequests();
  },

  renderProfile() {
    const user = API.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById("staff-name");
    const deptEl = document.getElementById("staff-dept");
    const desigEl = document.getElementById("staff-designation");
    const roomEl = document.getElementById("staff-room");
    const specEl = document.getElementById("staff-specialization");
    const clubEl = document.getElementById("staff-club");
    const emailEl = document.getElementById("staff-email");
    const phoneEl = document.getElementById("staff-phone");

    if (nameEl) nameEl.textContent = user.name;
    if (deptEl) deptEl.textContent = user.department;
    if (desigEl) desigEl.textContent = user.designation || "Faculty Coordinator";
    if (roomEl) roomEl.textContent = user.office_room || "Academic Wing";
    if (specEl) specEl.textContent = user.specialization || "AI & Distributed Computing";
    if (clubEl) clubEl.textContent = user.assigned_club || "ACM Student Chapter";
    if (emailEl) emailEl.textContent = user.email || `${(user.registration_id || 'staff').toLowerCase()}@college.edu`;
    if (phoneEl) phoneEl.textContent = user.phone || "+91 98401 23456";
  },

  async loadRequests() {
    const user = API.getCurrentUser();
    if (!user) return;

    const pendingContainer = document.getElementById("staff-pending-requests");
    const historyContainer = document.getElementById("staff-coordinated-events");

    try {
      const events = await API.getEvents();
      const myRegId = user.registration_id || user.user_id;

      const pending = [];
      const completed = [];

      events.forEach(evt => {
        const myCoord = (evt.coordinators || []).find(c => c.registration_id === myRegId || c.user_id === myRegId);
        if (myCoord) {
          if (myCoord.response === "PENDING") {
            pending.push({ event: evt, coordinator: myCoord });
          } else {
            completed.push({ event: evt, coordinator: myCoord });
          }
        }
      });

      // Render Pending Requests
      if (pendingContainer) {
        if (pending.length === 0) {
          pendingContainer.innerHTML = `
            <div class="card bg-dark border-secondary p-4 text-center text-muted">
              <div class="display-6 mb-2">🎉</div>
              <div>No pending faculty coordinator requests. You're all caught up!</div>
            </div>
          `;
        } else {
          pendingContainer.innerHTML = pending.map(req => `
            <div class="card bg-dark border-warning mb-3 shadow">
              <div class="card-header bg-warning bg-opacity-10 border-warning d-flex justify-content-between align-items-center">
                <span class="badge bg-warning text-dark font-monospace fw-bold">Coordination Request Pending</span>
                <span class="text-secondary small font-monospace">Event ID: ${req.event.event_id}</span>
              </div>
              <div class="card-body">
                <h5 class="card-title text-white fw-bold mb-2">${req.event.title}</h5>
                <p class="card-text text-secondary small mb-3">${req.event.description || 'Flagship college symposium and track sessions.'}</p>
                <div class="row g-2 mb-3 small bg-black bg-opacity-40 p-2 rounded border border-secondary">
                  <div class="col-6"><strong class="text-white">📅 Date:</strong> <span class="text-white">${req.event.date || req.event.start_date}</span></div>
                  <div class="col-6"><strong class="text-white">⏰ Time:</strong> <span class="text-white">${req.event.start_time} - ${req.event.end_time}</span></div>
                  <div class="col-6"><strong class="text-white">📍 Venue:</strong> <span class="text-white">${req.event.venue_name}</span></div>
                  <div class="col-6"><strong class="text-white">👥 Expected:</strong> <span class="text-white">${req.event.expected_attendees} Pax</span></div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-success staff-accept-btn px-3 py-2 fw-bold text-white shadow-sm" data-eventid="${req.event.event_id}">
                    ✓ YES, Accept Coordination
                  </button>
                  <button class="btn btn-outline-danger staff-decline-btn px-3 py-2 fw-bold" data-eventid="${req.event.event_id}">
                    ✕ NO, Decline
                  </button>
                </div>
              </div>
            </div>
          `).join("");

          // Bind response buttons
          pendingContainer.querySelectorAll(".staff-accept-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              const eventId = e.currentTarget.dataset.eventid;
              await API.respondStaff(eventId, myRegId, "YES", "Faculty coordination duty accepted.");
              Common.showToast("You have accepted the coordination role!", "success");
              await this.loadRequests();
            });
          });

          pendingContainer.querySelectorAll(".staff-decline-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              const eventId = e.currentTarget.dataset.eventid;
              const reason = prompt("Optional reason for declining:") || "Prior academic commitment.";
              await API.respondStaff(eventId, myRegId, "NO", reason);
              Common.showToast("Coordination request declined.", "warning");
              await this.loadRequests();
            });
          });
        }
      }

      // Render Response History
      if (historyContainer) {
        if (completed.length === 0) {
          historyContainer.innerHTML = `
            <div class="card bg-dark border-secondary p-4 text-center text-muted">
              <div>No past coordinated events logged yet.</div>
            </div>
          `;
        } else {
          historyContainer.innerHTML = completed.map(c => `
            <div class="card bg-dark border-secondary mb-2 p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-light mb-1">${c.event.title}</h6>
                  <small class="text-muted">${c.event.date || c.event.start_date} · 📍 ${c.event.venue_name}</small>
                </div>
                <span class="badge bg-${c.coordinator.response === 'APPROVED' ? 'success' : 'danger'}">
                  ${c.coordinator.response === 'APPROVED' ? 'ACCEPTED' : 'DECLINED'}
                </span>
              </div>
            </div>
          `).join("");
        }
      }

    } catch (err) {
      console.error("Error loading staff requests:", err);
    }
  }
};
