/**
 * DEV/CODE — WEBSITE SCRIPTS
 *
 * To publish a new YouTube video:
 * 1. Copy one object inside the `youtubeVideos` array.
 * 2. Replace id, title, category and description.
 * 3. Save this file and upload it to your hosting.
 *
 * The thumbnail and YouTube link are generated automatically from the video ID.
 */

const youtubeVideos = [
  {
    id: "lbS3PmtXhps",
    title: "Auto Hunting System",
    category: "Custom System",
    description: "Automatic combat and configuration system for Lineage II Interlude."
  },
  {
    id: "Ibydt8uTrJc",
    title: "Redeem Codes",
    category: "Reward System",
    description: "Secure code redemption with configurable rewards."
  },
  {
    id: "Mz7wLxYxdsU",
    title: "Random Boxes",
    category: "Item System",
    description: "Configurable random rewards activated directly from an item."
  },
  {
    id: "rhBnKX_fHzY",
    title: "Agathion System",
    category: "Character System",
    description: "Custom Agathions with server-side integration."
  },
  {
    id: "oK6vBdqfyj4",
    title: "Skins System",
    category: "Appearance System",
    description: "Character appearance customization without replacing real equipment."
  },
  {
    id: "Kq8JMWoIq18",
    title: "Interlude Interface",
    category: "Client Interface",
    description: "A modern custom interface created for Lineage II Interlude."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  renderYouTubeVideos();
  initializeRevealAnimations();
  initializeCopyEmail();
  updateCurrentYear();
});

function initializeNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".main-nav");

  if (!toggle || !navigation) {
    return;
  }

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function renderYouTubeVideos() {
  const grid = document.querySelector("#video-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = youtubeVideos
    .map((video) => {
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDescription = escapeHtml(video.description);
      const videoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
      const thumbnailUrl = `https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg`;

      return `
        <a
          class="video-card reveal"
          href="${videoUrl}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch ${safeTitle} on YouTube"
        >
          <div class="video-thumbnail">
            <img
              src="${thumbnailUrl}"
              alt="${safeTitle}"
              loading="lazy"
              width="480"
              height="360"
            >
            <span class="video-play" aria-hidden="true"></span>
          </div>
          <div class="video-card-content">
            <span>${safeCategory}</span>
            <h3>${safeTitle}</h3>
            <p>${safeDescription}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

function initializeRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function initializeCopyEmail() {
  const button = document.querySelector(".copy-email");

  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    const email = button.dataset.email;

    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      showTemporaryButtonText(button, "Email copied");
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      showTemporaryButtonText(button, "Email copied");
    }
  });
}

function showTemporaryButtonText(button, text) {
  const originalText = button.textContent;

  button.textContent = text;
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1800);
}

function updateCurrentYear() {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = currentYear;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
