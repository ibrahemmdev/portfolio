
// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const progress = document.getElementById("progress");

if (!reduceMotion && window.Motion) {
  const { animate, inView, stagger } = window.Motion;

  const ease = [0.22, 1, 0.36, 1];

  // -------------------------
  // 1. Hero animation
  // -------------------------

  const heroItems = document.querySelectorAll("[data-hero]");

  heroItems.forEach((el) => {
    el.style.opacity = "0";
  });

  animate(
    heroItems,
    {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0px)"],
    },
    {
      duration: 0.65,
      delay: stagger(0.08),
      ease,
    }
  );

  // -------------------------
  // 2. Scroll reveal
  // -------------------------

  const revealItems = document.querySelectorAll("[data-reveal]");

  revealItems.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";

    inView(
      el,
      () => {
        animate(
          el,
          {
            opacity: 1,
            transform: "translateY(0px)",
          },
          {
            duration: 0.55,
            ease,
          }
        );
      },
      {
        amount: 0.15,
        once: true,
      }
    );
  });

} else {
  // No animation / reduced motion
  document
    .querySelectorAll("[data-hero], [data-reveal]")
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
}


// -------------------------
// 3. Lightweight scroll progress
// -------------------------

let progressTicking = false;

function updateProgress() {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progressValue =
    scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

  progress.style.transform = `scaleX(${progressValue})`;

  progressTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!progressTicking) {
      requestAnimationFrame(updateProgress);
      progressTicking = true;
    }
  },
  { passive: true }
);

updateProgress();

