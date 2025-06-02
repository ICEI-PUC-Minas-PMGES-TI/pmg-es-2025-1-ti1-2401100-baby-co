const API_URL = 'http://localhost:3000';
let posts = [];
let commentsMap = {};
let likesMap = {};
const userId = getOrCreateUserId();

function getOrCreateUserId() {
  let id = localStorage.getItem('userId');
  if (!id) {
    id = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', id);
  }
  return id;
}

document.addEventListener('DOMContentLoaded', () => {
  loadFeed();
});

async function loadFeed() {
  const testimonials = await fetchData('depoimentos');
  const articles = await fetchData('servicos'); // placeholder
  posts = [...testimonials, ...articles];

  const comments = await fetchData('comments');
  commentsMap = comments.reduce((acc, c) => {
    acc[c.itemId] = acc[c.itemId] || [];
    acc[c.itemId].push(c);
    return acc;
  }, {});

  const likes = await fetchData('likes');
  likesMap = likes.reduce((acc, l) => {
    acc[l.itemId] = acc[l.itemId] || new Set();
    acc[l.itemId].add(l.userId);
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
    title.textContent = p.titulo || 'Depoimento';

    const content = document.createElement('p');
    content.className = 'content';
    content.textContent = p.descricao || p.texto;

    const likeCount = (likesMap[p.id] || new Set()).size;
    const alreadyLiked = likesMap[p.id]?.has(userId);

    const btnLike = document.createElement('button');
    btnLike.className = 'btn-like';
    btnLike.textContent = `👍 ${likeCount}`;
    btnLike.disabled = alreadyLiked;
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
      div.textContent = `${c.user}: ${c.text}`;
      list.appendChild(div);
    });
    commentsSection.appendChild(list);

    const form = document.createElement('form');
    form.className = 'comment-form';
    form.onsubmit = e => {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const text = form.elements['comment'].value.trim();
      if (name && text) handleComment(p.id, name, text);
      form.reset();
    };

    const inputName = document.createElement('input');
    inputName.name = 'name';
    inputName.placeholder = 'Seu nome';
    inputName.type = 'text';

    const inputComment = document.createElement('input');
    inputComment.name = 'comment';
    inputComment.placeholder = 'Escreva um comentário...';
    inputComment.type = 'text';

    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.textContent = 'Enviar';

    form.appendChild(inputName);
    form.appendChild(inputComment);
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
  if (likesMap[id]?.has(userId)) return;

  await fetch(`${API_URL}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: id, userId, timestamp: new Date() })
  });

  likesMap[id] = likesMap[id] || new Set();
  likesMap[id].add(userId);
  btn.textContent = `👍 ${likesMap[id].size}`;
  btn.disabled = true;
}

async function handleComment(id, user, text) {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: id, user, text, timestamp: new Date() })
  });
  const newComment = await res.json();
  commentsMap[id] = [...(commentsMap[id] || []), newComment];
  renderFeed();
}

