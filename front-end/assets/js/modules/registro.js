document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  // Simulação de registro (salvar em localStorage, apenas exemplo)
  localStorage.setItem("registeredUser", JSON.stringify({ name, email, username, password }));

  alert("Cadastro realizado com sucesso! Agora faça login.");
  window.location.href = "login.html";
});
