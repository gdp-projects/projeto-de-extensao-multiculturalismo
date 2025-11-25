document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});


function initializeEventListeners() {
    // Botão voltar
    const btnVoltar = document.getElementById('btn-voltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', voltarPagina);
    }

    // Botões de ação
    const btnsComprar = document.querySelectorAll('.btn-ticket-action');
    btnsComprar.forEach(btn => {
        btn.addEventListener('click', abrirCompraBilhete);
    });

    // Botão compartilhar
    const btnCompartilhar = document.querySelector('.btn-secondary');
    if (btnCompartilhar) {
        btnCompartilhar.addEventListener('click', compartilharEvento);
    }

    // Botão favoritar
    const btnFavoritar = document.querySelector('.btn-outline');
    if (btnFavoritar) {
        btnFavoritar.addEventListener('click', favoritarEvento);
    }

    // Botão comprar ingresso principal
    const btnComprarPrincipal = document.querySelector('.btn-primary');
    if (btnComprarPrincipal) {
        btnComprarPrincipal.addEventListener('click', abrirCompraBilhete);
    }
}

/**
 * Volta para a página anterior
 */
function voltarPagina() {
    window.history.back();
}

/**
 * página de compra de bilhete
 */
function abrirCompraBilhete(event) {
    const nomeIngresso = event.target.closest('.ticket-option')?.querySelector('h3')?.textContent || 'Ingresso';
    const precoIngresso = event.target.closest('.ticket-option')?.querySelector('.ticket-price')?.textContent || 'Gratuito';
    
    console.log(`Abrindo compra de: ${nomeIngresso} - ${precoIngresso}`);
    
    alert(`Redirecionando para compra de ${nomeIngresso}...\nPreço: ${precoIngresso}`);
}

/**
 * Compartilha o evento
 */
function compartilharEvento() {
    const nomeEvento = document.querySelector('.event-title')?.textContent || 'Evento';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: nomeEvento,
            text: 'Confira este evento incrível!',
            url: url
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        copiarParaAreaTransferencia(url);
        alert('Link copiado para a área de transferência!');
    }
}

/**
 * Marca/desmarca evento como favorito
 */
function favoritarEvento(event) {
    const btn = event.target.closest('.btn-outline');
    const isFavorited = btn.classList.contains('favorited');
    
    if (isFavorited) {
        btn.classList.remove('favorited');
        btn.textContent = 'Favoritar';
        localStorage.removeItem('evento_favorited');
        console.log('Evento removido de favoritos');
    } else {
        btn.classList.add('favorited');
        btn.textContent = '★ Favoritado';
        localStorage.setItem('evento_favorited', 'true');
        console.log('Evento adicionado aos favoritos');
    }
}

/**
 * Copia texto para a área de transferência
 */
function copiarParaAreaTransferencia(texto) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

/**
 * Restaura estado de favorito ao carregar a página
 */
function restaurarEstadoFavorito() {
    const isFavorited = localStorage.getItem('evento_favorited');
    if (isFavorited) {
        const btnFavoritar = document.querySelector('.btn-outline');
        if (btnFavoritar) {
            btnFavoritar.classList.add('favorited');
            btnFavoritar.textContent = '★ Favoritado';
        }
    }
}

// Restaurar estado de favorito ao carregar
setTimeout(restaurarEstadoFavorito, 100);
