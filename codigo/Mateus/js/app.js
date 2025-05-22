const lista = document.getElementById("lista");
const inputItem = document.getElementById("inputItem");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const filtroTags = document.querySelectorAll("#filtros .tag-btn");
const inputTags = document.querySelectorAll(".tag-selector .tag-btn");
const toggleDarkMode = document.getElementById("darkModeToggle");

let tarefas = carregarTarefas();
let tagSelecionada = "todos";
let tagInputSelecionada = null;
let editandoIndex = null;

toggleDarkMode.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggleDarkMode.checked);
  localStorage.setItem("modoEscuro", toggleDarkMode.checked);
});


if (localStorage.getItem("modoEscuro") === "true") {
  toggleDarkMode.checked = true;
  document.body.classList.add("dark");
}


filtroTags.forEach(tag => {
  tag.addEventListener("click", () => {
    filtroTags.forEach(t => t.classList.remove("ativo"));
    tag.classList.add("ativo");
    tagSelecionada = tag.dataset.tag;
    renderizar();
  });
});


inputTags.forEach(tag => {
  tag.addEventListener("click", () => {
    inputTags.forEach(t => t.classList.remove("ativo"));
    tag.classList.add("ativo");
    tagInputSelecionada = tag.dataset.tag;
  });
});

// Salvar tarefa (criar ou editar)
btnSalvar.addEventListener("click", () => {
  const texto = inputItem.value.trim();
  if (texto === "" || !tagInputSelecionada) {
    alert("Digite um item e selecione uma tag.");
    return;
  }

  if (editandoIndex !== null) {
    tarefas[editandoIndex].texto = texto;
    tarefas[editandoIndex].tag = tagInputSelecionada;
    editandoIndex = null;
  } else {
    tarefas.push({ texto, tag: tagInputSelecionada, concluido: false });
  }

  salvarTarefas();
  resetarFormulario();
  renderizar();
});


btnCancelar.addEventListener("click", () => {
  resetarFormulario();
});

function resetarFormulario() {
  inputItem.value = "";
  tagInputSelecionada = null;
  inputTags.forEach(t => t.classList.remove("ativo"));
  editandoIndex = null;
  btnSalvar.textContent = "Salvar";
}

function toggleConcluido(index) {
  tarefas[index].concluido = !tarefas[index].concluido;
  salvarTarefas();
  renderizar();
}


function editarItem(index) {
  const tarefa = tarefas[index];
  inputItem.value = tarefa.texto;
  tagInputSelecionada = tarefa.tag;
  inputTags.forEach(t => {
    t.classList.toggle("ativo", t.dataset.tag === tarefa.tag);
  });
  editandoIndex = index;
  btnSalvar.textContent = "Atualizar";
}




function renderizar() {
  lista.innerHTML = "";

  const filtradas = tarefas.filter(tarefa =>
    tagSelecionada === "todos" || tarefa.tag === tagSelecionada
  );

  filtradas.forEach((tarefa, index) => {
    const li = document.createElement("li");
    li.classList.add("item-tarefa");

    const esquerda = document.createElement("div");
    esquerda.style.display = "flex";
    esquerda.style.alignItems = "center";
    esquerda.style.gap = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluido;
    checkbox.addEventListener("change", () => toggleConcluido(index));

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
    btnEditar.onclick = () => editarItem(index);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.title = "Excluir";
    btnExcluir.onclick = () => excluirItem(index);

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    li.appendChild(esquerda);
    li.appendChild(tagSpan);
    li.appendChild(botoes);

    lista.appendChild(li);
  });
}


function salvarTarefas() {
  localStorage.setItem("tarefasChecklist", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const salvo = localStorage.getItem("tarefasChecklist");
  return salvo ? JSON.parse(salvo) : [];
}

renderizar();
