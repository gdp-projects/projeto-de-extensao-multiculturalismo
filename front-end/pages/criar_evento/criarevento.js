document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Botão Voltar ---
    const backButton = document.getElementById('btn-voltar');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // --- 2. Simulação de Envio do Formulário ---
    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        alert('Evento Publicado com o novo estilo! (Simulação)');
    });

    // --- 3. LÓGICA DE FORMULÁRIO INLINE (MÍNIMO JS ESSENCIAL) ---
    
    // Botões
    const ticketOptionsButtons = document.getElementById('ticket-options-buttons');
    const showPaidFormBtn = document.getElementById('show-paid-form-btn');
    const showFreeFormBtn = document.getElementById('show-free-form-btn');
    const cancelTicketBtns = document.querySelectorAll('.cancel-ticket-btn');

    // Formulários
    const paidTicketForm = document.getElementById('paid-ticket-form');
    const freeTicketForm = document.getElementById('free-ticket-form');
    
    // Mostrar formulário de ingresso pago
    showPaidFormBtn.addEventListener('click', () => {
        ticketOptionsButtons.style.display = 'none';
        paidTicketForm.style.display = 'block';
    });
    
    // Mostrar formulário de ingresso gratuito
    showFreeFormBtn.addEventListener('click', () => {
        ticketOptionsButtons.style.display = 'none';
        freeTicketForm.style.display = 'block';
    });

    // Função para esconder formulários e mostrar botões
    function hideInlineForms() {
        paidTicketForm.style.display = 'none';
        freeTicketForm.style.display = 'none';
        ticketOptionsButtons.style.display = 'flex';
        
        // Limpa os formulários
        paidTicketForm.reset();
        freeTicketForm.reset();
    }

    // Evento para todos os botões "Cancelar"
    cancelTicketBtns.forEach(btn => {
        btn.addEventListener('click', hideInlineForms);
    });

    // --- 4. Adicionar Ingresso na Lista (MÍNIMO JS ESSENCIAL) ---
    const ticketsListContainer = document.getElementById('created-tickets-list');

    paidTicketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('paid-ticket-name').value;
        const quantity = document.getElementById('paid-ticket-quantity').value;
        const creatorValue = parseFloat(document.getElementById('paid-ticket-value').value) || 0;
        
        const priceString = creatorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " (+ taxa)";
        
        addTicketToList(name, quantity, priceString);
        hideInlineForms(); // Esconde o form e mostra os botões
    });

    freeTicketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('free-ticket-name').value;
        const quantity = document.getElementById('free-ticket-quantity').value;
        
        addTicketToList(name, quantity, 'Gratuito');
        hideInlineForms(); // Esconde o form e mostra os botões
    });

    function addTicketToList(name, quantity, priceString) {
        const ticketId = `ticket-${Date.now()}`; // ID único para remoção
        
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('ticket-item');
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

        // Adiciona evento ao botão de remover
        ticketItem.querySelector('.remove-ticket-btn').addEventListener('click', function() {
            document.getElementById(this.dataset.remove).remove();
        });
    }
});