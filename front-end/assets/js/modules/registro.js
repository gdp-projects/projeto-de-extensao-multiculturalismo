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
      document.getElementById("popupCadastro").classList.add("active");
      setTimeout(() => {
        window.location.href = "../pages/login.html";
      }, 2000);
    })
    .catch(erro => {
    });
});

async function registrarUsuario(dados) {
  const resposta = await fetch(`${API_URL_BASE}usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(erro || 'Erro ao registrar usuário');
  }
  return await resposta.json();
}
