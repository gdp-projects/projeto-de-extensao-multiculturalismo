const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const indicatorsContainer = document.querySelector(".indicators");

let current = 0;
let autoPlayInterval;

// Criar bolinhas (dots)
items.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  indicatorsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateCarousel() {
  items.forEach((item, i) => {
    item.classList.remove("active", "prev", "next", "hidden");

    if (i === current) {
      item.classList.add("active");
    } else if (i === (current + 1) % items.length) {
      item.classList.add("next");
    } else if (i === (current - 1 + items.length) % items.length) {
      item.classList.add("prev");
    } else {
      item.classList.add("hidden");
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
  });
}

function nextSlide() {
  current = (current + 1) % items.length;
  updateCarousel();
}

function prevSlide() {
  current = (current - 1 + items.length) % items.length;
  updateCarousel();
}

function goToSlide(index) {
  current = index;
  updateCarousel();
  resetAutoPlay();
}

// autoplay a cada 5s
function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// Eventos
nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoPlay();
});
prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoPlay();
});

// Inicialização
updateCarousel();
startAutoPlay();
