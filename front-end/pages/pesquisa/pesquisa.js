const API_URL_BASE = 'http://localhost:8080/';

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeFilters();
    usuarioLogado();
    atualizarAvatar();
});

function initializeEventListeners() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchForm.querySelector('.search-input').value.trim();
            if (query) {
                window.location.href = `./pesquisa.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
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

// Função de filtrar eventos
function initializeFilters() {
  const filterForm = document.getElementById('category-filter');
  const filtros = [];
  if (filterForm) {
    filterForm.addEventListener('change', function() {
      const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]:checked');
      filtros.length = 0;
      checkboxes.forEach(checkbox => {
        filtros.push(checkbox.value);
      });
      aplicarFiltros(filtros);
    });
  }
}

function aplicarFiltros(filtros) {
  const eventos = document.querySelectorAll('.event-card');
  eventos.forEach(evento => {
    const categoriaEvento = evento.getAttribute('data-category');
    const categorias = categoriaEvento.split(',').map(cat => cat.trim());
    console.log(filtros.includes(categorias));
    if (filtros.length === 0) {
      evento.style.display = 'block';
    } else if (filtros.some(filtro => categorias.includes(filtro))){
      evento.style.display = 'block';
    } else {
      evento.style.display = 'none';
    }
  });
}

// Carregar eventos
const eventosPesquisados = document.querySelector('.events-grid');
if (eventosPesquisados) {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query') || '';
    fetch(`${API_URL_BASE}eventos/pesquisa?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('total-eventos-busca').textContent = data.length;
        eventosPesquisados.innerHTML = '';
        if (data.length > 0) {
            data.forEach(evento => {
                console.log('Evento encontrado:', evento);
                const dataInicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR');
                const dataFim = new Date(evento.data_fim).toLocaleDateString('pt-BR');
                const cidade_estado = `${evento.endereco.split(', ')[6]} - ${evento.endereco.split(', ')[7]}`;
                const eventoDiv = document.createElement('div');
                eventoDiv.classList.add('event-card');
                // garantir que o elemento que será mostrado/escondido pelo filtro tenha o atributo data-category
                eventoDiv.setAttribute('data-category', evento.categoria);
                eventoDiv.innerHTML = `
                    <article class="event-card" data-category="${evento.categoria}">
                            <div class="event-card-image">
                                <img src="${API_URL_BASE}${evento.foto_local}" alt="${evento.nome_evento}">
                                <div class="event-card-overlay">
                                    <button class="btn-favorite">
                                        <i class="fa-regular fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="event-card-content">
                                <h3 class="event-card-title">${evento.nome_evento || 'Evento'}</h3>
                                <p class="event-card-date">
                                    <i class="fa-solid fa-calendar"></i> ${dataInicio} - ${dataFim}
                                </p>
                                <p class="event-card-location">
                                    <i class="fa-solid fa-location-dot"></i> ${cidade_estado || 'Local não informado'}
                                </p>
                                <a href="../evento/evento.html?eventoId=${evento.id}">
                                    <button class="btn-view-event">Ver detalhes</button>
                                </a>
                            </div>
                        </article>
                `;
                eventosPesquisados.appendChild(eventoDiv);
            });
        } else {
            eventosPesquisados.innerHTML = '<p>Nenhum evento encontrado para a pesquisa.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar eventos pesquisados:', error);
        eventosPesquisados.innerHTML = '<p>Ocorreu um erro ao carregar os eventos.</p>';
    });
} else {
  console.warn('Container .events-grid não encontrado no DOM.');
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
    window.location.href = "/front-end/pages/perfil_usuario/inicio.html";
  }
);
}