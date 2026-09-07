// =====================================================
// QA TOOLBOX — MENU FLUTUANTE GLOBAL
// =====================================================

(() => {
  "use strict";

  const STORAGE_POSITION = "qa-toolbox-position";
  const POSITIONS = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ];

  function getClosestCorner(clientX, clientY) {
    const horizontal =
      clientX < window.innerWidth / 2 ? "left" : "right";

    const vertical =
      clientY < window.innerHeight / 2 ? "top" : "bottom";

    return `${vertical}-${horizontal}`;
  }

  function initializeToolboxMenu() {
    const wrapper = document.querySelector(".toolbox-float");
    const button = document.getElementById("toolbox-float-button");
    const menu = document.getElementById("toolbox-float-menu");

    if (!wrapper || !button || !menu) {
      return;
    }

    const savedPosition = localStorage.getItem(STORAGE_POSITION);

    const initialPosition = POSITIONS.includes(savedPosition)
      ? savedPosition
      : "bottom-right";

    wrapper.dataset.position = initialPosition;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;

    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };

    const setPosition = (position) => {
      if (!POSITIONS.includes(position)) {
        return;
      }

      wrapper.dataset.position = position;
      localStorage.setItem(STORAGE_POSITION, position);
    };

    button.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      dragging = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;

      button.setPointerCapture?.(event.pointerId);
    });

    button.addEventListener("pointermove", (event) => {
      if (!dragging) {
        return;
      }

      const distance = Math.hypot(
        event.clientX - startX,
        event.clientY - startY
      );

      if (distance > 8) {
        moved = true;
      }
    });

    button.addEventListener("pointerup", (event) => {
      if (!dragging) {
        return;
      }

      dragging = false;
      button.releasePointerCapture?.(event.pointerId);

      if (moved) {
        setPosition(
          getClosestCorner(
            event.clientX,
            event.clientY
          )
        );

        setOpen(false);

        // Impede que o pointerup seja interpretado como um clique.
        button.dataset.dragged = "true";
      }
    });

    button.addEventListener("click", (event) => {
      if (button.dataset.dragged === "true") {
        button.dataset.dragged = "false";
        event.preventDefault();
        return;
      }

      event.stopPropagation();

      const isOpen =
        button.getAttribute("aria-expanded") === "true";

      setOpen(!isOpen);
    });

    menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", () => {
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeToolboxMenu
    );
  } else {
    initializeToolboxMenu();
  }
})();
