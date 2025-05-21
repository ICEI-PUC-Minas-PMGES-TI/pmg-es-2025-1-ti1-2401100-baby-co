const botaoAdicionar = document.getElementById("botaoAdicionar");
const formContainer = document.getElementById("formContainer");
const botaoCancelar = document.getElementById("botaoCancelar");
const botaoSalvar = document.getElementById("botaoSalvar");
const listaItens = document.getElementById("listaItens");
const tagBotoes = document.querySelectorAll(".tag-btn");
const inputItem = document.getElementById("inputItem");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

let tagSelecionada = "";
let itens = JSON.parse(localStorage.getItem("itensChecklist")) || [];
let editandoIndex = null;

function renderizarItens(filtro = "") {
    listaItens.innerHTML = "";

    itens
        .filter(item => !filtro || item.tag === filtro)
        .forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "item";

            const span = document.createElement("span");
            span.textContent = `${item.nome} (${item.tag})`;

            const editarBtn = document.createElement("button");
            editarBtn.textContent = "Editar";
            editarBtn.onclick = () => editarItem(index);

            const excluirBtn = document.createElement("button");
            excluirBtn.textContent = "Excluir";
            excluirBtn.onclick = () => excluirItem(index);

            div.appendChild(span);
            div.appendChild(editarBtn);
            div.appendChild(excluirBtn);

            listaItens.appendChild(div);
        });
}

function salvarItens() {
    localStorage.setItem("itensChecklist", JSON.stringify(itens));
}

function limparFormulario() {
    inputItem.value = "";
    tagSelecionada = "";
    tagBotoes.forEach(btn => btn.classList.remove("selecionado"));
    editandoIndex = null;
}

tagBotoes.forEach(btn => {
    btn.addEventListener("click", () => {
        tagSelecionada = btn.dataset.tag;
        tagBotoes.forEach(b => b.classList.remove("selecionado"));
        btn.classList.add("selecionado");
    });
});

botaoAdicionar.addEventListener("click", () => {
    formContainer.style.display = "block";
});

botaoCancelar.addEventListener("click", () => {
    formContainer.style.display = "none";
    limparFormulario();
});

botaoSalvar.addEventListener("click", () => {
    const nome = inputItem.value.trim();
    if (!nome || !tagSelecionada) {
        alert("Preencha o item e selecione uma tag.");
        return;
    }

    const novoItem = { nome, tag: tagSelecionada };

    if (editandoIndex !== null) {
        itens[editandoIndex] = novoItem;
    } else {
        itens.push(novoItem);
    }

    salvarItens();
    renderizarItens();
    formContainer.style.display = "none";
    limparFormulario();
});

function editarItem(index) {
    const item = itens[index];
    inputItem.value = item.nome;
    tagSelecionada = item.tag;
    tagBotoes.forEach(btn => {
        btn.classList.toggle("selecionado", btn.dataset.tag === tagSelecionada);
    });
    formContainer.style.display = "block";
    editandoIndex = index;
}

function excluirItem(index) {
    if (confirm("Deseja realmente excluir este item?")) {
        itens.splice(index, 1);
        salvarItens();
        renderizarItens();
    }
}

// Modo escuro
darkModeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
});

function carregarModoEscuro() {
    const dark = localStorage.getItem("darkMode") === "true";
    if (dark) body.classList.add("dark-mode");
    darkModeToggle.checked = dark;
}

// Filtro por tag
function criarFiltroTags() {
    const container = document.createElement("div");
    container.className = "filtros";

    const todas = document.createElement("button");
    todas.textContent = "Todas";
    todas.onclick = () => renderizarItens("");
    container.appendChild(todas);

    ["medico", "alimentacao", "acessorios", "outros"].forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        btn.onclick = () => renderizarItens(tag);
        container.appendChild(btn);
    });

    document.querySelector(".container-checklist").prepend(container);
}

window.onload = () => {
    carregarModoEscuro();
    renderizarItens();
    criarFiltroTags();
};
