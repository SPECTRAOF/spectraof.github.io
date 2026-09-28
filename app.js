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
