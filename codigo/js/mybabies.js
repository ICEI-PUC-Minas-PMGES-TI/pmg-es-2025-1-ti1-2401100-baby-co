  const container = document.getElementById('bebes-container');
  const apiUrl = 'http://localhost:3000/bebes';

  function carregarBebes() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        container.innerHTML = '';

        data.forEach(bebe => {
          const card = document.createElement('div');
          card.className = 'bebe-card';

          card.innerHTML = `
            <h3>${bebe.nome}</h3>
            <p>${bebe.nascimento}</p>
            <p>Peso: ${bebe.peso} Kg</p>
            <p>Altura: ${bebe.altura} cm</p>
            <div class="delete-btn" data-id="${bebe.id}">🗑️</div>
          `;

          container.appendChild(card);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            deletarBebe(id);
          });
        });
      });
  }

function deletarBebe(id) {
  const confirmar = confirm("Tem certeza que deseja apagar este bebê?");
  if (!confirmar) return;

  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  }).then(res => {
    if (res.ok) {
      carregarBebes();
    } else {
      alert("Erro ao apagar bebê.");
    }
  });
}

  carregarBebes();



  