const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 3000;

// configs de middlewares do express
app.use(cors());
app.use(bodyParser.json());

// path do db
const postsFilePath = path.join(__dirname, '../db/db.json');

// rotas 
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

// usando node express para servir os arquivos estáticos do projeto
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname))); 
app.use('/html', express.static(path.join(__dirname, '../html')));
app.use(express.static(path.join(__dirname, '../public')));



// homepage rota
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

// rota da api usando json server
const router = jsonServer.router(path.join(__dirname, '../db/db.json'));
const middlewares = jsonServer.defaults();
app.use('/', middlewares, router);


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
