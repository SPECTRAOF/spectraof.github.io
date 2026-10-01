(() => {
  "use strict";

  const root = document.documentElement;
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  const cssHref = "education.css";
  if (!document.querySelector(`link[data-spectra-education-css]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    link.dataset.spectraEducationCss = "true";
    document.head.appendChild(link);
  }

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "education-trigger";
  trigger.textContent = "EDUCATION";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  navActions.appendChild(trigger);

  const overlay = document.createElement("div");
  overlay.className = "education-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <section class="education-panel" role="dialog" aria-modal="true" aria-label="SPECTRA Education">
      <button class="education-close" type="button" aria-label="Close Education"></button>
      <div class="education-content"></div>
    </section>
  `;
  document.body.appendChild(overlay);

  const panel = overlay.querySelector(".education-panel");
  const content = overlay.querySelector(".education-content");
  const closeButton = overlay.querySelector(".education-close");
  let loaded = false;
  let lastFocus = null;

  async function loadEducation() {
    if (loaded) return;
    content.innerHTML = '<div style="padding:120px 6vw;color:#657783;font:11px var(--mono)">LOADING EDUCATION...</div>';
    try {
      const response = await fetch("education.html", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      content.replaceChildren(...Array.from(doc.body.children));
      loaded = true;
      wireEducationInteractions();
    } catch (error) {
      content.innerHTML = '<div style="padding:120px 6vw;color:#8b98a1;font:12px var(--mono)">EDUCATION COULD NOT BE LOADED.<br><br>Make sure education.html is in the same folder as index.html.</div>';
      console.error("SPECTRA Education:", error);
    }
  }

  function wireEducationInteractions() {
    const search = content.querySelector("#education-search-input");
    const groups = Array.from(content.querySelectorAll(".edu-group"));
    const filters = Array.from(content.querySelectorAll("[data-filter]"));
    let activeFilter = "all";

    function updateGroups() {
      const query = (search?.value || "").trim().toLowerCase();
      groups.forEach(group => {
        const levelMatch = activeFilter === "all" || group.dataset.level === activeFilter;
        const searchMatch = !query || (group.dataset.search || "").toLowerCase().includes(query) || group.textContent.toLowerCase().includes(query);
        group.classList.toggle("education-hidden", !(levelMatch && searchMatch));
      });
    }

    search?.addEventListener("input", updateGroups);
    filters.forEach(button => button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filters.forEach(item => item.classList.toggle("is-active", item === button));
      updateGroups();
    }));
  }

  function openEducation() {
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("education-locked");
    loadEducation();
    window.setTimeout(() => closeButton.focus(), 80);
  }

  function closeEducation() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("education-locked");
    window.setTimeout(() => lastFocus?.focus?.(), 120);
  }

  trigger.addEventListener("click", openEducation);
  closeButton.addEventListener("click", closeEducation);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeEducation();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeEducation();
  });

  // On mobile the existing menu script does not know about dynamically-added links.
  // Close the menu as soon as Education opens.
  trigger.addEventListener("click", () => {
    const menu = document.querySelector(".menu-toggle");
    const actions = document.querySelector(".nav-actions");
    menu?.setAttribute("aria-expanded", "false");
    actions?.classList.remove("mobile-open");
  });
})();
