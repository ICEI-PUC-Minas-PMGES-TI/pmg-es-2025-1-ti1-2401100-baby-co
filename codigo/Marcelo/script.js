document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const dados = {
        mae: document.getElementById("mae").value.trim(),
        nascimento_mae: document.getElementById("nascimento_mae").value.trim(),
        pai: document.getElementById("pai").value.trim(),
        nascimento_pai: document.getElementById("nascimento_pai").value.trim(),
    };

    if (!dados.mae || !dados.nascimento_mae || !dados.pai || !dados.nascimento_pai) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch("/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao salvar.");
        return response.text();
    })
    .then(mensagem => {
        alert(mensagem);
        document.querySelector("form").reset();
    })
    .catch(error => {
        alert("Erro ao salvar os dados.");
        console.error(error);
    });
});
