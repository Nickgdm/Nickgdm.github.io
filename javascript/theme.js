// =====================================================
// QA TOOLBOX — SISTEMA GLOBAL DE TEMAS
// =====================================================

(() => {
  "use strict";

  const STORAGE_BACKGROUND = "qa-bg";
  const STORAGE_ACCENT = "qa-accent";

  const DEFAULT_BACKGROUND = "black";
  const DEFAULT_ACCENT = "navy";

  const backgrounds = {
    black: "Preto",
    gray: "Cinza",
    white: "Branco"
  };

  const accents = {
    blue: "Azul",
    navy: "Azul escuro",
    wine: "Vinho",
    orange: "Laranja",
    yellow: "Amarelo",
    purple: "Roxo",
    lime: "Verde-lima",
    green: "Verde escuro"
  };

  function getValidBackground(value) {
    return backgrounds[value] ? value : DEFAULT_BACKGROUND;
  }

  function getValidAccent(value) {
    return accents[value] ? value : DEFAULT_ACCENT;
  }

  function updatePickerState(background, accent) {
    document
      .querySelectorAll("[data-background-choice]")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.backgroundChoice === background
        );
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.backgroundChoice === background)
        );
      });

    document
      .querySelectorAll("[data-accent-choice]")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.accentChoice === accent
        );
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.accentChoice === accent)
        );
      });
  }

  function applyTheme(backgroundName, accentName) {
    const background = getValidBackground(backgroundName);
    const accent = getValidAccent(accentName);

    document.documentElement.dataset.bg = background;
    document.documentElement.dataset.accent = accent;

    localStorage.setItem(STORAGE_BACKGROUND, background);
    localStorage.setItem(STORAGE_ACCENT, accent);

    updatePickerState(background, accent);

    window.dispatchEvent(
      new CustomEvent("qa-theme-change", {
        detail: {
          background,
          accent
        }
      })
    );
  }

  function initializePicker() {
    const picker = document.querySelector(".theme-picker");

    if (!picker) {
      return;
    }

    // Os temas agora ficam visíveis diretamente no menu.
    // Não existe mais um botão intermediário "Alterar tema".
    picker
      .querySelectorAll("[data-background-choice]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const currentAccent =
            localStorage.getItem(STORAGE_ACCENT) || DEFAULT_ACCENT;

          applyTheme(
            button.dataset.backgroundChoice,
            currentAccent
          );
        });
      });

    picker
      .querySelectorAll("[data-accent-choice]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const currentBackground =
            localStorage.getItem(STORAGE_BACKGROUND) || DEFAULT_BACKGROUND;

          applyTheme(
            currentBackground,
            button.dataset.accentChoice
          );
        });
      });
  }

  function initialize() {
    const savedBackground = getValidBackground(
      localStorage.getItem(STORAGE_BACKGROUND)
    );

    const savedAccent = getValidAccent(
      localStorage.getItem(STORAGE_ACCENT)
    );

    applyTheme(savedBackground, savedAccent);
    initializePicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  window.QATheme = {
    apply: applyTheme,
    getBackground: () =>
      getValidBackground(
        localStorage.getItem(STORAGE_BACKGROUND)
      ),
    getAccent: () =>
      getValidAccent(
        localStorage.getItem(STORAGE_ACCENT)
      )
  };
})();
