document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    carregarDetalhesEvento();
    atualizarAvatar();
});

const API_URL_BASE = 'http://localhost:8080';

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

// Fetch do evento clicado
async function fetchEventoDetalhes(eventoId) {
    try {
        const response = await fetch(`${API_URL_BASE}/eventos/${eventoId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do evento');
        }
        const eventoDetalhes = await response.json();
        return eventoDetalhes;
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

async function fetchUsuario(userId) {
    try {
        const response = await fetch(`${API_URL_BASE}/usuarios/${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do usuário');
        }
        const userDetails = await response.json();
        return userDetails;
    } catch (error) {
        console.error('Erro na requisição do usuário:', error);
        return null;
    }
}

// Alterar informações do evento na página
async function carregarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId');
    if (!eventoId) {
        console.error('ID do evento não fornecido na URL');
        return;
    }
    const evento = await fetchEventoDetalhes(eventoId);
    console.log('Detalhes do evento carregados:', evento);
    if (!evento) {
        console.error('Detalhes do evento não encontrados');
        return;
    }
    const organizador = await fetchUsuario(evento.id_usuario);
    if (organizador) {
        document.getElementById('event-creator-name').textContent = `${organizador.primeiro_nome} ${organizador.sobrenome}`;
    } else {
        document.getElementById('event-creator-name').textContent = 'Desconhecido';
    }
    const categorias = evento.categoria || [];
    const categoriasFormatadas = categorias.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', ');
    const enderecoPartes = evento.endereco ? evento.endereco.split(',') : [];
    const { nome_local, rua, cep, numero, complemento, bairro, cidade, estado } = {
        nome_local: enderecoPartes[0] || '',
        rua: enderecoPartes[2] || '',
        numero: enderecoPartes[3] || '',
        complemento: enderecoPartes[4] || '',
        bairro: enderecoPartes[5] || '',
        cidade: enderecoPartes[6] || '',
        estado: enderecoPartes[7] || '',
        cep: enderecoPartes[1] || ''
    };

    document.querySelector('.event-title').textContent = evento.nome_evento;
    document.querySelector('.banner-image').src = `${API_URL_BASE}${evento.foto_local}`;
    document.querySelector('.event-date').textContent = `${new Date(evento.data_inicio).toLocaleDateString()} às ${evento.hora_inicio.split(':').slice(0,2).join(':')} até ${new Date(evento.data_fim).toLocaleDateString()} às ${evento.hora_fim.split(':').slice(0,2).join(':')}`;
    document.querySelector('.event-location-local').textContent = nome_local;
    document.querySelector('.event-location-address').textContent = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}, \n CEP: ${cep}`;
    document.querySelector('.event-location').textContent = `${nome_local} em ${cidade} - ${estado}`;
    document.querySelector('.event-categories').textContent = categoriasFormatadas;
    document.querySelector('.event-description').textContent = evento.descricao;
    document.querySelector('.location-map-iframe').src = `https://www.google.com/maps?q=${encodeURIComponent(`${nome_local}, ${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`)}&output=embed`;

}

carregarDetalhesEvento();

// Restaurar estado de favorito ao carregar
setTimeout(restaurarEstadoFavorito, 100);

// Função para alterar foto de perfil no topbar
function atualizarAvatar() {
  const avatarBtn = document.querySelector(".avatar");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (avatarBtn && usuario && usuario.foto) {
    avatarBtn.style.background = `url('${API_URL_BASE}${usuario.foto}')`;
    avatarBtn.style.backgroundSize = 'cover';
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