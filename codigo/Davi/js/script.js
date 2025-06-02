document.addEventListener("DOMContentLoaded", () => {
  fetch("../../db/db.json")
    .then(response => response.json())
    .then(dados => {
      const listaBebes = document.getElementById("lista-bebes");

      dados.bebes.forEach(bebe => {
        const card = document.createElement("section");
        card.className = "cards-bebes";
        card.dataset.nome = bebe.nome;

        card.innerHTML = `
          <img src="https://via.placeholder.com/100" alt="Foto de ${bebe.nome}">
          <div>
            <h3>${bebe.nome}</h3>
            <p>${bebe.nascimento}</p>
            <p>${bebe.sexo}</p>
          </div>
          <div class="actions">
            <button class="edit">✏️</button>
            <button class="delete">❌</button>
          </div>
        `;

        listaBebes.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar db.json:", error);
    });
});