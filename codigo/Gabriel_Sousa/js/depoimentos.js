document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('depoimentos-form');
  const list = document.getElementById('testimonials-list');
  async function loadTestimonies() {
    const res = await fetch('http://localhost:3000/depoimentos');
    const deps = await res.json();
    list.innerHTML = '';
    deps.forEach(dep => {
      const div = document.createElement('div');
      div.classList.add('testimonial');
      div.innerHTML = `<p>"${dep.texto}"</p><img src="../img/${dep.imagem}" alt="Usuário">`;
      list.appendChild(div);
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = document.getElementById('relato').value;
    await fetch('http://localhost:3000/depoimentos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ texto, imagem: 'usuario1.png' })
    });
    form.reset();
    loadTestimonies();
  });
  loadTestimonies();
});