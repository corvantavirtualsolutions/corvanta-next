// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".mobile-nav-close");
  const mobileNav = document.querySelector(".mobile-nav");

  if (openBtn && mobileNav) {
    openBtn.addEventListener("click", () => mobileNav.classList.add("open"));
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener("click", () => mobileNav.classList.remove("open"));
  }
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileNav.classList.remove("open"));
    });
  }

  // FAQ accordion
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      item.closest(".accordion").querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
});
