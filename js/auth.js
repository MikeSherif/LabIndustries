document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login__form");
  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const validationBox = form.querySelector(".login__validation");
  const helpLink = document.querySelector(".login__help-link");
  const tooltip = document.querySelector(".login__tooltip");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (helpLink && tooltip && isMobile) {
    tooltip.classList.add("hidden");
    helpLink.addEventListener("click", (e) => {
      e.preventDefault();
      tooltip.classList.remove("hidden");
      tooltip.classList.add("active");

      setTimeout(() => {
        tooltip.classList.remove("active");
        tooltip.classList.add("hidden");
      }, 4000);
    });
  }

  async function sendLoginRequest(email, password) {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      const data = await response.json();

      if (data.success) {
        window.location.href = "/landing";
        return true;
      } else {
        validationBox.classList.add("active");
        return false;
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      emailInput.classList.add("invalid");
      passwordInput.classList.add("invalid");
      validationBox.classList.add("active");
      return false;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    [emailInput, passwordInput].forEach(i => i.classList.remove("invalid"));
    validationBox.classList.remove("active");

    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk = pass.length >= 6;

    if (!emailOk) emailInput.classList.add("invalid");
    if (!passOk) passwordInput.classList.add("invalid");

    if (!emailOk || !passOk) {
      validationBox.classList.add("active");
      return;
    }

    await sendLoginRequest(email, pass);
  });
});
