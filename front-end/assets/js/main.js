const API_URL_BASE = 'http://localhost:8080/';

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
const myEvents = document.getElementById("my-events");
  if (localStorage.getItem("token")) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario.isorganizer) {
          eventCreate.style.display = "none";
          myEvents.style.display = "none";
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
const dataCincoDiasDepois = new Date();
dataCincoDiasDepois.setDate(dataCincoDiasDepois.getDate() + 5);
const dataCincoDiasDepoisISO = dataCincoDiasDepois.toISOString().split('T')[0];

console.log('Data hoje:', dataHoje);
if (eventosHojeContainer) {
  fetch(`${API_URL_BASE}eventos`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(eventos => {
      console.log('Eventos recebidos:', eventos);
      // Limpa os containers (se existirem)
      if (eventosHojeContainer) eventosHojeContainer.innerHTML = '';
      if (eventosHojeContainerMobile) eventosHojeContainerMobile.innerHTML = '';
      if (eventosProximosContainer) eventosProximosContainer.innerHTML = '';
      if (eventosProximosContainerMobile) eventosProximosContainerMobile.innerHTML = '';

      const hojeList = [];
      const proximosList = [];

      eventos.slice(0, 5).forEach(evento => {
        const dataEvento = new Date(evento.data_inicio).toISOString().split('T')[0];

        if (dataEvento === dataHoje) {
          hojeList.push(evento);
        }

        if (dataEvento > dataHoje && dataEvento <= dataCincoDiasDepoisISO) {
          proximosList.push(evento);
        }
      });

      // Renderizar eventos de hoje
      if (hojeList.length > 0) {
        hojeList.forEach(evento => {
          const eventoDiv = document.createElement('a');
          eventoDiv.classList.add('evento');
          eventoDiv.href = `./pages/evento/evento.html?eventoId=${evento.id}`;
          eventoDiv.innerHTML = `
            <img src="${API_URL_BASE}${evento.foto_local}" alt="${evento.nome_evento}">
            <div class="conteudo">
              <h3>${evento.nome_evento}</h3>
              <p>${evento.descricao}</p>
              <span class="data">${new Date(evento.data_inicio).toLocaleDateString()}</span>
            </div>
          `;
          if (eventosHojeContainer) eventosHojeContainer.appendChild(eventoDiv);
          if (eventosHojeContainerMobile && eventoDiv) {
            const eventoDivMobile = eventoDiv.cloneNode(true);
            eventosHojeContainerMobile.appendChild(eventoDivMobile);
          }
        });
      } else {
        if (eventosHojeContainer) eventosHojeContainer.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
        if (eventosHojeContainerMobile) eventosHojeContainerMobile.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
      }

      // Renderizar eventos próximos
      if (proximosList.length > 0) {
        proximosList.forEach(evento => {
          console.log('Evento próximo:', evento);
          const eventoDiv = document.createElement('a');
          eventoDiv.classList.add('evento');
          eventoDiv.href = `./pages/evento/evento.html?eventoId=${evento.id}`;
          eventoDiv.innerHTML = `
              <img src="${API_URL_BASE}${evento.foto_local}" alt="${evento.nome_evento}">
              <div class="conteudo">
                <h3>${evento.nome_evento}</h3>
                <p>${evento.descricao}</p>
                <span class="data">${new Date(evento.data_inicio).toLocaleDateString()}</span>
              </div>
          `;
          if (eventosProximosContainer) eventosProximosContainer.appendChild(eventoDiv);
          if (eventosProximosContainerMobile && eventoDiv) {
            const eventoDivMobile = eventoDiv.cloneNode(true);
            eventosProximosContainerMobile.appendChild(eventoDivMobile);
          }
        });
      } else {
        if (eventosProximosContainer) eventosProximosContainer.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
        if (eventosProximosContainerMobile) eventosProximosContainerMobile.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar eventos:', error);
    });
} else {
  console.warn('Container .eventos-hoje não encontrado no DOM.');
}

// Função para alterar foto de perfil no topbar
function atualizarAvatar() {
  const avatarBtn = document.querySelector(".avatar");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (avatarBtn && usuario && usuario.foto) {
    avatarBtn.style.background = `url('${API_URL_BASE}${usuario.foto}')`;
  } else {
    console.warn('Avatar button or user photo not found.');
  }
}

// Clicar no avatar abre o perfil
const avatarBtn = document.querySelector(".avatar");
if (avatarBtn) {
  avatarBtn.addEventListener("click", () => {
    window.location.href = "./pages/perfil_usuario/inicio.html";
  }
);
}

// Função de busca de eventos
const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchForm.querySelector(".search__input").value.trim();
    if (query) {
      window.location.href = `./pages/pesquisa/pesquisa.html?query=${encodeURIComponent(query)}`;
    }
  });
}

// Início
console.log(localStorage.getItem("usuario"));
atualizarAvatar();
updateCarousel();
startAutoPlay();
usuarioLogado();

