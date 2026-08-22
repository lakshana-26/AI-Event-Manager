/**
 * AI-Event-Manager In-App Notifications Engine
 */

const Notifications = {
  async init() {
    const user = API.getCurrentUser();
    if (!user) return;

    this.bindDOM();
    await this.refresh();
  },

  bindDOM() {
    const bellBtn = document.getElementById("notif-bell-btn");
    const dropdown = document.getElementById("notif-dropdown");
    const markAllBtn = document.getElementById("mark-all-read-btn");

    if (bellBtn && dropdown) {
      bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        if (dropdown.classList.contains("show")) {
          this.renderList();
        }
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
          dropdown.classList.remove("show");
        }
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener("click", async () => {
        const notifs = await this.getNotifications();
        for (const n of notifs) {
          if (!n.read) await API.markNotificationRead(n.id);
        }
        await this.refresh();
        Common.showToast("All notifications marked as read", "info");
      });
    }
  },

  async getNotifications() {
    const user = API.getCurrentUser();
    if (!user) return [];
    const regId = user.registration_id || user.user_id;
    return await API.getNotifications(regId);
  },

  async refresh() {
    const notifs = await this.getNotifications();
    const unreadCount = notifs.filter(n => !n.read).length;

    const badge = document.getElementById("notif-badge-count");
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove("d-none");
      } else {
        badge.classList.add("d-none");
      }
    }
  },

  async renderList() {
    const notifs = await this.getNotifications();
    const container = document.getElementById("notif-items-list");
    if (!container) return;

    if (!notifs || notifs.length === 0) {
      container.innerHTML = `<div class="p-3 text-center text-muted small">No notifications at this time.</div>`;
      return;
    }

    container.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-notifid="${n.id}" data-eventid="${n.event_id || ''}">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div class="notif-title">${n.title}</div>
          ${!n.read ? `<span class="badge bg-primary ms-2" style="font-size: 0.65rem;">New</span>` : ''}
        </div>
        <div class="notif-message">${n.message}</div>
        <div class="notif-time">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
      </div>
    `).join("");

    container.querySelectorAll(".notif-item").forEach(item => {
      item.addEventListener("click", async (e) => {
        const notifId = e.currentTarget.dataset.notifid;
        await API.markNotificationRead(notifId);
        await this.refresh();
        document.getElementById("notif-dropdown")?.classList.remove("show");
      });
    });
  }
};
