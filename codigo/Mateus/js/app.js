document.addEventListener('DOMContentLoaded', () => {

    const listaItens = document.getElementById('listaItens');
    const botaoAdicionar = document.getElementById('botaoAdicionar');
    const formContainer = document.getElementById('formContainer');
    const formTitulo = document.getElementById('formTitulo');
    const itemTexto = document.getElementById('itemTexto');
    const botaoSalvar = document.getElementById('botaoSalvar');
    const botaoCancelar = document.getElementById('botaoCancelar');


    let itens = [
        { id: 1, texto: 'Fralda', concluido: false },
        { id: 2, texto: 'RG', concluido: false },
        { id: 3, texto: 'Carteira de vacina', concluido: false },
        { id: 4, texto: 'Mamadeira', concluido: false },
        { id: 5, texto: 'Chupeta', concluido: false }
    ];
    let proximoId = 6;
    let itemEditando = null;


    carregarItens();


    renderizarItens();


    botaoAdicionar.addEventListener('click', () => abrirFormulario());
    botaoSalvar.addEventListener('click', salvarItem);
    botaoCancelar.addEventListener('click', fecharFormulario);


    function carregarItens() {
        const itensArmazenados = localStorage.getItem('checklistItens');
        if (itensArmazenados) {
            itens = JSON.parse(itensArmazenados);
            // Encontrar o maior ID para continuar a sequência
            proximoId = Math.max(...itens.map(item => item.id)) + 1;
        }
    }


    function salvarNaStorage() {
        localStorage.setItem('checklistItens', JSON.stringify(itens));
    }


    function renderizarItens() {
        listaItens.innerHTML = '';
        
        if (itens.length === 0) {
            listaItens.innerHTML = '<div class="item-vazio">Nenhum item na lista. Adicione um novo item!</div>';
            return;
        }

        itens.forEach(item => {
            const itemElement = criarElementoItem(item);
            listaItens.appendChild(itemElement);
        });
    }

    function criarElementoItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item-checklist ${item.concluido ? 'item-concluido' : ''}`;
        itemDiv.dataset.id = item.id;

        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';

        const itemText = document.createElement('div');
        itemText.className = 'item-text';
        itemText.textContent = item.texto;
        itemContent.appendChild(itemText);

        const itemActions = document.createElement('div');
        itemActions.className = 'item-actions';

        const editarBtn = document.createElement('button');
        editarBtn.className = 'action-btn edit-btn';
        editarBtn.textContent = 'Editar';
        editarBtn.addEventListener('click', () => editarItem(item.id));

        const excluirBtn = document.createElement('button');
        excluirBtn.className = 'action-btn delete-btn';
        excluirBtn.textContent = 'Excluir';
        excluirBtn.addEventListener('click', () => excluirItem(item.id));

        itemActions.appendChild(editarBtn);
        itemActions.appendChild(excluirBtn);
        itemContent.appendChild(itemActions);

  
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'checkbox-container';

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.className = 'checkbox-input';
        checkboxInput.checked = item.concluido;
        checkboxInput.addEventListener('change', () => alternarConcluido(item.id));

        const checkboxCustom = document.createElement('span');
        checkboxCustom.className = 'checkbox-custom';

        const checkIcon = document.createElement('span');
        checkIcon.className = 'check';
        checkIcon.innerHTML = '&#9745;'; 

        const xIcon = document.createElement('span');
        xIcon.className = 'x';
        xIcon.innerHTML = '&#9744;';

        checkboxCustom.appendChild(checkIcon);
        checkboxCustom.appendChild(xIcon);

        checkboxContainer.appendChild(checkboxInput);
        checkboxContainer.appendChild(checkboxCustom);

        itemDiv.appendChild(itemContent);
        itemDiv.appendChild(checkboxContainer);

        return itemDiv;
    }


  
    function abrirFormulario(id = null) {
        if (id) {
         
            const item = itens.find(i => i.id === id);
            if (!item) return;
            
            itemEditando = id;
            formTitulo.textContent = 'Editar item';
            itemTexto.value = item.texto;
        } else {
            // Modo adição
            itemEditando = null;
            formTitulo.textContent = 'Adicionar novo item';
            itemTexto.value = '';
        }

        formContainer.classList.add('ativo');
        botaoAdicionar.style.display = 'none';
        itemTexto.focus();
    }


    
    function fecharFormulario() {
        formContainer.classList.remove('ativo');
        botaoAdicionar.style.display = 'block';
        itemTexto.value = '';
        itemEditando = null;
    }

    function salvarItem() {
        const texto = itemTexto.value.trim();
        if (!texto) return;

        if (itemEditando) {
            // Atualizar item existente
            const index = itens.findIndex(i => i.id === itemEditando);
            if (index !== -1) {
                itens[index].texto = texto;
            }
        } else {
            
            itens.push({
                id: proximoId++,
                texto: texto,
                concluido: false
            });
        }

        salvarNaStorage();
        renderizarItens();
        fecharFormulario();
    }


    function editarItem(id) {
        abrirFormulario(id);
    }

    
    function excluirItem(id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            itens = itens.filter(item => item.id !== id);
            salvarNaStorage();
            renderizarItens();
        }
    }

   
    function alternarConcluido(id) {
        const index = itens.findIndex(item => item.id === id);
        if (index !== -1) {
            itens[index].concluido = !itens[index].concluido;
            salvarNaStorage();
            renderizarItens();
        }
    }
});



  const toggle = document.getElementById('darkModeToggle');

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
  });   
  let tagSelecionada = null;
    let filtroTagAtual = 'todos';
