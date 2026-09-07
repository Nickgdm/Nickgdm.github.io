// =====================================================
// QA TOOLBOX — PÁGINA SOBRE
// Carregamento do README do GitHub
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const readmeContainer =
      document.getElementById(
        "github-readme"
      );


    if (!readmeContainer) {
      return;
    }


    // =================================================
    // CONFIGURAÇÃO
    // =================================================

    const githubUser =
      "Nickgdm";

    const githubRepository =
      "Nickgdm";

    const githubBranch =
      "main";


    const rawBase =
      `https://raw.githubusercontent.com/` +
      `${githubUser}/` +
      `${githubRepository}/` +
      `${githubBranch}/`;


    const githubBlobBase =
      `https://github.com/` +
      `${githubUser}/` +
      `${githubRepository}/` +
      `blob/` +
      `${githubBranch}/`;


    const readmeUrl =
      `${rawBase}README.md`;


    // =================================================
    // LOADING
    // =================================================

    readmeContainer.innerHTML = `

      <div class="readme-loading">

        <span class="readme-loading-dot"></span>

        <p>
          Carregando perfil do GitHub...
        </p>

      </div>

    `;


    try {

      // ===============================================
      // BUSCAR README
      // ===============================================

      const response =
        await fetch(
          `${readmeUrl}?t=${Date.now()}`
        );


      if (!response.ok) {

        throw new Error(
          `Erro HTTP: ${response.status}`
        );

      }


      const markdown =
        await response.text();


      // ===============================================
      // VALIDAR MARKED
      // ===============================================

      if (
        typeof marked ===
        "undefined"
      ) {

        throw new Error(
          "Biblioteca Markdown não carregada."
        );

      }


      // ===============================================
      // CONVERTER MARKDOWN
      // ===============================================

      readmeContainer.innerHTML =
        marked.parse(
          markdown
        );


      // ===============================================
      // CORRIGIR LINKS
      // ===============================================

      readmeContainer
        .querySelectorAll("a")
        .forEach(
          (link) => {

            const href =
              link.getAttribute(
                "href"
              );


            if (!href) {
              return;
            }


            // Links relativos do README

            if (
              !/^(https?:|mailto:|#)/i
                .test(href)
            ) {

              try {

                link.href =
                  new URL(
                    href,
                    githubBlobBase
                  ).href;

              } catch {

                return;

              }

            }


            // Links externos

            if (
              !href.startsWith("#")
            ) {

              link.target =
                "_blank";

              link.rel =
                "noopener noreferrer";

            }

          }
        );


      // ===============================================
      // CORRIGIR IMAGENS
      // ===============================================

      readmeContainer
        .querySelectorAll("img")
        .forEach(
          (img) => {

            const src =
              img.getAttribute(
                "src"
              );


            if (!src) {
              return;
            }


            if (
              !/^(https?:|data:)/i
                .test(src)
            ) {

              try {

                img.src =
                  new URL(
                    src,
                    rawBase
                  ).href;

              } catch {

                return;

              }

            }


            img.loading =
              "lazy";


            img.addEventListener(
              "error",
              () => {

                img.style.opacity =
                  "0.25";

              }
            );

          }
        );


      // ===============================================
      // CÓDIGO
      // ===============================================

      readmeContainer
        .querySelectorAll("pre code")
        .forEach(
          (code) => {

            code.setAttribute(
              "tabindex",
              "0"
            );

          }
        );


      // ===============================================
      // LINKS EXTERNOS
      // ===============================================

      readmeContainer
        .querySelectorAll(
          'a[href^="http"], a[href^="mailto:"]'
        )
        .forEach(
          (link) => {

            link.target =
              "_blank";

            link.rel =
              "noopener noreferrer";

          }
        );


      // ===============================================
      // SUCESSO
      // ===============================================

      readmeContainer.classList.add(
        "loaded"
      );

    } catch (error) {

      console.error(
        "Erro ao carregar o perfil do GitHub:",
        error
      );


      // =============================================
      // FALLBACK
      // =============================================

      readmeContainer.innerHTML = `

        <div class="readme-error">

          <div class="readme-error-icon">
            !
          </div>

          <h2>
            Não foi possível carregar o perfil.
          </h2>

          <p>
            O README do GitHub não pôde ser carregado
            neste momento.
          </p>

          <a
            href="https://github.com/Nickgdm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver perfil no GitHub →
          </a>

        </div>

      `;

    }

  }
);