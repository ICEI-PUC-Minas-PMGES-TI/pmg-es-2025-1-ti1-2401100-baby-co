// ----- Navegação entre seções -----
const navItems = document.querySelectorAll('.nav_info');
const sideContent = document.querySelectorAll('.side > div');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-target');

    sideContent.forEach(div => {
      div.style.display = 'none';
    });

    const targetDiv = document.querySelector(`.${target}`);
    if (targetDiv) {
      targetDiv.style.display = 'block';
      // Se for aba Analise, carrega o gráfico
      if (target === 'Analise') {
        loadGrafico();
      }
      // Se for aba historico, carrega histórico
      if (target === 'historico') {
        loadHistorico();
      }
    }

    navItems.forEach(nav => {
      nav.style.backgroundColor = '';
      nav.style.color = '';
    });
    item.style.backgroundColor = '#004F44';
    item.style.color = '#fff';
  });
});

// Selecionar elementos do DOM
const form = document.getElementById("formCadastro");
const containerHistorico = document.querySelector('.mananger');
const ctxGrafico = document.getElementById('graficoCrescimento').getContext('2d');

let chartInstance = null; // Para guardar a instância do gráfico e poder atualizar depois

// Evento para cadastrar dados
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const peso = document.getElementById("peso").value;
    const idade = document.getElementById("idade").value;

    const dados = {
      peso: parseFloat(peso),
      idade: parseInt(idade)
    };

    try {
      const response = await fetch("http://localhost:3000/dadosBebe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        alert("Dados cadastrados com sucesso!");
        form.reset();
        loadHistorico();
        // Se o gráfico estiver aberto, atualiza
        if (document.querySelector('.Analise').style.display === 'block') {
          loadGrafico();
        }
      } else {
        alert("Erro ao cadastrar os dados.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    }
  });
}

// Função para carregar histórico e popular o container
async function loadHistorico() {
  try {
    const response = await fetch("http://localhost:3000/dadosBebe");
    const dados = await response.json();

    containerHistorico.innerHTML = '';

    dados.forEach(dado => {
      const card = document.createElement('div');
      card.classList.add('cardhist');
      card.innerHTML = `
        <div class="info-card"> 
          <label class="title-card-hist">PESO:</label>
          <label class="info-card-hist">${dado.peso} Kg</label>
        </div>
        <div class="bt-card"></div> 
        <div class="info-card"> 
          <label class="title-card-hist">IDADE</label>
          <label class="info-card-hist">${dado.idade} meses</label>
        </div>
        <button class="btn-delete" data-id="${dado.id}">
          <span class="text">Delete</span>
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
        </button>
      `;
      containerHistorico.appendChild(card);
    });

    // Adiciona evento de exclusão
    const botoesDeletar = document.querySelectorAll('.btn-delete');
    botoesDeletar.forEach(botao => {
      botao.addEventListener('click', async () => {
        const id = botao.getAttribute('data-id');
        try {
          const response = await fetch(`http://localhost:3000/dadosBebe/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            alert('Registro excluído com sucesso.');
            loadHistorico();
            // Atualiza gráfico se estiver aberto
            if (document.querySelector('.Analise').style.display === 'block') {
              loadGrafico();
            }
          } else {
            alert('Erro ao excluir o registro.');
          }
        } catch (error) {
          console.error('Erro ao excluir:', error);
          alert('Erro de conexão com o servidor.');
        }
      });
    });

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

// Função para carregar e desenhar o gráfico
async function loadGrafico() {
  try {
    const response = await fetch("http://localhost:3000/dadosBebe");
    const dados = await response.json();

    // Ordena os dados por idade
    dados.sort((a, b) => a.idade - b.idade);

    // Extrai as idades e pesos para os dados do gráfico
    const labels = dados.map(dado => dado.idade + 'M');
    const pesos = dados.map(dado => dado.peso);

    // Se já existe gráfico, destrói antes de criar outro
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctxGrafico, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Peso do bebê (kg)',
          data: pesos,
          fill: false,
          borderColor: 'rgba(0, 79, 68, 1)',
          backgroundColor: 'rgba(0, 79, 68, 0.5)',
          tension: 0.1,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Peso (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Idade (meses)'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao carregar dados para o gráfico:', error);
  }
}

// Ao carregar a página, seleciona a primeira aba e carrega histórico
window.addEventListener('DOMContentLoaded', () => {
  if (navItems.length > 0) {
    navItems[0].click();
  }
});
