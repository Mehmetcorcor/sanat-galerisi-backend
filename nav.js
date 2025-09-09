// nav.js — sepet sayacı ve auth linkleri
(function () {
  const CART_KEY = "seva_cart";
  const token = localStorage.getItem("token");

  // Sepet sayacı
  const countEl = document.getElementById("navCartCount");
  if (countEl) {
    let items = [];
    try { items = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch {}
    const totalQty = items.reduce((a,b)=> a + (Number(b.qty)||0), 0);
    countEl.textContent = totalQty;
  }

  // Auth linkleri
  const authLink = document.getElementById("navAuthLink");
  const logout = document.getElementById("navLogout");

  if (token) {
    // Kullanıcı girişli
    if (authLink) authLink.textContent = "Hesabım";
    if (logout) logout.style.display = "";
  } else {
    // Misafir
    if (authLink) authLink.textContent = "Giriş / Kayıt";
    if (logout) logout.style.display = "none";
  }

  // Çıkış
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      // İstersen sepeti de temizle:
      // localStorage.removeItem(CART_KEY);
      window.location.href = "auth.html";
    });
  }
})();