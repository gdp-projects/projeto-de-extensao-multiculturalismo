const API_URL_BASE = 'http://localhost:8080/';

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

  // Atualiza foto de perfil
  const fotoPerfil = document.getElementById('foto-perfil');
  console.log('Usuario foto_perfil:', usuario);
  if (fotoPerfil && usuario?.foto) {
    const fotoUrl = `${API_URL_BASE}${usuario.foto}`;
    fotoPerfil.src = fotoUrl;
  }

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

// Se tornar organizador
document.addEventListener('DOMContentLoaded', function() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && !usuario.isorganizer) {
    const container = document.querySelector('.become-organizer');
    if (container) {
      const btn = document.createElement('button');
      const h3 = document.createElement('h3');
      h3.textContent = 'Quer organizar eventos?';
      container.appendChild(h3);
      const p = document.createElement('p');
      p.textContent = 'Torne-se um organizador e comece a criar seus próprios eventos!';
      container.appendChild(p);
      btn.id = 'btn-become-organizer';
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Tornar-se Organizador';
      container.appendChild(btn);
    }
    const btn_become_organizer = document.getElementById('btn-become-organizer');
    btn_become_organizer.addEventListener('click', () => {
      tornarOrganizador(usuario.id_usuario).then(() => {
        alert('Parabéns! Agora você é um organizador.');
        usuario.isorganizer = true;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.reload();
      }
      ).catch(err => {
        console.error(err);
        alert('Erro ao tornar-se organizador. Tente novamente mais tarde.');
      });
    });
  } else {
    const container = document.querySelector('.become-organizer');
    if (container) {
      container.style.display = 'none';
    }
  }
});

// Requisição API para se tornar organizador
async function tornarOrganizador(id_usuario) {
  try {
    const response = await fetch(`${API_URL_BASE}usuarios/promover-organizador/${id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_usuario })
    });
    if (!response.ok) {
      throw new Error('Erro ao tornar-se organizador');
    }
  } catch (error) {
    console.error(error);
  }
}

// Atualizar contagem de eventos criados
const atualizarContagemEventosCriados = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  if (!usuario) return;
  const response = await fetch(`${API_URL_BASE}eventos/usuario/${usuario.id_usuario}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  });
  if (response.ok) {
    const eventos = await response.json();
    const contagemElement = document.getElementById('eventos-criados-count');
    if (contagemElement) {
      contagemElement.textContent = eventos.length;
    }
  }
};

// Função para clicar na foto de perfil e abrir seletor de arquivo
const fotoPerfil = document.getElementById('foto-perfil');
if (fotoPerfil) {
  fotoPerfil.addEventListener('click', () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      alert('Você precisa estar logado para alterar a foto de perfil.');
      window.location.href = "../login.html";
      return;
    }

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';
    inputFile.click();
    inputFile.addEventListener('change', async () => {
      const file = inputFile.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('foto', file);
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`${API_URL_BASE}uploads`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          if (response.ok) {
            const data = await response.json();
            await atualizarFotoPerfil(usuario.id_usuario, data.caminho);
            const fotoUrl = `${API_URL_BASE}${data.caminho}`;
            fotoPerfil.src = fotoUrl;
            localStorage.setItem('usuario', JSON.stringify({ ...usuario, foto: data.caminho }));
            alert('Foto de perfil atualizada com sucesso!');
          } else {
            console.error('Upload falhou:', response.statusText);
            alert('Erro ao enviar a foto. Tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao enviar a foto:', error);
          alert('Erro ao atualizar a foto de perfil. Tente novamente.');
        }
      }
    }, { once: true });
  });
}

// Atualizar o caminho da foto de perfil do usuário no banco de dados
const atualizarFotoPerfil = async (id_usuario, caminho_foto) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "../login.html";
    return;
  }
  try {
          const response = await fetch(`${API_URL_BASE}usuarios/foto/${id_usuario}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ foto_perfil: caminho_foto })
          });
          if (!response.ok) {
            throw new Error('Erro ao atualizar foto de perfil');
          }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log(localStorage.getItem('usuario'));
  atualizarContagemEventosCriados();
  atualizarFotoPerfilLocalStorage()
});