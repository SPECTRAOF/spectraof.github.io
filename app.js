const nav = document.getElementById("nav");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 18);
}, {passive:true});

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  navLinks.classList.toggle("mobile-open", !open);
  menuButton.textContent = open ? "☰" : "×";
  menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const tabs = document.querySelectorAll(".layer-tab");
const stage = document.getElementById("stageChart");
const label = document.getElementById("layerLabel");

const layerMap = {
  chart: ["CHARTING", []],
  volume: ["VOLUME", []],
  profile: ["VOLUME PROFILE", ["show-profile"]],
  footprint: ["FOOTPRINT", ["show-footprint"]],
  delta: ["DELTA & CVD", ["show-cvd"]],
  depth: ["MARKET DEPTH", ["show-dom"]]
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const [text, classes] = layerMap[tab.dataset.layer];
    label.textContent = text;
    stage.className = "stage-chart";
    classes.forEach(c => stage.classList.add(c));
  });
});

const signup = document.getElementById("signup");
const formMessage = document.getElementById("form-message");

signup?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  if (!email.value || !email.checkValidity()) {
    email.reportValidity();
    return;
  }
  formMessage.textContent = "You're on the radar. The early access list will open soon.";
  formMessage.style.color = "#18c77a";
  email.value = "";
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", () => {
    navLinks?.classList.remove("mobile-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});
