document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES ---
    const API_URL_BASE = 'http://localhost:8080';
    const API_IBGE_CIDADES = 'https://servicodados.ibge.gov.br/api/v1/localidades/microrregioes/29012|29016|29020/municipios';


    // --- HELPERS ---
    let selectedImageFile = null;
    const getUserToken = () => localStorage.getItem('token');
    const getUserInfo = () => {
        const userJson = localStorage.getItem('usuario');
        return userJson ? JSON.parse(userJson) : null;
    }

    console.log('User Info:', getUserInfo());

    const qs = (sel, parent = document) => parent.querySelector(sel);
    const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

    const uploadImage = async (file, token) => {
        const formData = new FormData();
        formData.append("foto", file);

        const res = await fetch(`${API_URL_BASE}/uploads`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        return res.json();
    };


    // Retorna um array com as categorias selecionadas (ao invés de CSV)
    const getSelectedCategories = () =>
        qsa('input[name="categoria"]:checked').map(cb => cb.value);

    // Monta o payload conforme o model do backend (eventosModel.createEvento)
    const collectEventPayload = () => {
        return {
            nome_evento: qs('#nome-evento')?.value || '',
            foto_local: 'caminho/temporario/da/foto.jpg',
            descricao: qs('#descricao')?.value || '',
            categoria: getSelectedCategories(), // array de strings
            data_inicio: qs('#data-inicio')?.value || null, // YYYY-MM-DD
            hora_inicio: qs('#hora-inicio')?.value || null, // HH:MM
            data_fim: qs('#data-fim')?.value || null, // YYYY-MM-DD
            hora_fim: qs('#hora-fim')?.value || null, // HH:MM
            endereco: collectEnderecoPayload(),
            status: qs('input[name="visibilidade"]:checked')?.value || 'rascunho',
            id_usuario: getUserInfo()?.id_usuario
        };
    };

    const collectEnderecoPayload = () => {
        const endereco = {
            nome_local: qs('#nome-local')?.value || '',
            cep: qs('#cep')?.value || '',
            rua: qs('#rua')?.value || '',
            numero: qs('#numero')?.value || '',
            complemento: qs('#complemento')?.value || '',
            bairro: qs('#bairro')?.value || '',
            cidade: qs('#cidade')?.value || '',
            estado: qs('#estado')?.value || ''
        };
        return `${endereco.nome_local}, ${endereco.cep}, ${endereco.rua}, ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}`;
    }

    const requestCreateEvent = async (payload, token) => {
        const res = await fetch(`${API_URL_BASE}/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        return res;
    };

    // --- UI: Botão Voltar ---
    const attachBackButton = () => {
        const btn = qs('#btn-voltar');
        if (!btn) return;
        btn.addEventListener('click', () => window.history.back());
    };

    // Faça uma função para quando clicar em um botão, abra um input de imagem
    const attachImageUpload = () => {
        const dropzone = qs('.file-dropzone');
        const fileInput = qs('#imagem-evento-input');

        if (!dropzone || !fileInput) return;

        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        }
        );

        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                selectedImageFile = files[0];
                dropzone.querySelector('span').textContent = selectedImageFile.name;
            }
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                selectedImageFile = files[0];
                dropzone.querySelector('span').textContent = selectedImageFile.name;
            }
        });
    };

    // --- UI: Cidades Dropdown ---
    const attachCityDropdown = async () => {
        const citySelect = qs('#cidade');
        if (!citySelect) return;
        try {
            const res = await fetch(API_IBGE_CIDADES);
            if (!res.ok) throw new Error('Erro ao buscar cidades do IBGE');
            const cities = await res.json();
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.nome;
                option.textContent = city.nome;
                citySelect.appendChild(option);
            });
        } catch (err) {
            console.error('Erro ao carregar cidades:', err);
        }
    };

    // --- UI: Ingressos Inline ---
    const hasTicketsCheckbox = qs('#has-tickets');
    const ticketOptionsButtons = qs('#ticket-options-buttons');
    const ticketCreationArea = qs('#ticket-creation-area');
    const showPaidFormBtn = qs('#show-paid-form-btn');
    const showFreeFormBtn = qs('#show-free-form-btn');
    const cancelTicketBtns = qsa('.cancel-ticket-btn');
    const paidTicketForm = qs('#paid-ticket-form');
    const freeTicketForm = qs('#free-ticket-form');
    const ticketsListContainer = qs('#created-tickets-list');

    const showForm = (form) => {
        if (ticketOptionsButtons) ticketOptionsButtons.style.display = 'none';
        if (form) {
            form.style.display = 'block';
            form.setAttribute('aria-hidden', 'false');
            // enable inputs inside the pseudo-form
            form.querySelectorAll('input').forEach(i => i.disabled = false);
        }
    };

    const hideInlineForms = () => {
        // hide paid form and clear inputs
        if (paidTicketForm) {
            paidTicketForm.style.display = 'none';
            paidTicketForm.setAttribute('aria-hidden', 'true');
            paidTicketForm.querySelectorAll('input').forEach(i => { i.value = ''; i.disabled = true; });
        }
        // hide free form and clear inputs
        if (freeTicketForm) {
            freeTicketForm.style.display = 'none';
            freeTicketForm.setAttribute('aria-hidden', 'true');
            freeTicketForm.querySelectorAll('input').forEach(i => { i.value = ''; i.disabled = true; });
        }
        if (ticketOptionsButtons) ticketOptionsButtons.style.display = 'flex';
    };

    const addTicketToList = (name, quantity, priceString) => {
        if (!ticketsListContainer) return;
        const ticketId = `ticket-${Date.now()}`;
        const ticketItem = document.createElement('div');
        ticketItem.className = 'ticket-item';
        ticketItem.id = ticketId;
        ticketItem.innerHTML = `
            <div class="ticket-info">
                <strong>${name}</strong>
                <span>(${quantity} un.) - ${priceString}</span>
            </div>
            <button type="button" class="remove-ticket-btn" data-remove="${ticketId}">
                <i class="material-icons">delete_outline</i> Remover
            </button>
        `;
        ticketsListContainer.appendChild(ticketItem);
        ticketItem.querySelector('.remove-ticket-btn')?.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.remove;
            qs(`#${targetId}`)?.remove();
        });
    };

    const attachTicketListeners = () => {
        // Toggle visibility of the ticket creation area when the checkbox changes
        hasTicketsCheckbox?.addEventListener('change', (e) => {
            const checked = !!e.target.checked;
            if (ticketCreationArea) {
                ticketCreationArea.classList.toggle('hidden-section-css', !checked);
                ticketCreationArea.setAttribute('aria-hidden', String(!checked));
            }
            // when showing area, make sure options are visible
            if (checked) {
                if (ticketOptionsButtons) ticketOptionsButtons.style.display = 'flex';
            } else {
                // hide forms and reset if tickets disabled
                hideInlineForms();
            }
        });

        // Use event delegation for clicks on dynamic elements
        document.addEventListener('click', (e) => {
            const paidBtn = e.target.closest('#show-paid-form-btn');
            const freeBtn = e.target.closest('#show-free-form-btn');
            const cancelBtn = e.target.closest('.cancel-ticket-btn');
            const removeBtn = e.target.closest('.remove-ticket-btn');
            const saveBtn = e.target.closest('.save-ticket-btn');

            if (paidBtn) {
                e.preventDefault();
                showForm(paidTicketForm);
                return;
            }

            if (freeBtn) {
                e.preventDefault();
                showForm(freeTicketForm);
                return;
            }

            if (cancelBtn) {
                e.preventDefault();
                hideInlineForms();
                return;
            }

            if (removeBtn) {
                e.preventDefault();
                const targetId = removeBtn.dataset.remove;
                if (targetId) qs(`#${targetId}`)?.remove();
                return;
            }

            if (saveBtn) {
                e.preventDefault();
                // determine which form the save button belongs to
                const inPaid = !!saveBtn.closest('#paid-ticket-form');
                const inFree = !!saveBtn.closest('#free-ticket-form');
                if (inPaid) {
                    const name = qs('#paid-ticket-name')?.value || '';
                    const quantity = qs('#paid-ticket-quantity')?.value || '0';
                    const creatorValue = parseFloat(qs('#paid-ticket-value')?.value) || 0;
                    const priceString = creatorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + ' (+ taxa)';
                    addTicketToList(name, quantity, priceString);
                    hideInlineForms();
                } else if (inFree) {
                    const name = qs('#free-ticket-name')?.value || '';
                    const quantity = qs('#free-ticket-quantity')?.value || '0';
                    addTicketToList(name, quantity, 'Gratuito');
                    hideInlineForms();
                }
                return;
            }
        });

        // Initialize state: ensure inputs inside pseudo-forms are disabled until shown
        paidTicketForm?.querySelectorAll('input').forEach(i => i.disabled = true);
        freeTicketForm?.querySelectorAll('input').forEach(i => i.disabled = true);
    };

    // --- FORM: Envio de Evento ---
    const eventForm = qs('#event-form');

    const attachEventFormListener = () => {
        if (!eventForm) return;
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = getUserToken();
            if (!token) {
                alert('Erro de autenticação: Token não encontrado. Faça login novamente.');
                return;
            }

            let payload = collectEventPayload();

            // Upload da imagem (se tiver)
            if (selectedImageFile) {
                const uploadResult = await uploadImage(selectedImageFile, token);

                payload.foto_local = uploadResult.caminho;
            } else {
                payload.foto_local = null;
            }

            try {
                const res = await requestCreateEvent(payload, token);
                console.log("Resposta bruta:", res);

                if (!res.ok) {
                    const err = await res.text(); // <-- evita JSON.parse em erro HTML!
                    console.error("Resposta do servidor:", err);
                    alert("❌ Erro ao criar evento");
                    return;
                }

                const novoEvento = await res.json();
                alert(`🎉 Evento '${novoEvento.nome_evento}' criado com sucesso!`);
                window.location.href = '../perfil_usuario/eventos.html';

            } catch (err) {
                console.error("Erro ao enviar:", err);
                alert("Erro de rede ou CORS.");
            }
        });
    };

    // --- INIT ---
    const init = () => {
        attachBackButton();
        attachTicketListeners();
        attachEventFormListener();
        attachCityDropdown();
        attachImageUpload();
    };

    init();
});
