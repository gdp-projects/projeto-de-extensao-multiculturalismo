const track = document.querySelector(".carousel-track");
const items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const indicatorsContainer = document.querySelector(".indicators");

let current = 0;
let autoPlayInterval;
let startX = 0;
let endX = 0;

// Zera qualquer classe estática que tenha vindo do HTML
items.forEach(el => (el.className = "carousel-item"));

// Cria os dots
indicatorsContainer.innerHTML = "";
items.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  indicatorsContainer.appendChild(dot);
});
const dots = Array.from(document.querySelectorAll(".dot"));

// Helpers
const mod = (n, m) => ((n % m) + m) % m;

function updateCarousel() {
  const n = items.length;

  items.forEach((item, i) => {
    // reset para garantir estado limpo
    item.className = "carousel-item";

    if (i === current) {
      item.classList.add("active");
    } else if (i === mod(current + 1, n)) {
      item.classList.add("next");
    } else if (i === mod(current - 1, n)) {
      item.classList.add("prev");
    } else if (i === mod(current + 2, n)) {
      item.classList.add("next-2");
    } else if (i === mod(current - 2, n)) {
      item.classList.add("prev-2");
    } else {
      item.classList.add("hidden");
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
  });
}

function nextSlide() {
  current = mod(current + 1, items.length);
  updateCarousel();
}

function prevSlide() {
  current = mod(current - 1, items.length);
  updateCarousel();
}

function goToSlide(index) {
  current = mod(index, items.length);
  updateCarousel();
  resetAutoPlay();
}

// autoplay a cada 5s
function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(nextSlide, 5000);
}
function stopAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
}
function resetAutoPlay() {
  startAutoPlay();
}

// Botões
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });
}
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });
}

// Swipe no mobile
if (track) {
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextSlide(); else prevSlide();
      resetAutoPlay();
    }
  });
}

// Início
updateCarousel();
startAutoPlay();
