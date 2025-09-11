// auth.js
const BASE = (window.SEVA_API_BASE || "").replace(/\/+$/, "");
const $ = (s) => document.querySelector(s);
const setMsg = (el, text, ok=false) => {
  if (!el) return;
  el.textContent = text || "";
  el.className = "auth-msg " + (ok ? "ok" : "err");
};

// Sekme geçişi
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

// Kayıt
$("#regBtn")?.addEventListener("click", async () => {
  const email = $("#regEmail")?.value.trim();
  const password = $("#regPassword")?.value.trim();
  const msg = $("#regMsg");
  setMsg(msg, "");

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
    document.querySelector('[data-tab="login"]')?.click();
    if ($("#logEmail")) $("#logEmail").value = email;
  } catch {
    setMsg(msg, "Ağ hatası. Daha sonra deneyin.");
  }
});

// Giriş
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
    if (!r.ok || !j.access_token) return setMsg(msg, j.detail || "Giriş başarısız.");

    localStorage.setItem("token", j.access_token);
    setMsg(msg, "Giriş başarılı! Yönlendiriliyorsunuz…", true);
    setTimeout(()=>{ window.location.href = "workshop.html"; }, 600);
  } catch {
    setMsg(msg, "Ağ hatası. Daha sonra deneyin.");
  }
});