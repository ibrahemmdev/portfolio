// ========================================
// Footer Year
// ========================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// ========================================
// Motion Settings
// ========================================

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ========================================
// Entrance Animations
// ========================================

if (!reduceMotion && window.Motion) {
  const { animate, inView, stagger } = window.Motion;

  const ease = [0.22, 1, 0.36, 1];


  // ----------------------------------------
  // Hero Animation
  // ----------------------------------------

  const heroItems = document.querySelectorAll("[data-hero]");

  heroItems.forEach((el) => {
    el.style.opacity = "0";
  });

  if (heroItems.length) {
    animate(
      heroItems,
      {
        opacity: [0, 1],
        transform: [
          "translate3d(0, 20px, 0)",
          "translate3d(0, 0, 0)"
        ],
      },
      {
        duration: 0.6,
        delay: stagger(0.07),
        ease,
      }
    );
  }


  // ----------------------------------------
  // Scroll Reveal
  // ----------------------------------------

  const revealItems = document.querySelectorAll("[data-reveal]");

  revealItems.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translate3d(0, 20px, 0)";

    inView(
      el,
      () => {
        animate(
          el,
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
          {
            duration: 0.5,
            ease,
          }
        );
      },
      {
        amount: 0.12,
        once: true,
      }
    );
  });

} else {

  // ----------------------------------------
  // Reduced Motion / No Motion Library
  // ----------------------------------------

  document
    .querySelectorAll("[data-hero], [data-reveal]")
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
}


// ========================================
// Lightweight Scroll Progress
// ========================================

const progress = document.getElementById("progress");

if (progress) {
  let progressTicking = false;

  function updateProgress() {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollPosition = window.scrollY;

    const progressValue =
      scrollHeight > 0
        ? Math.min(scrollPosition / scrollHeight, 1)
        : 0;

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
    {
      passive: true,
    }
  );

  updateProgress();
}


// ========================================
// Project Image Galleries
// ========================================

document.querySelectorAll(".project-gallery").forEach((gallery) => {

  const images = gallery.querySelectorAll(".gallery-image");
  const previousButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  const dotsContainer = gallery.querySelector(".gallery-dots");

  // Nothing to do if there are no images
  if (!images.length) return;

  let currentIndex = 0;


  // ----------------------------------------
  // Create Dots
  // ----------------------------------------

  images.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "gallery-dot";

    dot.setAttribute(
      "aria-label",
      `Show image ${index + 1}`
    );

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      showImage(index);
    });

    dotsContainer.appendChild(dot);
  });


  const dots = dotsContainer.querySelectorAll(".gallery-dot");


  // ----------------------------------------
  // Show Image
  // ----------------------------------------

  function showImage(index) {

    if (index < 0) {
      index = images.length - 1;
    }

    if (index >= images.length) {
      index = 0;
    }

    currentIndex = index;


    images.forEach((image, imageIndex) => {

      image.classList.toggle(
        "active",
        imageIndex === currentIndex
      );

    });


    dots.forEach((dot, dotIndex) => {

      dot.classList.toggle(
        "active",
        dotIndex === currentIndex
      );

    });

  }


  // ----------------------------------------
  // Previous
  // ----------------------------------------

  if (previousButton) {

    previousButton.addEventListener("click", () => {
      showImage(currentIndex - 1);
    });

  }


  // ----------------------------------------
  // Next
  // ----------------------------------------

  if (nextButton) {

    nextButton.addEventListener("click", () => {
      showImage(currentIndex + 1);
    });

  }


  // ----------------------------------------
  // Keyboard Navigation
  // ----------------------------------------

  gallery.addEventListener("keydown", (event) => {

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

  });


  // ----------------------------------------
  // Touch Swipe
  // ----------------------------------------

  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    {
      passive: true,
    }
  );


  gallery.addEventListener(
    "touchend",
    (event) => {

      touchEndX = event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;


      // Swipe left
      if (difference > 50) {
        showImage(currentIndex + 1);
      }


      // Swipe right
      if (difference < -50) {
        showImage(currentIndex - 1);
      }

    },
    {
      passive: true,
    }
  );


  // ----------------------------------------
  // Initial State
  // ----------------------------------------

  showImage(0);

});


// ========================================
// Project Image Lazy Loading
// ========================================

document
  .querySelectorAll(".gallery-image")
  .forEach((image, index) => {

    // First image loads immediately
    if (index === 0) {
      image.loading = "eager";
    } else {
      image.loading = "lazy";
    }

    image.decoding = "async";

  });
