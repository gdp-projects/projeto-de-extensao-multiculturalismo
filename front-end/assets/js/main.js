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

// Verifica se usuário está logado
function usuarioLogado() {
const topbarLogged = document.getElementById("topbar__logged");
const topbarRegister = document.getElementById("topbar__register");
const eventCreate = document.getElementById("create-event");
  if (localStorage.getItem("token")) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario.isorganizer) {
          eventCreate.style.display = "none";
      }
      topbarLogged.style.display = "flex";
      topbarRegister.style.display = "none";
  } else {
      topbarRegister.style.display = "flex";
      topbarLogged.style.display = "none";
  }
}

// Função para aparecer os novos eventos na sessão de eventos hoje e eventos próximos
const eventosHojeContainer = document.querySelector('.eventos-hoje');
const eventosHojeContainerMobile = document.querySelector('.eventos-hoje-mobile');
const eventosProximosContainer = document.querySelector('.eventos-proximos');
const eventosProximosContainerMobile = document.querySelector('.eventos-proximos-mobile');

const dataHoje = new Date().toISOString().split('T')[0];
const dataCincoDiasAntes = new Date();
dataCincoDiasAntes.setDate(dataCincoDiasAntes.getDate() - 5);
const dataCincoDiasAntesISO = dataCincoDiasAntes.toISOString().split('T')[0];

console.log('Data hoje:', dataHoje);
if (eventosHojeContainer) {
  // Use HTTP: backend runs on http://localhost:8080
  fetch('http://localhost:8080/eventos')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(eventos => {
      console.log('Eventos recebidos:', eventos);
      eventosHojeContainer.innerHTML = ''; // Limpa o conteúdo existente
      eventosHojeContainerMobile.innerHTML = ''; // Limpa o conteúdo existente para mobile
      eventos.slice(0, 5).forEach(evento => {
        const dataEvento = new Date(evento.data).toISOString().split('T')[0];
        if (dataEvento === dataHoje) {
          const eventoDiv = document.createElement('div');
          eventoDiv.classList.add('evento');
          eventoDiv.innerHTML = `
            <img src="http://localhost:8080${evento.foto_local}" alt="${evento.nome_evento}">
            <div class="conteudo">
              <h3>${evento.nome_evento}</h3>
              <p>${evento.descricao}</p>
              <span class="data">${new Date(evento.data).toLocaleDateString()}</span>
            </div>
          `;
          eventosHojeContainer.appendChild(eventoDiv);
          // Clona para o container mobile
          const eventoDivMobile = eventoDiv.cloneNode(true);
          eventosHojeContainerMobile.appendChild(eventoDivMobile);
        } else {
          eventosHojeContainer.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
          eventosHojeContainerMobile.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
        }
        
        if (dataEvento < dataHoje && dataEvento >= dataCincoDiasAntesISO) {
          const eventoDiv = document.createElement('div');
          eventoDiv.classList.add('evento');
          eventoDiv.innerHTML = `
            <img src="http://localhost:8080${evento.foto_local}" alt="${evento.nome_evento}">
            <div class="conteudo">
              <h3>${evento.nome_evento}</h3>
              <p>${evento.descricao}</p>
              <span class="data">${new Date(evento.data).toLocaleDateString()}</span>
            </div>
          `;
          eventosProximosContainer.appendChild(eventoDiv);
          // Clona para o container mobile
          const eventoDivMobile = eventoDiv.cloneNode(true);
          eventosProximosContainerMobile.appendChild(eventoDivMobile);
        } else {
          eventosProximosContainer.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
          eventosProximosContainerMobile.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
        }
      });
    })
    .catch(error => {
      console.error('Erro ao carregar eventos:', error);
    });
} else {
  console.warn('Container .eventos-hoje não encontrado no DOM.');
}

// Início
updateCarousel();
startAutoPlay();
usuarioLogado();

