// menu toggle para mobile
document.addEventListener('DOMContentLoaded', () => {
  const menuBtns = document.querySelectorAll('.menu-btn');
  const sidebar = document.querySelector('.sidebar');

  // Botão do menu lateral (hambúrguer)
  menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!sidebar) return;
      sidebar.classList.toggle('open');
    });
  });

  // fechamento automático do sidebar ao clicar fora (mobile)
  document.addEventListener('click', (e) => {
    if (!sidebar) return;
    const target = e.target;
    if (sidebar.classList.contains('open') && !sidebar.contains(target) && !target.closest('.menu-btn')) {
      sidebar.classList.remove('open');
    }
  });

  // pequenos handlers de interação (ex.: botões "Editar" e "Métricas" dos eventos podem mostrar uma mensagem)
  document.querySelectorAll('.btn-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#' || btn.tagName === 'BUTTON') {
        e.preventDefault();
        const txt = btn.textContent.trim();
        alert(`${txt} — funcionalidade demo (implemente sua rota aqui).`);
      }
    });
  });

  // floating create event demo
  const floatBtn = document.querySelector('.floating-btn');
  if (floatBtn) {
    floatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Abrir criação de evento — implemente a página de criação.');
    });
  }

  // ===== Novo: menu sanduíche do usuário (dropdown) =====
  const userMenuBtn = document.querySelector('.user-menu');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-dropdown') && !e.target.closest('.user-menu')) {
        userDropdown.classList.remove('open');
      }
    });
  }
});
// ===== Acessibilidade =====
document.addEventListener('DOMContentLoaded', () => {
  const verifyForm = document.getElementById('verifyForm');
  const phoneInput = document.getElementById('phone');
  const verifyMessage = document.getElementById('verifyMessage');

  const codeForm = document.getElementById('codeForm');
  const codeInput = document.getElementById('code');
  const codeMessage = document.getElementById('codeMessage');

  let generatedCode = null;

  if (verifyForm) {
    verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = phoneInput.value.trim();

      // Validação simples de telefone
      const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
      if (phoneRegex.test(phone)) {
        // Gera código aleatório de 6 dígitos
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

        verifyMessage.textContent = `📲 Código enviado para ${phone}. (Simulação: ${generatedCode})`;
        verifyMessage.style.color = "green";

        codeForm.style.display = "block";
      } else {
        verifyMessage.textContent = "❌ Número de telefone inválido.";
        verifyMessage.style.color = "red";
      }
    });
  }

  if (codeForm) {
    codeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredCode = codeInput.value.trim();

      if (enteredCode === generatedCode) {
        codeMessage.textContent = "✅ Usuário verificado com sucesso!";
        codeMessage.style.color = "green";
      } else {
        codeMessage.textContent = "❌ Código incorreto.";
        codeMessage.style.color = "red";
      }
    });
  }
});
  // aplica configs salvas
  const temaSalvo = localStorage.getItem('tema');
  const fonteSalva = localStorage.getItem('fonte');
  const extrasSalvos = JSON.parse(localStorage.getItem('extras') || "[]");

  if (temaSalvo) document.body.classList.add(`tema-${temaSalvo}`);
  if (fonteSalva) document.body.classList.add(`fonte-${fonteSalva}`);
  extrasSalvos.forEach(extra => document.body.classList.add(extra));

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.theme;
      const font = card.dataset.font;
      const extra = card.dataset.extra;

      // tema
      if (theme) {
        document.body.classList.remove('tema-claro', 'tema-escuro', 'tema-contraste');
        document.body.classList.add(`tema-${theme}`);
        localStorage.setItem('tema', theme);
      }

      // fonte
      if (font) {
        document.body.classList.remove('fonte-pequeno', 'fonte-medio', 'fonte-grande');
        document.body.classList.add(`fonte-${font}`);
        localStorage.setItem('fonte', font);
      }

      // extras (toggle)
      if (extra) {
        document.body.classList.toggle(extra);
        const ativos = [...document.body.classList].filter(c => ['leitor','reduzir-animacoes','destacar-links'].includes(c));
        localStorage.setItem('extras', JSON.stringify(ativos));
        if (extra === 'leitor') {
          alert("Leitor de tela " + (document.body.classList.contains('leitor') ? "ativado" : "desativado"));
        }
        
      }
    });
  });
