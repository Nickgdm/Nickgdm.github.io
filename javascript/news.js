// =====================================================
// QA TOOLBOX — QA RADAR
// Notícias, artigos e tendências de QA
// Português + Inglês
// =====================================================


// =====================================================
// CONFIGURAÇÃO
// =====================================================

const NEWS_CONFIG = {

  maxNews: 7,

  requestTimeout: 10000,

  portuguese: [

    {
      name: "Google News PT",
      badge: "Notícias",
      language: "PT",

      feed:
        "https://news.google.com/rss/search?q=qualidade+de+software+OR+teste+de+software+OR+QA&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    },

    {
      name: "Medium PT",
      badge: "Medium",
      language: "PT",

      feed:
        "https://medium.com/feed/tag/teste-de-software"
    },

    {
      name: "Medium QA",
      badge: "Medium",
      language: "PT",

      feed:
        "https://medium.com/feed/tag/qualidade-de-software"
    }

  ],


  english: [

    {
      name: "Google News EN",
      badge: "News",
      language: "EN",

      feed:
        "https://news.google.com/rss/search?q=software+testing+OR+quality+assurance+OR+test+automation&hl=en-US&gl=US&ceid=US:en"
    },

    {
      name: "Medium Testing",
      badge: "Medium",
      language: "EN",

      feed:
        "https://medium.com/feed/tag/software-testing"
    },

    {
      name: "Medium QA",
      badge: "Medium",
      language: "EN",

      feed:
        "https://medium.com/feed/tag/quality-assurance"
    }

  ]

};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadQANews();

  }
);


// =====================================================
// CARREGAR NOTÍCIAS
// =====================================================

async function loadQANews() {

  const container =
    document.getElementById(
      "news-container"
    );


  if (!container) {
    return;
  }


  container.innerHTML = `
    <p class="loading-text">
      Buscando novidades do mundo de QA...
    </p>
  `;


  try {

    const feeds = [

      ...NEWS_CONFIG.portuguese,
      ...NEWS_CONFIG.english

    ];


    // -----------------------------------------------
    // BUSCAR TODAS AS FONTES
    // -----------------------------------------------

    const results =
      await Promise.allSettled(

        feeds.map(
          (source) =>
            fetchRSS(source)
        )

      );


    // -----------------------------------------------
    // CONSOLIDAR
    // -----------------------------------------------

    let news = [];


    results.forEach(
      (result) => {

        if (
          result.status ===
            "fulfilled" &&
          Array.isArray(
            result.value
          )
        ) {

          news.push(
            ...result.value
          );

        }

      }
    );


    // -----------------------------------------------
    // DUPLICADAS
    // -----------------------------------------------

    news =
      removeDuplicates(news);


    // -----------------------------------------------
    // ORDENAR
    // -----------------------------------------------

    news.sort(
      (a, b) => {

        return (
          new Date(b.date) -
          new Date(a.date)
        );

      }
    );


    // -----------------------------------------------
    // LIMITAR
    // -----------------------------------------------

    news =
      news.slice(
        0,
        NEWS_CONFIG.maxNews
      );


    // -----------------------------------------------
    // FALLBACK
    // -----------------------------------------------

    if (!news.length) {

      container.innerHTML = `
        <p class="error-text">
          Não foi possível carregar as notícias no momento.
        </p>
      `;

      return;

    }


    // -----------------------------------------------
    // RENDERIZAR
    // -----------------------------------------------

    container.innerHTML =
      news
        .map(
          (item) =>
            createNewsCard(item)
        )
        .join("");


  } catch (error) {

    console.error(
      "Erro ao carregar QA Radar:",
      error
    );


    container.innerHTML = `
      <p class="error-text">
        Não foi possível carregar as notícias no momento.
      </p>
    `;

  }

}


// =====================================================
// BUSCAR RSS
// =====================================================

async function fetchRSS(source) {

  const apiURL =
    "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent(
      source.feed
    );


  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },
      NEWS_CONFIG.requestTimeout
    );


  try {

    const response =
      await fetch(
        apiURL,
        {
          signal:
            controller.signal
        }
      );


    if (!response.ok) {

      throw new Error(
        `Erro HTTP: ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      data.status !== "ok" ||
      !Array.isArray(
        data.items
      )
    ) {

      throw new Error(
        "Feed RSS inválido."
      );

    }


    return data.items
      .slice(0, 8)
      .map(
        (item) => {

          return {

            title:
              cleanText(
                item.title
              ),

            description:
              cleanDescription(
                item.description
              ),

            author:
              cleanText(
                item.author ||
                source.name
              ),

            date:
              item.pubDate,

            url:
              sanitizeUrl(
                item.link
              ),

            source:
              source.name,

            badge:
              source.badge,

            language:
              source.language

          };

        }
      )
      .filter(
        (item) =>
          item.url &&
          item.title
      );


  } finally {

    clearTimeout(timeout);

  }

}


// =====================================================
// REMOVER DUPLICADAS
// =====================================================

function removeDuplicates(news) {

  const seen =
    new Set();


  return news.filter(
    (item) => {

      const key =
        item.url ||
        item.title;


      if (seen.has(key)) {

        return false;

      }


      seen.add(key);

      return true;

    }
  );

}


// =====================================================
// CRIAR CARD
// =====================================================

function createNewsCard(item) {

  const date =
    formatDate(
      item.date
    );


  const languageLabel =
    item.language === "PT"
      ? "PT"
      : "EN";


  return `

    <a
      href="${escapeHtml(item.url)}"
      target="_blank"
      rel="noopener noreferrer"
      class="news-card"
    >

      <article>

        <div class="news-top">

          <span class="news-date">
            ${escapeHtml(date)}
          </span>

          <div class="news-badges">

            <span class="news-language">
              ${languageLabel}
            </span>

            <span class="news-source">
              ${escapeHtml(item.badge)}
            </span>

          </div>

        </div>


        <h3 class="news-title">
          ${escapeHtml(item.title)}
        </h3>


        <p class="news-desc">
          ${escapeHtml(item.description)}
        </p>


        <div class="news-meta">

          <span class="news-author">
            ${escapeHtml(item.author)}
          </span>

          <span class="news-arrow">
            ↗
          </span>

        </div>

      </article>

    </a>

  `;

}


// =====================================================
// DATA
// =====================================================

function formatDate(date) {

  if (!date) {
    return "";
  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return "";

  }


  return parsedDate.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );

}


// =====================================================
// LIMPAR TEXTO
// =====================================================

function cleanText(value) {

  if (!value) {
    return "";
  }


  return String(value)

    .replace(
      /<[^>]*>/g,
      ""
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}


// =====================================================
// DESCRIÇÃO
// =====================================================

function cleanDescription(value) {

  if (!value) {

    return "Leia o conteúdo completo na fonte.";

  }


  let text =
    cleanText(value);


  if (text.length > 145) {

    text =
      text.substring(
        0,
        145
      ) +
      "...";

  }


  return text;

}


// =====================================================
// URL
// =====================================================

function sanitizeUrl(value) {

  if (!value) {
    return "";
  }


  try {

    const url =
      new URL(value);


    if (
      url.protocol !==
        "http:" &&
      url.protocol !==
        "https:"
    ) {

      return "";

    }


    return url.href;

  } catch {

    return "";

  }

}


// =====================================================
// PROTEÇÃO HTML
// =====================================================

function escapeHtml(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}