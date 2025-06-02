document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const nascimento = document.getElementById("nascimento").value.trim();
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value || "";
  const peso = document.getElementById("peso").value.trim();
  const altura = document.getElementById("altura").value.trim();
  const sangue = document.getElementById("sangue").value.trim();

  if (!nome || !nascimento || !sexo || !peso || !altura || !sangue) {
    alert("Por favor, preencha todos os campos antes de continuar.");
    return;
  }

  const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dataRegex.test(nascimento)) {
    alert("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
    return;
  }

  const [dia, mes, ano] = nascimento.split('/');
  const dataNascimentoUTC = new Date(Date.UTC(ano, mes - 1, dia));
  const hoje = new Date();
  const hojeUTC = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));

  if (dataNascimentoUTC > hojeUTC || isNaN(dataNascimentoUTC)) {
    alert("A data de nascimento não pode ser no futuro ou inválida.");
    return;
  }

  const novoCadastro = {
    nome,
    nascimento,
    sexo,
    peso,
    altura,
    sangue
  };

  fetch("http://localhost:5000/bebes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoCadastro)
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Bebê cadastrado com sucesso!");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Erro ao cadastrar bebê:", error);
      alert("Houve um erro ao cadastrar o bebê. Tente novamente.");
    });
});

document.getElementById("nascimento").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);

  e.target.value = value.slice(0, 10);
});

document.getElementById("peso").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
});

document.getElementById("altura").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
});

let formAlterado = false;

document.querySelectorAll("#form input, #form select").forEach(input => {
  input.addEventListener("input", () => {
    formAlterado = true;
  });
});


document.querySelectorAll("header a").forEach(link => {
  link.addEventListener("click", function (e) {
    if (formAlterado) {
      const confirmar = confirm("Você fez alterações no formulário. Tem certeza de que deseja sair sem salvar?");
      if (!confirmar) {
        e.preventDefault(); 
      }
    }
  });
});
