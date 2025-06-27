const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.static(path.join(__dirname, '../html')));
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
const postsFilePath = path.join(__dirname, '../db/db.json');
app.post('/salvar-post', (req, res) => {
  const novoPost = req.body;
  let posts = [];
  if (fs.existsSync(postsFilePath)) {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  }
  posts.push(novoPost);
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
  res.json({ mensagem: 'Post salvo com sucesso!' });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.get('/obter-posts', (req, res) => {
  const postsFilePath = path.join(__dirname, '../db/db.json');

  if (fs.existsSync(postsFilePath)) {
    const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
    res.json(posts);
  } else {
    res.json([]);
  }
});
