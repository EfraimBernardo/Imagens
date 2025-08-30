const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3003;

// tua chave do Pixabay
const PIXABAY_API_KEY = '52036501-4b182030a33836db1d49ce934';

// servir arquivos da pasta public (HTML, CSS, JS)
app.use(express.static('public'));

// rota de pesquisa
app.get('/api/pesquisa', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: q || 'nature',   // se não passar nada, pesquisa "nature"
        image_type: 'photo',
        per_page: 30
      }
    });

    res.json(response.data.hits); // no Pixabay é "hits", não "results"
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
