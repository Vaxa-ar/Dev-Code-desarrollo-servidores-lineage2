(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $("[data-work-header]");
  const menuToggle = $("[data-work-menu-toggle]");
  const nav = $("[data-work-nav]");
  const navLinks = nav ? $$("a", nav) : [];
  const sections = $$("[data-section]");
  const videos = $$("[data-background-video]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentSection = sections[0] || null;

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const initNavigation = () => {
    const updateHeader = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    menuToggle?.addEventListener("click", () => {
      const open = nav?.classList.toggle("is-open") ?? false;
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  const playCurrentVideo = () => {
    if (reduceMotion) return;
    const video = currentSection?.querySelector("[data-background-video]");
    video?.play().catch(() => {
      // Autoplay can be blocked; content remains usable without it.
    });
  };

  const setActiveSection = (section) => {
    if (!section) return;

    currentSection = section;

    sections.forEach((item) => {
      item.classList.toggle("is-active", item === section);
    });

    $$("[data-rail]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.rail === section.id);
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === `#${section.id}`);
    });

    videos.forEach((video) => {
      if (!section.contains(video)) video.pause();
    });

    playCurrentVideo();
  };

  const initSectionObserver = () => {
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      setActiveSection(sections[0]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry) setActiveSection(activeEntry.target);
      },
      { threshold: [0.2, 0.45, 0.68] }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initReveal = () => {
    const elements = $$(".reveal");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.11, rootMargin: "0px 0px -5% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  };

  const initCopyEmail = () => {
    const button = $("[data-copy-email]");
    const toast = $("[data-copy-toast]");

    button?.addEventListener("click", async () => {
      const email = button.dataset.copyEmail;

      try {
        await navigator.clipboard.writeText(email);
        button.textContent = "Copied";
        toast?.classList.add("show");

        window.setTimeout(() => {
          button.textContent = "Copy email";
          toast?.classList.remove("show");
        }, 1800);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  };

  const initCurrentYear = () => {
    $$("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  };

  const initVisibilityHandling = () => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        videos.forEach((video) => video.pause());
      } else {
        playCurrentVideo();
      }
    });
  };

  initNavigation();
  initSectionObserver();
  initReveal();
  initCopyEmail();
  initCurrentYear();
  initVisibilityHandling();

  if (sections.length) setActiveSection(sections[0]);
})();
