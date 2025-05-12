document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('servicos-form');
  const list = document.getElementById('services-list');
  async function loadServices() {
    const res = await fetch('http://localhost:3000/servicos');
    const services = await res.json();
    list.innerHTML = '';
    services.forEach(svc => {
      const div = document.createElement('div');
      div.classList.add('service-item');
      div.innerHTML = `<h3>${svc.titulo}</h3><p>${svc.descricao}</p>`;
      list.appendChild(div);
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    await fetch('http://localhost:3000/servicos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ titulo, descricao })
    });
    form.reset();
    loadServices();
  });
  loadServices();
});