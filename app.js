const nav = document.getElementById("nav");
const menu = document.querySelector(".menu-toggle");
const navActions = document.querySelector(".nav-actions");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 14);
}, { passive: true });

menu?.addEventListener("click", () => {
  const isOpen = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!isOpen));
  navActions.classList.toggle("mobile-open", !isOpen);
});

navActions?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu?.setAttribute("aria-expanded", "false");
    navActions.classList.remove("mobile-open");
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


/* Hero scroll choreography */
const hero = document.querySelector(".hero");
const heroS = document.querySelector(".hero-s-image");
const heroHeader = document.querySelector(".hero-header-image");
const heroStatus = document.querySelector(".hero .status");
const heroPayoff = document.querySelector(".hero .hero-payoff");
const heroDescription = document.querySelector(".hero .hero-description");
const heroCta = document.querySelector(".hero .hero-cta");
const heroScroll = document.querySelector(".hero .hero-scroll");

let heroRaf = 0;
let lastHeroProgress = -1;

function easeInOut(t){
  return t * t * (3 - 2 * t);
}

function updateHeroMotion(){
  heroRaf = 0;
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const range = Math.max(1, hero.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, window.scrollY / range));

  if (Math.abs(progress - lastHeroProgress) < 0.001) return;
  lastHeroProgress = progress;

  const mobile = window.matchMedia("(max-width:720px)").matches;

  if (mobile){
    /*
      Mobile deliberately uses one clean slide:
      SPECTRA rises past the S and settles just above CURRENTLY IN DEVELOPMENT.
      It does NOT attempt the desktop logo-lock composition.
    */
    const merge = Math.max(0, Math.min(1, (progress - 0.04) / 0.52));
    const eased = easeInOut(merge);

    const targetLift =
      heroStatus.offsetTop -
      heroHeader.offsetTop -
      heroHeader.offsetHeight -
      14;

    const lift = targetLift * eased;

    heroHeader.style.transform = `translate3d(0, ${lift}px, 0)`;
    heroS.style.transform = `translate3d(0, ${Math.min(5, 5 * eased)}px, 0) scale(${1 + .025 * eased})`;

    const fade = easeInOut(Math.max(0, Math.min(1, (progress - .48) / .30)));
    heroPayoff.style.transform = `translate3d(0, ${-12 * fade}px, 0)`;
    heroPayoff.style.opacity = String(1 - .82 * fade);
    heroDescription.style.transform = `translate3d(0, ${-16 * fade}px, 0)`;
    heroDescription.style.opacity = String(1 - fade);
    heroCta.style.transform = `translate3d(0, ${-18 * fade}px, 0)`;
    heroCta.style.opacity = String(1 - fade);
    heroStatus.style.opacity = String(1 - .72 * eased);
    heroScroll.style.opacity = String(1 - fade);
  } else {
    // Desktop: the wordmark rises into the center of the S.
    const merge = Math.min(1, Math.max(0, (progress - 0.06) / 0.58));
    const eased = easeInOut(merge);
    const headerLift = -205 * eased;

    heroHeader.style.transform = `translate3d(0, ${headerLift}px, 0)`;
    heroS.style.transform = `translate3d(0, ${4 * eased}px, 0) scale(${1 + .045 * eased})`;

    const fade = easeInOut(Math.max(0, Math.min(1, (progress - .58) / .28)));
    heroPayoff.style.transform = `translate3d(0, ${-18 * fade}px, 0)`;
    heroPayoff.style.opacity = String(1 - .82 * fade);
    heroDescription.style.transform = `translate3d(0, ${-24 * fade}px, 0)`;
    heroDescription.style.opacity = String(1 - fade);
    heroCta.style.transform = `translate3d(0, ${-28 * fade}px, 0)`;
    heroCta.style.opacity = String(1 - fade);
    heroStatus.style.opacity = String(1 - .7 * eased);
    heroScroll.style.opacity = String(1 - fade);
  }
}

function requestHeroMotion(){
  if (!heroRaf) heroRaf = requestAnimationFrame(updateHeroMotion);
}

window.addEventListener("scroll", requestHeroMotion, {passive:true});
window.addEventListener("resize", requestHeroMotion, {passive:true});
window.addEventListener("orientationchange", () => {
  lastHeroProgress = -1;
  requestHeroMotion();
}, {passive:true});
requestHeroMotion();

/*
  Q&A accordion.
  The placeholder items are disabled until real questions are inserted.
  For real items, remove `disabled` from the trigger.
*/
document.querySelectorAll(".accordion-item:not(.placeholder-item)").forEach(item => {
  const trigger = item.querySelector(".accordion-trigger");
  const answer = item.querySelector(".accordion-answer");

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".accordion-item").forEach(other => {
      if (other !== item) {
        const otherTrigger = other.querySelector(".accordion-trigger");
        const otherAnswer = other.querySelector(".accordion-answer");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        if (otherAnswer) {
          otherAnswer.hidden = true;
          otherAnswer.style.maxHeight = "0px";
        }
      }
    });

    trigger.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      answer.hidden = false;
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = "0px";
      window.setTimeout(() => { answer.hidden = true; }, 300);
    }
  });
});

const form = document.getElementById("waitlist-form");
const note = document.getElementById("form-note");

form?.addEventListener("submit", event => {
  event.preventDefault();

  /*
    Connect this handler to the actual email provider later.
    No fake submission is performed in this prototype.
  */
  note.textContent = "Form ready. Connect your email provider to activate the waitlist.";
  note.style.color = "#1597ff";
});

document.querySelector("[data-privacy-link]")?.addEventListener("click", () => {
  requestAnimationFrame(() => {
    document.getElementById("privacy")?.scrollIntoView({behavior:"smooth", block:"center"});
  });
});
