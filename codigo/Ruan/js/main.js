const form = document.getElementById('lembreteForm');
const list = document.getElementById('lembreteList');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value.trim();
    const data = document.getElementById('data').value.trim();

    if (!titulo || !categoria || !data) return;

    const li = document.createElement('li');
    li.classList.add('lembrete-item');

    const categoriaClass = `category-${categoria.toLowerCase()}`;

    li.innerHTML = `
        <div class="item-header">
            <strong>${titulo}</strong>
            <span class="${categoriaClass}">${categoria}</span>
            <small>${data}</small>
            <p>${descricao}</p>
        </div>
        <div class="actions">
            <button class="edit">✏️</button>
            <button class="done">✔️</button>
            <button class="delete">❌</button>
        </div>
    `;

    li.querySelector('.edit').addEventListener('click', () => {
        const novoTitulo = prompt('Novo título:', titulo);
        if (novoTitulo) {
            li.querySelector('strong').textContent = novoTitulo;
        }
    });

    li.querySelector('.delete').addEventListener('click', () => {
        li.remove();
    });

    list.appendChild(li);
    form.reset();
});
