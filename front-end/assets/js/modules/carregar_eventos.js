const API_URL_BASE = 'http://localhost:8080/';
// Função para carregar eventos do usuário e exibi-los na página
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const eventsList = document.getElementById('eventsList');

    // Se não estiver logado, redireciona para login
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !token) {
        window.location.href = '../../pages/login.html';
        return;
    }

    async function carregarEventosUsuario() {
        try {
            const idUsuario = usuario.id_usuario || usuario.id;
            if (!idUsuario) {
                if (eventsList) eventsList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
                return;
            }

            const resp = await fetch(`${API_URL_BASE}eventos/usuario/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resp.status === 401 || resp.status === 403) {
                localStorage.removeItem('token');
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = '../../pages/login.html';
                return;
            }

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                if (eventsList) eventsList.innerHTML = `<p>Erro ao carregar eventos: ${err.error || resp.statusText}</p>`;
                return;
            }

            const eventos = await resp.json();
            if (!Array.isArray(eventos) || eventos.length === 0) {
                if (eventsList) eventsList.innerHTML = '<p>Você ainda não criou nenhum evento.</p>';
                return;
            }

            if (!eventsList) return;

            // Renderiza lista de eventos
            eventsList.innerHTML = eventos.map(ev => {
                const foto = `${API_URL_BASE}${ev.foto_local}` || '../../assets/images/default-event.jpg';
                const nome = ev.nome_evento || 'Sem título';
                const data_inicio = ev.data_inicio ? new Date(ev.data_inicio).toLocaleDateString() : '';
                const hora_inicio = ev.hora_inicio ? ev.hora_inicio.slice(0,5) : '';
                const status = ev.status || '';

                return `
                    <div class="event-card">
                        <img src="${foto}" alt="imagem do evento">

                        <div class="event-info">
                            <h2>${nome}</h2>
                            <p>${data_inicio} • ${hora_inicio} • ${status}</p>

                            <div class="event-actions">
                                <a href="#" class="btn-editar">Editar</a>
                                <a href="../evento/evento.html?eventoId=${ev.id}" class="btn-ver">Ver</a>
                            </div>
                        </div>
                    </div>`;
            }).join('');

        } catch (error) {
            console.error('Erro ao carregar eventos do usuário', error);
            if (eventsList) eventsList.innerHTML = '<p>Ocorreu um erro ao carregar seus eventos.</p>';
        }
    }

    // Executa carregamento
    carregarEventosUsuario();
});

