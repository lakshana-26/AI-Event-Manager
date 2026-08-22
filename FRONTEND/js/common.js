/**
 * AI-Event-Manager Global Frontend Common Utilities
 */

const Common = {
  getLoginUrl() {
    const p = (window.location.pathname || "").toLowerCase();
    if (p.includes("/pages/") || p.endsWith("admin-dashboard.html") || p.endsWith("staff-dashboard.html") || p.endsWith("student-dashboard.html") || p.endsWith("event-form.html")) {
      return "../index.html";
    }
    return "index.html";
  },

  initNavbar(expectedRole = null) {
    const user = API.getCurrentUser();
    if (!user) {
      // Redirect to login if user session is not found
      const currentPath = (window.location.pathname || "").toLowerCase();
      if (!currentPath.endsWith("index.html") && currentPath !== "/" && currentPath !== "") {
        window.location.href = this.getLoginUrl();
      }
      return;
    }

    if (expectedRole && user.role !== expectedRole) {
      console.warn(`Role mismatch: Expected ${expectedRole}, got ${user.role}`);
      this.routeToRole(user.role);
      return;
    }

    // Populate user profile in navbar
    const userNameEl = document.getElementById("nav-user-name");
    const userRoleEl = document.getElementById("nav-user-role");
    const userAvatarEl = document.getElementById("nav-user-avatar");

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = (user.role || "").toUpperCase();
    if (userAvatarEl) userAvatarEl.textContent = (user.name || "U").charAt(0);

    // Bind logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => API.logout());
    }

    // Bind notification bell
    if (typeof Notifications !== "undefined") {
      Notifications.init();
    }
  },

  routeToRole(role) {
    const p = (window.location.pathname || "").toLowerCase();
    const isInsidePages = p.includes("/pages/") || p.endsWith("admin-dashboard.html") || p.endsWith("staff-dashboard.html") || p.endsWith("student-dashboard.html") || p.endsWith("event-form.html");
    const prefix = isInsidePages ? "" : "pages/";

    if (role === "admin") {
      window.location.href = prefix + "admin-dashboard.html";
    } else if (role === "staff") {
      window.location.href = prefix + "staff-dashboard.html";
    } else if (role === "student") {
      window.location.href = prefix + "student-dashboard.html";
    } else {
      window.location.href = this.getLoginUrl();
    }
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.position = "fixed";
      container.style.bottom = "24px";
      container.style.right = "24px";
      container.style.zIndex = "3000";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `alert alert-${type === 'danger' ? 'danger' : (type === 'success' ? 'success' : 'primary')} alert-dismissible fade show shadow-lg`;
    toast.role = "alert";
    toast.style.minWidth = "280px";
    toast.innerHTML = `
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};
