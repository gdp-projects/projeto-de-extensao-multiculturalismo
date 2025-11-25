document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeFilters();
});

/**
 * Inicializa os event listeners
 */
function initializeEventListeners() {
    // Barra de pesquisa
    const searchForm = document.querySelector('.search-expanded');
    if (searchForm) {
        searchForm.addEventListener('submit', realizarPesquisa);
    }

    // Chips de filtro rápido
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', aplicarFiltroRapido);
    });

    // Botões de favoritar
    const btnsHeart = document.querySelectorAll('.btn-favorite');
    btnsHeart.forEach(btn => {
        btn.addEventListener('click', toggleFavorito);
    });

    // Botões de ver detalhes
    const btnsViewEvent = document.querySelectorAll('.btn-view-event');
    btnsViewEvent.forEach(btn => {
        btn.addEventListener('click', abrirDetalhesEvento);
    });

    // Filtros avançados
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltrosAvancados);
    });

    // Botão limpar filtros
    const btnClearFilters = document.querySelector('.btn-clear-filters');
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', limparFiltros);
    }

    // Seletor de ordenação
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', aplicarOrdenacao);
    }

    // Paginação
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', irParaPagina);
    });
}

/**
 * Inicializa os filtros com valores padrão
 */
function initializeFilters() {
    // Restaurar favoritos do localStorage
    const favoritosSalvos = JSON.parse(localStorage.getItem('eventosFavoritos') || '[]');
    favoritosSalvos.forEach(eventoId => {
        const btn = document.querySelector(`[data-event-id="${eventoId}"] .btn-favorite`);
        if (btn) {
            btn.classList.add('liked');
            btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
    });
}

/**
 * Realiza a pesquisa
 */
function realizarPesquisa(event) {
    event.preventDefault();
    const termo = document.querySelector('.search-input').value.trim();
    
    if (termo) {
        console.log(`Pesquisando por: ${termo}`);
        alert(`Pesquisando por: "${termo}"`);
    }
}

/**
 * Aplica filtro rápido
 */
function aplicarFiltroRapido(event) {
    const chip = event.target.closest('.filter-chip');
    const filtro = chip.getAttribute('data-filter');
    
    // Remove a classe active de todos
    document.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.remove('active');
    });
    
    // Adiciona a classe active ao clicado
    chip.classList.add('active');
    
    console.log(`Aplicando filtro rápido: ${filtro}`);
    
    // Simula a filtragem
    switch(filtro) {
        case 'all':
            alert('Mostrando todos os eventos');
            break;
        case 'location':
            alert('Filtrando eventos perto de você');
            break;
        case 'trending':
            alert('Mostrando eventos em tendência');
            break;
        case 'today':
            alert('Filtrando eventos de hoje');
            break;
        case 'this-week':
            alert('Filtrando eventos desta semana');
            break;
        case 'free':
            alert('Filtrando eventos gratuitos');
            break;
    }
}

/**
 * Alterna favorito
 */
function toggleFavorito(event) {
    event.preventDefault();
    const btn = event.target.closest('.btn-favorite');
    const eventCard = btn.closest('.event-card');
    const eventoNome = eventCard.querySelector('.event-card-title').textContent;
    
    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        removerDosFavoritos(eventoNome);
    } else {
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        adicionarAosFavoritos(eventoNome);
    }
}

/**
 * Adiciona evento aos favoritos
 */
function adicionarAosFavoritos(eventoNome) {
    console.log(`Adicionado aos favoritos: ${eventoNome}`);
    
    // Salvar no localStorage
    const favoritos = JSON.parse(localStorage.getItem('eventosFavoritos') || '[]');
    if (!favoritos.includes(eventoNome)) {
        favoritos.push(eventoNome);
        localStorage.setItem('eventosFavoritos', JSON.stringify(favoritos));
    }
}

/**
 * Remove evento dos favoritos
 */
function removerDosFavoritos(eventoNome) {
    console.log(`Removido dos favoritos: ${eventoNome}`);
    
    // Remover do localStorage
    const favoritos = JSON.parse(localStorage.getItem('eventosFavoritos') || '[]');
    const index = favoritos.indexOf(eventoNome);
    if (index > -1) {
        favoritos.splice(index, 1);
        localStorage.setItem('eventosFavoritos', JSON.stringify(favoritos));
    }
}

/**
 * Abre detalhes do evento
 */
function abrirDetalhesEvento(event) {
    event.preventDefault();
    const eventCard = event.target.closest('.event-card');
    const eventoNome = eventCard.querySelector('.event-card-title').textContent;
    
    console.log(`Abrindo detalhes do evento: ${eventoNome}`);
    alert(`Abrindo detalhes do evento:\n${eventoNome}`);
    
}

/**
 * Aplica filtros avançados
 */
function aplicarFiltrosAvancados() {
    const categoriasSelecionadas = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(cb => cb.value);
    
    console.log(`Filtros aplicados - Categorias: ${categoriasSelecionadas.join(', ')}`);
   
    alert(`Filtrando por categorias: ${categoriasSelecionadas.join(', ') || 'Nenhuma'}`);
}

/**
 * Limpa todos os filtros
 */
function limparFiltros() {
    // Desmarcar todos os checkboxes
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
        cb.checked = false;
    });
    
    // Limpar input de localização
    const locationInput = document.querySelector('.location-input');
    if (locationInput) {
        locationInput.value = '';
    }
    
    console.log('Filtros limpos');
    alert('Todos os filtros foram removidos');
}

/**
 * Aplica ordenação
 */
function aplicarOrdenacao() {
    const select = document.querySelector('.sort-select');
    const opcao = select.value;
    
    console.log(`Ordenando por: ${opcao}`);
    
    const labelOpcao = select.querySelector(`option[value="${opcao}"]`).textContent;
    alert(`Ordenando por: ${labelOpcao}`);
    
}

/**
 * Navegação de paginação
 */
function irParaPagina(event) {
    event.preventDefault();
    const btn = event.target.closest('.pagination-btn');
    
    if (btn.classList.contains('prev')) {
        console.log('Ir para página anterior');
        alert('Ir para página anterior');
        return;
    }
    
    if (btn.classList.contains('next')) {
        console.log('Ir para próxima página');
        alert('Ir para próxima página');
        return;
    }
    
    const numeroPagina = btn.textContent;
    console.log(`Ir para página: ${numeroPagina}`);
    
    // Atualizar estado ativo
    document.querySelectorAll('.pagination-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    alert(`Carregando página ${numeroPagina}`);
}

/**
 * Busca em tempo real
 */
document.querySelector('.search-input')?.addEventListener('input', function(event) {
    const termo = event.target.value.trim();
    
    if (termo.length > 2) {
        console.log(`Buscando: ${termo}`);
    }
});
