const form = document.getElementById('lembreteForm');
const list = document.getElementById('lembreteList');
const URL_BASE = "http://localhost:3000/";

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value.trim();
    const data = document.getElementById('data').value.trim();

    if (!titulo || !categoria || !data) return;

    const lembrete = { titulo, categoria, descricao, data, status: "ativo" };

    try {
        const res = await fetch(`${URL_BASE}lembretes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lembrete)
        });

        if (!res.ok) throw new Error("Erro ao salvar lembrete");

        alert("Lembrete salvo com sucesso!");
        form.reset();
        await carregarLembretes(); 
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar o lembrete. Verifique o console.");
    }
});


function criarElementoLembrete(lembrete) {
    const li = document.createElement('li');
    li.classList.add('lembrete-item');

    const categoriaClass = `category-${lembrete.categoria.toLowerCase()}`;
    li.setAttribute('data-id', lembrete.id);

    li.innerHTML = `
        <div class="item-header">
            <strong>${lembrete.titulo}</strong>
            <span class="${categoriaClass}">${lembrete.categoria}</span>
            <small>${lembrete.data}</small>
            <p>${lembrete.descricao}</p>
        </div>
        <div class="actions">
            <button class="edit">✏️</button>
            <button class="done">✔️</button>
            <button class="delete">❌</button>
        </div>
    `;


    li.querySelector('.edit').addEventListener('click', async () => {
        const novoTitulo = prompt('Novo título:', lembrete.titulo);
        if (!novoTitulo) return;

        try {
            const res = await fetch(`${URL_BASE}lembretes/${lembrete.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: novoTitulo })
            });

            if (!res.ok) throw new Error("Erro ao editar lembrete");
            await carregarLembretes();
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar lembrete.");
        }
    });


    li.querySelector('.done').addEventListener('click', async () => {
    const confirmar = confirm('Marcar como finalizado?');
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_BASE}lembretes/${lembrete.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "finalizado" })
        });

        if (!res.ok) throw new Error("Erro ao finalizar lembrete");
        await carregarLembretes();
    } catch (err) {
        console.error(err);
        alert("Erro ao finalizar lembrete.");
    }
});



    li.querySelector('.delete').addEventListener('click', async () => {
        const confirmar = confirm('Tem certeza que deseja excluir este lembrete?');
        if (!confirmar) return;

        try {
            const res = await fetch(`${URL_BASE}lembretes/${lembrete.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Erro ao excluir lembrete");
            await carregarLembretes();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir lembrete.");
        }
    });

    list.appendChild(li);
}




async function carregarLembretes() {
    try {
        const res = await fetch(`${URL_BASE}lembretes`);
        if (!res.ok) throw new Error("Erro ao carregar lembretes");
        const lembretes = await res.json();
        aplicarFiltros(lembretes);
    } catch (err) {
        console.error("Erro ao carregar lembretes:", err);
    }
}

function aplicarFiltros(lembretes) {
    const categoriasMarcadas = Array.from(
        document.querySelectorAll('.filters h2:nth-of-type(1) + .checkbox-group input[type="checkbox"]:checked')
    ).map(cb => cb.parentElement.textContent.trim());

    const statusMarcados = Array.from(
        document.querySelectorAll('.filters h2:nth-of-type(2) + .checkbox-group input[type="checkbox"]:checked')
    ).map(cb => {
        const texto = cb.parentElement.textContent.trim().toLowerCase();
        if (texto === "ativos") return "ativo";
        if (texto === "completados") return "finalizado";
        return texto;
    });

    list.innerHTML = "";

    const filtrados = lembretes.filter(lembrete => {
        const categoriaOk = categoriasMarcadas.length === 0 || categoriasMarcadas.includes(lembrete.categoria);
        const statusOk = statusMarcados.length === 0 || statusMarcados.includes(lembrete.status);
        return categoriaOk && statusOk;
    });

    filtrados.forEach(criarElementoLembrete);
}




document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', carregarLembretes);
});




window.addEventListener('DOMContentLoaded', carregarLembretes);


const toggle = document.getElementById('darkModeToggle');


  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
  });  
