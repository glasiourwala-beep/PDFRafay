(function () {
  "use strict";
  const KEY = "mjpdf_cookie_consent_v2";

  function getConsent() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch (_) {}
  }

  function hideBanner() {
    const el = document.getElementById("cookie-banner");
    if (el) {
      el.classList.add("hidden");
    }
  }

  function showBanner() {
    const el = document.getElementById("cookie-banner");
    if (el) {
      el.classList.remove("hidden");
    }
  }

  function bind() {
    const existing = getConsent();
    if (!existing || !existing.choice) {
      showBanner();
    } else {
      hideBanner();
    }

    document.getElementById("cookie-accept")?.addEventListener("click", function () {
      setConsent({ essential: true, analytics: false, ts: Date.now(), choice: "accept" });
      hideBanner();
    });

    document.getElementById("cookie-reject")?.addEventListener("click", function () {
      setConsent({ essential: true, analytics: false, ts: Date.now(), choice: "reject" });
      hideBanner();
    });

    document.getElementById("cookie-settings-btn")?.addEventListener("click", function () {
      showBanner();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  window.PDFRafayCookies = {
    getConsent: getConsent,
    setConsent: setConsent,
    showBanner: showBanner
  };
})();
