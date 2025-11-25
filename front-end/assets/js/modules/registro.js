const API_URL_BASE = 'http://localhost:8080/';

if (localStorage.getItem("token")) {
    alert("Você já está logado!");
    window.location.href = "../pages/perfil_usuario/inicio.html";
}

document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const sobrenome = document.getElementById("sobrenome").value;
  const email = document.getElementById("email").value;
  const nome_usuario = document.getElementById("nome-usuario").value;
  const telefone = document.getElementById("telefone").value;
  const data_nascimento = document.getElementById("data-nascimento").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/.test(senha);
  if (!senhaForte) {
    alert("A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais[@$!%*?&_-].");
    return;
  }

  // Envio para a API
  const dados = { nome, sobrenome, email, nome_usuario, telefone, data_nascimento, senha };
  registrarUsuario(dados)
    .then(() => {
      alert("Registro bem-sucedido! Redirecionando para a página de login...");
      const popup = document.getElementById("popupCadastro");
      if (popup) {
        try {
          popup.classList.add("active");
        } catch (err) {
          console.warn('Não foi possível ativar popupCadastro:', err);
        }
      } else {
        console.warn('Elemento #popupCadastro não encontrado no DOM.');
      }

      // Sempre agende o redirecionamento, mesmo que o DOM esteja incompleto
      setTimeout(() => {
        try {
          window.location.href = "../pages/login.html";
        } catch (err) {
          console.error('Erro ao redirecionar:', err);
        }
      }, 2000);
    })
    .catch(erro => {
      console.error('Erro no registro:', erro);
      alert("Erro ao registrar usuário: " + (erro.message || erro));
    });
});

async function registrarUsuario(dados) {
  console.log('registrarUsuario: enviando dados', dados);
  let resposta;
  try {
    resposta = await fetch(`${API_URL_BASE}usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
  } catch (err) {
    console.error('registrarUsuario: falha de rede ao chamar API', err);
    throw new Error('Falha de rede: ' + (err.message || err));
  }

  console.log('registrarUsuario: status', resposta.status, resposta.statusText);
  if (!resposta.ok) {
    const erroTexto = await resposta.text();
    console.error('registrarUsuario: resposta de erro', erroTexto);
    throw new Error(erroTexto || `Erro ao registrar usuário (${resposta.status})`);
  }

  // Se o backend retornar 204 No Content ou não retornar JSON, retorne objeto vazio
  const contentType = resposta.headers.get('content-type') || '';
  if (resposta.status === 204 || contentType.indexOf('application/json') === -1) {
    console.log('registrarUsuario: sem corpo JSON, retornando {}');
    return {};
  }

  try {
    const json = await resposta.json();
    console.log('registrarUsuario: resposta JSON', json);
    return json;
  } catch (err) {
    console.warn('registrarUsuario: falha ao parsear JSON, retornando texto', err);
    const text = await resposta.text();
    return { message: text };
  }
}
