/**
 * AI-Event-Manager Student Volunteer Dashboard Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  Common.initNavbar("student");
  await StudentDashboard.init();
});

const StudentDashboard = {
  async init() {
    this.renderProfile();
    await this.loadOpportunities();
  },

  renderProfile() {
    const user = API.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById("student-name");
    const deptEl = document.getElementById("student-dept");
    const infoEl = document.getElementById("student-info");
    const odEl = document.getElementById("student-od-status");
    const clubsEl = document.getElementById("student-clubs");
    const emailEl = document.getElementById("student-email");
    const phoneEl = document.getElementById("student-phone");

    if (nameEl) nameEl.textContent = user.name;
    if (deptEl) deptEl.textContent = user.department;
    if (infoEl) infoEl.textContent = `Year ${user.year_of_study || 3}, Section ${user.section || 'A'} · Reg ID: ${user.registration_id || user.user_id}`;
    if (emailEl) emailEl.textContent = user.email || `${(user.registration_id || 'student').toLowerCase()}@student.college.edu`;
    if (phoneEl) phoneEl.textContent = user.phone || "+91 91234 56789";
    
    if (odEl) {
      odEl.innerHTML = `<span class="badge bg-success">✓ OD Leave Eligible (Classroom Attendance ≥ 75%)</span>`;
    }

    if (clubsEl) {
      const clubs = user.club_memberships || ["ACM Student Chapter", "AI & Robotics Club"];
      clubsEl.innerHTML = clubs.map(c => `<span class="badge bg-primary me-1">${c}</span>`).join("");
    }
  },

  async loadOpportunities() {
    const user = API.getCurrentUser();
    if (!user) return;

    const oppsContainer = document.getElementById("student-volunteer-requests");
    const tasksContainer = document.getElementById("student-assigned-tasks");

    try {
      const events = await API.getEvents();
      const myRegId = user.registration_id || user.user_id;

      const pending = [];
      const confirmed = [];

      events.forEach(evt => {
        const myVol = (evt.volunteers || []).find(v => v.registration_id === myRegId || v.user_id === myRegId);
        if (myVol) {
          if (myVol.response === "PENDING") {
            pending.push({ event: evt, volunteer: myVol });
          } else {
            confirmed.push({ event: evt, volunteer: myVol });
          }
        }
      });

      // Render Pending Volunteer Opportunities
      if (oppsContainer) {
        if (pending.length === 0) {
          oppsContainer.innerHTML = `
            <div class="card bg-dark border-secondary p-4 text-center text-muted">
              <div class="display-6 mb-2">✨</div>
              <div>No pending volunteer opportunities right now. Check back soon!</div>
            </div>
          `;
        } else {
          oppsContainer.innerHTML = pending.map(item => `
            <div class="card bg-dark border-primary mb-3 shadow">
              <div class="card-header bg-primary bg-opacity-10 border-primary d-flex justify-content-between align-items-center">
                <span class="badge bg-primary fw-bold">Volunteer Opportunity</span>
                <span class="badge bg-success fw-bold">OD Leave Credit</span>
              </div>
              <div class="card-body">
                <h5 class="card-title text-white fw-bold mb-2">${item.event.title}</h5>
                <p class="card-text text-secondary small mb-3">${item.event.description || 'Participate as a campus organizer and volunteer.'}</p>
                <div class="p-2 mb-3 bg-black bg-opacity-40 rounded border border-secondary small">
                  <strong class="text-white">🎯 Assigned Role:</strong> <span class="text-info fw-semibold">${item.volunteer.task}</span>
                </div>
                <div class="row g-2 mb-3 small bg-black bg-opacity-40 p-2 rounded border border-secondary">
                  <div class="col-6"><strong class="text-white">📅 Date:</strong> <span class="text-white">${item.event.date || item.event.start_date}</span></div>
                  <div class="col-6"><strong class="text-white">📍 Venue:</strong> <span class="text-white">${item.event.venue_name}</span></div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-success student-accept-btn px-3 py-2 fw-bold text-white shadow-sm" data-eventid="${item.event.event_id}">
                    ✓ YES, Volunteer for Event
                  </button>
                  <button class="btn btn-outline-danger student-decline-btn px-3 py-2 fw-bold" data-eventid="${item.event.event_id}">
                    ✕ NO, Cannot Attend
                  </button>
                </div>
              </div>
            </div>
          `).join("");

          // Bind response buttons (strictly request_type = STUDENT_INTEREST)
          oppsContainer.querySelectorAll(".student-accept-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              const eventId = e.currentTarget.dataset.eventid;
              await API.respondStudent(eventId, myRegId, "YES");
              Common.showToast("Volunteer duty confirmed! On-Duty credit logged.", "success");
              await this.loadOpportunities();
            });
          });

          oppsContainer.querySelectorAll(".student-decline-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              const eventId = e.currentTarget.dataset.eventid;
              await API.respondStudent(eventId, myRegId, "NO");
              Common.showToast("Volunteer request declined.", "warning");
              await this.loadOpportunities();
            });
          });
        }
      }

      // Render Confirmed Volunteer Duties
      if (tasksContainer) {
        if (confirmed.length === 0) {
          tasksContainer.innerHTML = `
            <div class="card bg-dark border-secondary p-4 text-center text-muted">
              <div>No active volunteer duties confirmed yet.</div>
            </div>
          `;
        } else {
          tasksContainer.innerHTML = confirmed.map(t => `
            <div class="card bg-dark border-secondary mb-2 p-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="text-light mb-0">${t.event.title}</h6>
                <span class="badge bg-${t.volunteer.response === 'APPROVED' ? 'success' : 'danger'}">
                  ${t.volunteer.response === 'APPROVED' ? 'DUTY CONFIRMED' : 'DECLINED'}
                </span>
              </div>
              <div class="small text-info mb-1">Task: ${t.volunteer.task}</div>
              <small class="text-muted">${t.event.date || t.event.start_date} · 📍 ${t.event.venue_name}</small>
            </div>
          `).join("");
        }
      }

    } catch (err) {
      console.error("Error loading student opportunities:", err);
    }
  }
};
