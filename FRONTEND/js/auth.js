/**
 * AI-Event-Manager Authentication Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginBtn = document.getElementById("login-submit-btn");

  // Check if already logged in
  const existingUser = API.getCurrentUser();
  if (existingUser && existingUser.role) {
    Common.routeToRole(existingUser.role);
    return;
  }

  // Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const regId = document.getElementById("login-reg-id").value.trim();
      const pass = document.getElementById("login-password").value.trim();

      if (!regId || !pass) {
        Common.showToast("Please enter both Registration ID and Password.", "warning");
        return;
      }

      try {
        loginBtn.disabled = true;
        loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Authenticating...`;

        const user = await API.login(regId, pass);
        Common.showToast(`Welcome back, ${user.name}!`, "success");

        setTimeout(() => {
          Common.routeToRole(user.role);
        }, 400);
      } catch (err) {
        Common.showToast(err.message || "Authentication failed. Check credentials.", "danger");
      } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = `Sign In to Portal`;
      }
    });
  }

  // Quick Demo Chips Binder
  document.querySelectorAll(".demo-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const regId = e.currentTarget.dataset.regid;
      const pass = e.currentTarget.dataset.pass;
      document.getElementById("login-reg-id").value = regId;
      document.getElementById("login-password").value = pass;
      Common.showToast(`Auto-filled credentials for ${regId}`, "info");
    });
  });
});
