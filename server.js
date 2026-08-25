const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const PIXABAY_KEY = "52036501-4b182030a33836db1d49ce934";
const UNSPLASH_KEY = "LJ2bmJ3GbqClJiYXf8S9WFmnIbD4Nlt_3uwgV1Mn2Ck";
const PEXELS_KEY = "SgxgKJUrPL7qfgWfYoz08bZvuIAuATomSkNElmAdQH8J9gghi7FaJKr6";

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));



app.get("/api/imagens", async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({
      erro: "É necessário informar uma pesquisa."
    });
  }

  try {
    const encodedQuery = encodeURIComponent(query);

    const [unsplashResult, pixabayResult, pexelsResult] =
      await Promise.allSettled([
        fetch(
          `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=20&client_id=${UNSPLASH_KEY}`
        ),

        fetch(
          `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodedQuery}&per_page=20`
        ),

        fetch(
          `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=20`,
          {
            headers: {
              Authorization: PEXELS_KEY
            }
          }
        )
      ]);

    const imagens = [];

    // UNSPLASH

    if (unsplashResult.status === "fulfilled") {
      const response = unsplashResult.value;

      console.log("Unsplash:", response.status);

      if (response.ok) {
        const data = await response.json();

        if (data.results) {
          data.results.forEach((img) => {
            imagens.push({
              src: img.urls.small,
              alt: img.alt_description || "Imagem",
              download: img.links.download,
              fonte: "Unsplash"
            });
          });
        }
      }
    } else {
      console.error(
        "Erro ao consultar Unsplash:",
        unsplashResult.reason
      );
    }


    //PIXABAY

    if (pixabayResult.status === "fulfilled") {
      const response = pixabayResult.value;

      console.log("Pixabay:", response.status);

      if (response.ok) {
        const data = await response.json();

        if (data.hits) {
          data.hits.forEach((img) => {
            imagens.push({
              src: img.webformatURL,
              alt: img.tags || "Imagem",
              download: img.largeImageURL,
              fonte: "Pixabay"
            });
          });
        }
      }
    } else {
      console.error(
        "Erro ao consultar Pixabay:",
        pixabayResult.reason
      );
    }


    //PEXELS

    if (pexelsResult.status === "fulfilled") {
      const response = pexelsResult.value;

      console.log("Pexels:", response.status);

      if (response.ok) {
        const data = await response.json();

        console.log(
          "Quantidade de imagens do Pexels:",
          data.photos?.length
        );

        if (data.photos) {
          data.photos.forEach((img) => {
            imagens.push({
              src: img.src.medium,
              alt: img.alt || "Imagem",
              download: img.src.original,
              fonte: "Pexels"
            });
          });
        }
      } else {
        const erroPexels = await response.text();

        console.error(
          "Erro da API Pexels:",
          response.status,
          erroPexels
        );
      }
    } else {
      console.error(
        "Erro ao conectar ao Pexels:",
        pexelsResult.reason
      );
    }

    return res.json({
      total: imagens.length,
      imagens
    });

  } catch (erro) {
    console.error("Erro geral:", erro);

    return res.status(500).json({
      erro: "Erro ao consultar as APIs de imagens."
    });
  }
});



app.get("/api/sugestoes", async (req, res) => {
  try {
    const temas = [
      "nature",
      "technology",
      "people",
      "city",
      "animals",
      "travel",
      "food"
    ];

    const tema = temas[Math.floor(Math.random() * temas.length)];

    console.log("Carregando sugestões sobre:", tema);

    const [unsplashResult, pixabayResult, pexelsResult] =
      await Promise.allSettled([
        // UNSPLASH
        fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            tema
          )}&per_page=12&client_id=${UNSPLASH_KEY}`
        ),

        // PIXABAY
        fetch(
          `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
            tema
          )}&per_page=12`
        ),

        // PEXELS
        fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            tema
          )}&per_page=12`,
          {
            headers: {
              Authorization: PEXELS_KEY
            }
          }
        )
      ]);

    const imagens = [];

    // UNSPLASH

    if (
      unsplashResult.status === "fulfilled" &&
      unsplashResult.value.ok
    ) {
      const data = await unsplashResult.value.json();

      if (Array.isArray(data.results)) {
        data.results.forEach((img) => {
          imagens.push({
            src: img.urls.small,
            alt: img.alt_description || "Imagem",
            download: img.links.download,
            fonte: "Unsplash"
          });
        });
      }
    } else {
      console.error("Erro ao carregar sugestões do Unsplash");
    }

    // PIXABAY

    if (
      pixabayResult.status === "fulfilled" &&
      pixabayResult.value.ok
    ) {
      const data = await pixabayResult.value.json();

      if (Array.isArray(data.hits)) {
        data.hits.forEach((img) => {
          imagens.push({
            src: img.webformatURL,
            alt: img.tags || "Imagem",
            download: img.largeImageURL,
            fonte: "Pixabay"
          });
        });
      }
    } else {
      console.error("Erro ao carregar sugestões do Pixabay");
    }

    // PEXELS

    if (
      pexelsResult.status === "fulfilled" &&
      pexelsResult.value.ok
    ) {
      const data = await pexelsResult.value.json();

      if (Array.isArray(data.photos)) {
        data.photos.forEach((img) => {
          imagens.push({
            src: img.src.medium,
            alt: img.alt || "Imagem",
            download: img.src.original,
            fonte: "Pexels"
          });
        });
      }
    } else {
      console.error("Erro ao carregar sugestões do Pexels");
    }

    console.log("Total de sugestões:", imagens.length);

    return res.json({
      tema,
      total: imagens.length,
      imagens
    });

  } catch (erro) {
    console.error("Erro ao carregar sugestões:", erro);

    return res.status(500).json({
      erro: "Erro ao carregar sugestões."
    });
  }
});



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});