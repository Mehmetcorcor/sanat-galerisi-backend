// === Basit yardımcılar ===
const BASE = "http://127.0.0.1:8000"; // FastAPI adresin
const $ = (s) => document.querySelector(s);
const setMsg = (el, text, ok=false) => {
  if (!el) return;
  el.textContent = text || "";
  el.className = "auth-msg " + (ok ? "ok" : "err");
};

// === Sekme geçişleri (Giriş / Kayıt) ===
(() => {
  const tabs  = document.querySelectorAll(".auth-tab");
  const panes = document.querySelectorAll(".auth-pane");
  tabs.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      tabs.forEach(b=>b.classList.remove("is-active"));
      panes.forEach(p=>p.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.querySelector(`#pane-${btn.dataset.tab}`).classList.add("is-active");
    });
  });
})();

// === Kayıt ===
$("#regBtn")?.addEventListener("click", async () => {
  const email = $("#regEmail")?.value.trim();
  const password = $("#regPassword")?.value.trim();
  const msg = $("#regMsg");
  setMsg(msg, ""); // temizle

  if (!email || !password) return setMsg(msg, "E-posta ve şifre zorunlu.");
  if (password.length < 6)   return setMsg(msg, "Şifre en az 6 karakter olmalı.");

  try {
    const body = new URLSearchParams({ email, password });
    const r = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const j = await r.json().catch(() => ({}));

    if (!r.ok) return setMsg(msg, j.detail || "Kayıt başarısız.");

    setMsg(msg, "Kayıt başarılı. Şimdi giriş yapabilirsin.", true);
    // İstersen otomatik olarak Giriş sekmesine geç:
    document.querySelector('[data-tab="login"]')?.click();
    $("#logEmail") && ($("#logEmail").value = email);
  } catch (e) {
    setMsg(msg, "Ağ hatası. Daha sonra tekrar deneyin.");
  }
});

// === Giriş ===
$("#logBtn")?.addEventListener("click", async () => {
  const email = $("#logEmail")?.value.trim();
  const password = $("#logPassword")?.value.trim();
  const msg = $("#logMsg");
  setMsg(msg, "");

  if (!email || !password) return setMsg(msg, "E-posta ve şifre zorunlu.");

  try {
    const body = new URLSearchParams({ email, password });
    const r = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const j = await r.json().catch(() => ({}));

    if (!r.ok || !j.access_token) {
      return setMsg(msg, j.detail || "Giriş başarısız.");
    }

    // Token sakla ve yönlendir
    localStorage.setItem("token", j.access_token);
    setMsg(msg, "Giriş başarılı! Yönlendiriliyorsunuz…", true);
    setTimeout(() => {
      // girişten sonra gideceğin sayfa:
      window.location.href = "workshop.html"; // istersen index.html yap
    }, 600);
  } catch (e) {
    setMsg(msg, "Ağ hatası. Daha sonra tekrar deneyin.");
  }
});