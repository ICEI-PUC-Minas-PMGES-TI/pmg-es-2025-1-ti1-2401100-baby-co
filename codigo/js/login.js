document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const formCadastro = document.getElementById("formCadastro");
  const erroSenha = document.getElementById("erroSenha");
  const confirmarSenha = document.getElementById("confirmarSenha");

  const formLoginWrapper = document.querySelector(".forms-login");
  const formCadastroWrapper = document.querySelector(".forms-Cadastro");

  const toggleForms = (mostrarLogin) => {
    formLoginWrapper.style.display = mostrarLogin ? "block" : "none";
    formCadastroWrapper.style.display = mostrarLogin ? "none" : "block";
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

  formCadastro?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const confirmarSenhaValor = confirmarSenha.value;

    erroSenha.style.display = "none";
    confirmarSenha.classList.remove("input-erro");

    if (senha !== confirmarSenhaValor) {
      erroSenha.style.display = "block";
      confirmarSenha.classList.add("input-erro");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}`);
      const usuarios = await res.json();

      if (usuarios.length > 0) {
        alert("Este e-mail já está cadastrado.");
        return;
      }

      const novoUsuario = { nome, email, senha };

      const resp = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
      });

      if (resp.ok) {
        alert("Usuário cadastrado com sucesso!");
        formCadastro.reset();
        toggleForms(true);
      } else {
        alert("Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  });

  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const senha = document.getElementById("loginSenha").value;

    try {
      const res = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
      const usuarios = await res.json();

      if (usuarios.length === 1) {
        const usuario = usuarios[0];
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        alert(`Bem-vindo, ${usuario.nome}`);
   
        window.location.href = "home.html";
      } else {
        alert("E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  });
});
