document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  try {
    const dados = await verificarUsuario({ nome_usuario: user, senha: pass });

    // salva no localStorage
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
    localStorage.setItem("token", dados.token);

    window.location.href = "../pages/perfil_usuario/inicio.html";
  } catch (error) {
    alert("Usuário ou senha incorretos!");
    console.error(error);
  }
});

async function verificarUsuario(dados) {
  const resposta = await fetch('http://localhost:8080/usuarios/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });

  console.log("Status:", resposta.status);
  console.log("Response:", await resposta.clone().text());

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.error || 'Erro ao verificar usuário');
  }
  
  return await resposta.json();
}