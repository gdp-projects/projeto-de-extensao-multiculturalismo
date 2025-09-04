document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "usuario1" && pass === "senha1") {
    window.location.href = "perfil.html"; // Redireciona para a página de perfil
  } else {
    alert("Usuário ou senha incorretos!");
  }
});
