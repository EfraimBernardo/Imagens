const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;

// tua chave do Unsplash
const UNSPLASH_ACCESS_KEY = 'LJ2bmJ3GbqClJiYXf8S9WFmnIbD4Nlt_3uwgV1Mn2Ck'; 

// servir arquivos da pasta public (HTML, CSS, JS)
app.use(express.static('public'));

// rota de pesquisa
app.get('/api/pesquisa', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: q || 'nature', // se não passar nada, pesquisa "nature"
        per_page: 30,
      },
      headers: { Authorization: `Client-ID ${LJ2bmJ3GbqClJiYXf8S9WFmnIbD4Nlt_3uwgV1Mn2Ck}` }
    });

    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
