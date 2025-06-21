document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.querySelector(".forms-login");
  const formCadastro = document.querySelector(".forms-Cadastro");

  const toggleForms = (mostrarLogin) => {
    formLogin.style.display = mostrarLogin ? "block" : "none";
    formCadastro.style.display = mostrarLogin ? "none" : "block";
  };

  document.getElementById("btnLogin")?.addEventListener("click", () => toggleForms(true));
  document.getElementById("btnCadastro")?.addEventListener("click", () => toggleForms(false));
  document.getElementById("linkParaLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(true);
  });
  document.getElementById("linkParaCadastro")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(false);
  });
});

