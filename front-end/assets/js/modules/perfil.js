function aplicarTamanhoFonte(valor) {
  document.body.classList.remove('fonte-pequena', 'fonte-media', 'fonte-grande');
  if (valor === 'pequeno') document.body.classList.add('fonte-pequena');
  else if (valor === 'medio') document.body.classList.add('fonte-media');
  else if (valor === 'grande') document.body.classList.add('fonte-grande');
}

function aplicarTema(tema) {
  document.body.classList.remove('tema-claro', 'tema-escuro', 'tema-contraste');
  if (tema === 'claro') document.body.classList.add('tema-claro');
  else if (tema === 'escuro') document.body.classList.add('tema-escuro');
  else if (tema === 'contraste') document.body.classList.add('tema-contraste');
}

function aplicarReduzirAnimacoes(ativo) {
  if (ativo) document.body.classList.add('reduzir-animacoes');
  else document.body.classList.remove('reduzir-animacoes');
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
// ...código existente...

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