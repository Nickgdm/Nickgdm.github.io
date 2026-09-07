// =====================================================
// QA TOOLBOX — PÁGINA SOBRE
// Carregamento do README do GitHub
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    // =================================================
    // ELEMENTO DO README
    // =================================================

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
      `/${githubBranch}/`;


    const githubBlobBase =
      `https://github.com/` +
      `${githubUser}/` +
      `${githubRepository}/` +
      `/blob/${githubBranch}/`;


    const githubReadme =
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
          `${githubReadme}?t=${Date.now()}`,
          {
            cache: "no-store"
          }
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
      // CONVERTER README
      // ===============================================

      readmeContainer.innerHTML =
        marked.parse(
          markdown
        );


      // ===============================================
      // PROCESSAR LINKS
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


            // -----------------------------------------
            // LINKS RELATIVOS
            // -----------------------------------------

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

              } catch (error) {

                console.warn(
                  "Link inválido:",
                  href
                );

              }

            }


            // -----------------------------------------
            // LINKS EXTERNOS
            // -----------------------------------------

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
      // PROCESSAR IMAGENS
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


            // -----------------------------------------
            // IMAGENS RELATIVAS
            // -----------------------------------------

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

              } catch (error) {

                console.warn(
                  "Imagem inválida:",
                  src
                );

              }

            }


            // -----------------------------------------
            // LAZY LOADING
            // -----------------------------------------

            img.loading =
              "lazy";


            // -----------------------------------------
            // ALT
            // -----------------------------------------

            if (
              !img.alt ||
              !img.alt.trim()
            ) {

              img.alt =
                "Imagem do README do GitHub";

            }


            // -----------------------------------------
            // ERRO
            // -----------------------------------------

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
      // CÓDIGOS
      // ===============================================

      readmeContainer
        .querySelectorAll(
          "pre code"
        )
        .forEach(
          (code) => {

            code.setAttribute(
              "tabindex",
              "0"
            );

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


          <h3>
            Não foi possível carregar o perfil.
          </h3>


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