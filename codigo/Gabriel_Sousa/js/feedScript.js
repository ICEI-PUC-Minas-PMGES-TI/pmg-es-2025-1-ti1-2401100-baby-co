const API_URL = 'http://localhost:3001';
let posts = [];
let commentsMap = {};
let likesMap = {};

document.addEventListener('DOMContentLoaded', () => {
  loadFeed();
});

async function loadFeed() {
  const testimonials = await fetchData('testimonials');
  const articles = await fetchData('articles'); // placeholder
  posts = [...testimonials, ...articles];

  const comments = await fetchData('comments');
  commentsMap = comments.reduce((acc, c) => {
    acc[c.itemId] = acc[c.itemId] || [];
    acc[c.itemId].push(c);
    return acc;
  }, {});

  const likes = await fetchData('likes');
  likesMap = likes.reduce((acc, l) => {
    acc[l.itemId] = (acc[l.itemId] || 0) + 1;
    return acc;
  }, {});

  renderFeed();
}

async function fetchData(resource) {
  try {
    const res = await fetch(`${API_URL}/${resource}`);
    return await res.json();
  } catch (err) {
    console.error(`Erro ao buscar ${resource}:`, err);
    return [];
  }
}

function renderFeed() {
  const container = document.getElementById('feed-container');
  container.innerHTML = '<h1>Feed de Depoimentos</h1>';

  posts.forEach(p => {
    const article = document.createElement('article');

    const title = document.createElement('h2');
    title.className = 'title';
    title.textContent = p.title || 'Depoimento';

    const content = document.createElement('p');
    content.className = 'content';
    content.textContent = p.content;

    const btnLike = document.createElement('button');
    btnLike.className = 'btn-like';
    btnLike.textContent = `👍 ${likesMap[p.id] || 0}`;
    btnLike.onclick = () => handleLike(p.id, btnLike);

    const commentsSection = document.createElement('section');
    commentsSection.className = 'comments';
    const commentsTitle = document.createElement('h3');
    commentsTitle.textContent = 'Comentários';
    commentsSection.appendChild(commentsTitle);

    const list = document.createElement('div');
    (commentsMap[p.id] || []).forEach(c => {
      const div = document.createElement('div');
      div.className = 'comment-item';
      div.textContent = c.text;
      list.appendChild(div);
    });
    commentsSection.appendChild(list);

    const form = document.createElement('form');
    form.className = 'comment-form';
    form.onsubmit = e => {
      e.preventDefault();
      const input = form.elements['comment'];
      const text = input.value.trim();
      if (text) handleComment(p.id, text);
      input.value = '';
    };
    const input = document.createElement('input');
    input.name = 'comment';
    input.placeholder = 'Escreva um comentário...';
    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.textContent = 'Enviar';
    form.appendChild(input);
    form.appendChild(sendBtn);
    commentsSection.appendChild(form);

    article.appendChild(title);
    article.appendChild(content);
    article.appendChild(btnLike);
    article.appendChild(commentsSection);
    container.appendChild(article);
  });
}

async function handleLike(id, btn) {
  await fetch(`${API_URL}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: id, timestamp: new Date() })
  });
  likesMap[id] = (likesMap[id] || 0) + 1;
  btn.textContent = `👍 ${likesMap[id]}`;
}

async function handleComment(id, text) {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: id, text, timestamp: new Date() })
  });
  const newComment = await res.json();
  commentsMap[id] = [...(commentsMap[id] || []), newComment];
  renderFeed();
}
