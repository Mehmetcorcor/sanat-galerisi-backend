// nav.js — sepet sayacı ve auth linkleri
(function () {
  const CART_KEY = "seva_cart";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }

  function updateCartCount() {
    const countEl = document.getElementById("navCartCount");
    if (!countEl) return;
    const items = getCart();
    const totalQty = items.reduce((a, b) => a + (Number(b.qty) || 0), 0);
    countEl.textContent = totalQty;
  }

  function updateAuthLinks() {
    const token = localStorage.getItem("token");
    const authLink = document.getElementById("navAuthLink");
    const logout = document.getElementById("navLogout");

    if (token) {
      if (authLink) authLink.textContent = "Hesabım";
      if (logout) logout.style.display = "";
    } else {
      if (authLink) authLink.textContent = "Giriş / Kayıt";
      if (logout) logout.style.display = "none";
    }

    if (logout) {
      logout.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        // localStorage.removeItem(CART_KEY); // sepeti de temizlemek istersen
        window.location.href = "auth.html";
      };
    }
  }

  // İlk yüklemede ayarla
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      updateCartCount();
      updateAuthLinks();
    });
  } else {
    updateCartCount();
    updateAuthLinks();
  }

  // Başka sekmelerdeki değişiklikleri yakala
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) updateCartCount();
    if (e.key === "token") updateAuthLinks();
  });
})();