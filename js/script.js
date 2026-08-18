document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const mainSections = document.querySelectorAll("main section[id]");
  const backToTop = document.querySelector(".back-to-top");
  const revealItems = document.querySelectorAll(".reveal");
  const statValues = document.querySelectorAll(".stat__value");
  const faqItems = document.querySelectorAll(".faq-item");
  const contactForm = document.getElementById("contactForm");

  if (header) {
    const setHeaderState = () => {
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navPanel.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const setActiveNavLink = () => {
    let currentId = "home";

    mainSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const isActive = href === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  setActiveNavLink();
  window.addEventListener("scroll", setActiveNavLink, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const target = Number(el.getAttribute("data-target")) || 0;
          const duration = 1200;
          const start = performance.now();

          const tick = (now) => {
            const actual = Math.min((now - start) / duration, 1);
            const value = Math.floor(actual * target);
            el.textContent = value;

            if (actual < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
            }
          };

          requestAnimationFrame(tick);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    statValues.forEach((stat) => statsObserver.observe(stat));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    statValues.forEach((stat) => {
      const target = Number(stat.getAttribute("data-target")) || 0;
      stat.textContent = target;
    });
  }

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faq) => {
        faq.classList.remove("is-open");
        faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 520) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    };

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const statusEl = contactForm.querySelector(".form-status");
      const fullName = contactForm.fullName.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      statusEl.classList.remove("is-error", "is-success");

      if (!fullName || !email || !message) {
        statusEl.textContent = "Please fill in your name, email and message.";
        statusEl.classList.add("is-error");
        return;
      }

      if (!emailPattern.test(email)) {
        statusEl.textContent = "Please enter a valid email address.";
        statusEl.classList.add("is-error");
        return;
      }

      const subject = encodeURIComponent("VeinX website inquiry");
      const body = encodeURIComponent(
        `Full Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      statusEl.textContent = "Opening your email client...";
      statusEl.classList.add("is-success");

      window.location.href = `mailto:waqasjanjua.developer@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
