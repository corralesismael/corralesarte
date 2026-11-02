/* =========================================
   CORRALES — SISTEMA DE IDIOMAS
   Español / English
   ========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "corrales-language";

  const SUPPORTED_LANGUAGES = ["es", "en"];

  function detectLanguage() {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    const browserLanguages =
      navigator.languages || [navigator.language || "es"];

    for (const language of browserLanguages) {
      const code = language.toLowerCase().split("-")[0];

      if (SUPPORTED_LANGUAGES.includes(code)) {
        return code;
      }
    }

    return "es";
  }

  function applyLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      language = "es";
    }

    document.documentElement.lang = language;

    document.querySelectorAll("[data-es][data-en]")
      .forEach(function (element) {
        element.textContent = element.getAttribute(
          "data-" + language
        );
      });

    document.querySelectorAll("[data-placeholder-es][data-placeholder-en]")
      .forEach(function (element) {
        element.placeholder = element.getAttribute(
          "data-placeholder-" + language
        );
      });

    document.querySelectorAll("[data-aria-es][data-aria-en]")
      .forEach(function (element) {
        element.setAttribute(
          "aria-label",
          element.getAttribute("data-aria-" + language)
        );
      });

    document.querySelectorAll("[data-lang-button]")
      .forEach(function (button) {
        const active =
          button.getAttribute("data-lang-button") === language;

        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("active", active);
      });

    window.dispatchEvent(
      new CustomEvent("corrales:languagechange", {
        detail: { language: language }
      })
    );
  }

  function changeLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, language);
    applyLanguage(language);
  }

  function initialize() {
    const language = detectLanguage();

    applyLanguage(language);

    document.querySelectorAll("[data-lang-button]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          changeLanguage(
            button.getAttribute("data-lang-button")
          );
        });
      });
  }

  window.CorralesLanguage = {
    detect: detectLanguage,
    change: changeLanguage,
    apply: applyLanguage
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
