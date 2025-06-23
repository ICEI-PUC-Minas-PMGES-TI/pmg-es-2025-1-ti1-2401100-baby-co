const API_URL = "http://localhost:3000/checklist";

const lista = document.getElementById("lista");
const inputItem = document.getElementById("inputItem");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const filtroTags = document.querySelectorAll("#filtros .tag-btn");
const inputTags = document.querySelectorAll(".tag-selector .tag-btn");
const toggleDarkMode = document.getElementById("darkModeToggle");

let tarefas = [];
let tagSelecionada = "todos";
let tagInputSelecionada = null;
let editandoId = null;

// Dark Mode
toggleDarkMode.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggleDarkMode.checked);
  localStorage.setItem("modoEscuro", toggleDarkMode.checked);
});
if (localStorage.getItem("modoEscuro") === "true") {
  toggleDarkMode.checked = true;
  document.body.classList.add("dark");
}

// Filtro de Tags
filtroTags.forEach(tag => {
  tag.addEventListener("click", () => {
    filtroTags.forEach(t => t.classList.remove("ativo"));
    tag.classList.add("ativo");
    tagSelecionada = tag.dataset.tag;
    renderizar();
  });
});

// Tags do formulário
inputTags.forEach(tag => {
  tag.addEventListener("click", () => {
    inputTags.forEach(t => t.classList.remove("ativo"));
    tag.classList.add("ativo");
    tagInputSelecionada = tag.dataset.tag;
  });
});

// Salvar/Atualizar Tarefa
btnSalvar.addEventListener("click", async () => {
  const texto = inputItem.value.trim();
  if (texto === "" || !tagInputSelecionada) {
    alert("Digite um item e selecione uma tag.");
    return;
  }

  const tarefa = { texto, tag: tagInputSelecionada, concluido: false };

  if (editandoId) {
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
    editandoId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
  }

  resetarFormulario();
  carregarTarefas();
});

// Cancelar
btnCancelar.addEventListener("click", resetarFormulario);

// Funções
function resetarFormulario() {
  inputItem.value = "";
  tagInputSelecionada = null;
  inputTags.forEach(t => t.classList.remove("ativo"));
  editandoId = null;
  btnSalvar.textContent = "Salvar";
}

function renderizar() {
  lista.innerHTML = "";

  const filtradas = tarefas.filter(tarefa =>
    tagSelecionada === "todos" || tarefa.tag === tagSelecionada
  );

  filtradas.forEach(tarefa => {
    const li = document.createElement("li");
    li.classList.add("item-tarefa");

    const esquerda = document.createElement("div");
    esquerda.style.display = "flex";
    esquerda.style.alignItems = "center";
    esquerda.style.gap = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluido;
    checkbox.addEventListener("change", () => toggleConcluido(tarefa.id));

    const textoSpan = document.createElement("span");
    textoSpan.textContent = tarefa.texto;
    if (tarefa.concluido) {
      textoSpan.style.textDecoration = "line-through";
      textoSpan.style.opacity = "0.6";
    }

    esquerda.appendChild(checkbox);
    esquerda.appendChild(textoSpan);

    const tagSpan = document.createElement("span");
    tagSpan.classList.add("tag");
    tagSpan.dataset.tag = tarefa.tag;
    tagSpan.textContent = tarefa.tag;

    const botoes = document.createElement("div");
    botoes.style.display = "flex";
    botoes.style.gap = "5px";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️";
    btnEditar.title = "Editar";
    btnEditar.onclick = () => editarItem(tarefa);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.title = "Excluir";
    btnExcluir.onclick = () => excluirItem(tarefa.id);

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    li.appendChild(esquerda);
    li.appendChild(tagSpan);
    li.appendChild(botoes);

    lista.appendChild(li);
  });
}

async function carregarTarefas() {
  const res = await fetch(API_URL);
  tarefas = await res.json();
  renderizar();
}

function editarItem(tarefa) {
  inputItem.value = tarefa.texto;
  tagInputSelecionada = tarefa.tag;
  inputTags.forEach(t => {
    t.classList.toggle("ativo", t.dataset.tag === tarefa.tag);
  });
  editandoId = tarefa.id;
  btnSalvar.textContent = "Atualizar";
}

async function excluirItem(id) {
  if (confirm("Deseja excluir este item?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarTarefas();
  }
}

async function toggleConcluido(id) {
  const tarefa = tarefas.find(t => t.id === id);
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluido: !tarefa.concluido })
  });
  carregarTarefas();
}

// Inicializar
carregarTarefas();
