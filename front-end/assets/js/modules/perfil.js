document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const logoutBtns = document.querySelectorAll(".logout"); // todos botões sair

  if (!usuario) {
    alert("Você precisa estar logado!");
    window.location.href = "../login.html";
    return;
  }

  // Adiciona evento em todos os botões "Sair"
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      alert("Você saiu com sucesso!");
      window.location.href = "../login.html";
    });
  });
  
  // Preenche campos do perfil de forma segura (não quebra se o elemento não existir)
  const safeSetTextById = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value ?? '';
  };

  safeSetTextById('user-first-name', usuario?.primeiro_nome ?? '');
  safeSetTextById('user-full-name', `${usuario?.primeiro_nome ?? ''} ${usuario?.sobrenome ?? ''}`.trim());
  safeSetTextById('email', usuario?.email ?? '');
  safeSetTextById('username', usuario?.nome_usuario ?? '');
  safeSetTextById('organizer', usuario?.isorganizer ? 'Organizador' : 'Usuário');
  safeSetTextById('account-tier', usuario?.ispremium ? 'Premium' : 'Grátis');

  if (!usuario?.isorganizer) {
    const organizerElements = document.querySelectorAll('.organizer');
    organizerElements.forEach(el => el.style.display = 'none');
  }

});

function aplicarTamanhoFonte(valor) {
  document.body.classList.remove('fonte-pequena', 'fonte-media', 'fonte-grande');
  switch (valor) {
    case 'pequeno':
      document.body.classList.add('fonte-pequena');
      break;
    case 'medio':
      document.body.classList.add('fonte-media');
      break;
    case 'grande':
      document.body.classList.add('fonte-grande');
      break;
  }
}

function aplicarTema(tema) {
  document.body.classList.remove('tema-claro', 'tema-escuro', 'tema-contraste');
  switch (tema) {
    case 'claro':
      document.body.classList.add('tema-claro');
      break;
    case 'escuro':
      document.body.classList.add('tema-escuro');
      break;
    case 'contraste':
      document.body.classList.add('tema-contraste');
      break;
  }
}

function aplicarReduzirAnimacoes(ativo) {
  ativo ? document.body.classList.add('reduzir-animacoes') : document.body.classList.remove('reduzir-animacoes');
}

function salvarPreferencias({ tema, fonte, animacoes }) {
  if (tema !== undefined) localStorage.setItem('acess-tema', tema);
  if (fonte !== undefined) localStorage.setItem('acess-fonte', fonte);
  if (animacoes !== undefined) localStorage.setItem('acess-animacoes', animacoes);
}

function carregarPreferencias() {
  const tema = localStorage.getItem('acess-tema') || 'claro';
  const fonte = localStorage.getItem('acess-fonte') || 'medio';
  const animacoes = localStorage.getItem('acess-animacoes') === 'true';

  aplicarTema(tema);
  aplicarTamanhoFonte(fonte);
  aplicarReduzirAnimacoes(animacoes);

  // Ativa visualmente o card selecionado
  document.querySelectorAll('[data-theme]').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-theme') === tema);
  });
  document.querySelectorAll('[data-font]').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-font') === fonte);
  });
  document.querySelectorAll('[data-extra="animacoes"]').forEach(card => {
    card.classList.toggle('active', animacoes);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  carregarPreferencias();

  // Tema
  document.querySelectorAll('[data-theme]').forEach(card => {
    card.addEventListener('click', function () {
      const tema = this.getAttribute('data-theme');
      aplicarTema(tema);
      salvarPreferencias({ tema });
      carregarPreferencias();
    });
  });

  // Fonte
  document.querySelectorAll('[data-font]').forEach(card => {
    card.addEventListener('click', function () {
      const fonte = this.getAttribute('data-font');
      aplicarTamanhoFonte(fonte);
      salvarPreferencias({ fonte });
      carregarPreferencias();
    });
  });

  // Reduzir animações
  document.querySelectorAll('[data-extra="animacoes"]').forEach(card => {
    card.addEventListener('click', function () {
      const atual = localStorage.getItem('acess-animacoes') === 'true';
      aplicarReduzirAnimacoes(!atual);
      salvarPreferencias({ animacoes: !atual });
      carregarPreferencias();
    });
  });


});

// Menu Hambúrguer
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuHamburguer');
  const menuMobile = document.getElementById('menuMobile');
  if (menuBtn && menuMobile) {
    menuBtn.addEventListener('click', function() {
      menuMobile.style.display = menuMobile.style.display === 'block' ? 'none' : 'block';
    });
    // Fecha o menu ao clicar em um link
    menuMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuMobile.style.display = 'none';
      });
    });
  }
});