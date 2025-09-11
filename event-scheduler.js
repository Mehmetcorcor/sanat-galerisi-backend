// js/event-scheduler.js
(() => {
  // Backend tabanı: önce global değişken (opsiyonel), yoksa Render URL
  const BASE = (window.SEVA_API_BASE || "https://sanat-galerisi-backend.onrender.com").replace(/\/+$/,"");
  const getToken = () => localStorage.getItem("token");

  // sayfadaki tüm bilet butonlarını yakala (tek sefer bağla)
  document.querySelectorAll("[data-schedule-btn]").forEach((btn) => {
    if (btn._agBound) return;
    btn._agBound = true;
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      await openInlineScheduler(btn);
    });
  });

  async function openInlineScheduler(triggerEl) {
    const next = triggerEl.nextElementSibling;
    if (next && next.classList?.contains("ag-sched")) {
      next.remove(); return;
    }

    const wrap = document.createElement("div");
    wrap.className = "ag-sched";
    wrap.innerHTML = `
      <div class="ag-head">
        <div class="ag-title">${triggerEl.getAttribute("data-event-title") || "Etkinlik"}</div>
        <span class="ag-badge">Bilet Seçimi</span>
      </div>

      <div class="ag-grid">
        <div><label>Tarih</label><br/><select id="agDate"></select></div>
        <div><label>Saat</label><br/><select id="agTime"></select></div>
        <div class="ag-qty"><label>Adet</label><input id="agQty" type="number" min="1" step="1" value="1"/></div>
        <div class="ag-price" id="agPrice">—</div>
      </div>

      <div class="ag-actions">
        <button class="ag-add" id="agAdd">Sepete Ekle</button>
        <button class="ag-cancel" id="agCancel" type="button">Vazgeç</button>
      </div>
      <div class="ag-err" id="agErr"></div>
      <div class="ag-sub">Sepete eklendikten sonra “Sepetim” sayfasından ödeme adımına geçebilirsiniz.</div>
    `;
    triggerEl.insertAdjacentElement("afterend", wrap);

    const el = {
      date: wrap.querySelector("#agDate"),
      time: wrap.querySelector("#agTime"),
      qty:  wrap.querySelector("#agQty"),
      price:wrap.querySelector("#agPrice"),
      add:  wrap.querySelector("#agAdd"),
      cancel:wrap.querySelector("#agCancel"),
      err:  wrap.querySelector("#agErr"),
    };

    const eventId = triggerEl.getAttribute("data-event-id");
    if (!eventId) { el.err.textContent = "Etkinlik ID bulunamadı."; return; }

    const sessions = await loadSessions(eventId);
    fillDates(el.date, sessions);
    fillTimes(el.time, sessions, el.date.value);

    const recalc = () => {
      const qty = Math.max(1, parseInt(el.qty.value || "1", 10));
      const sel = findSelection(sessions, el.date.value, el.time.value);
      const unit = sel?.timeObj?.price ?? 0;
      el.price.textContent = money(unit * qty);
    };

    el.date.addEventListener("change", () => { fillTimes(el.time, sessions, el.date.value); recalc(); });
    el.time.addEventListener("change", recalc);
    el.qty.addEventListener("input", recalc);
    recalc();

    el.add.addEventListener("click", async () => {
      el.err.textContent = "";
      try {
        const qty = Math.max(1, parseInt(el.qty.value || "1", 10));
        const sel = findSelection(sessions, el.date.value, el.time.value);
        if (!sel) throw new Error("Lütfen gün ve saat seçiniz.");

        await addToCartForm({
          event_id: sel.event_id,
          session_id: sel.session_id,
          date: sel.date,
          time: sel.timeObj.time,
          qty: String(qty),
        });

        const CART_KEY = "seva_cart";
        const current = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        const item = {
          eventId: sel.event_id,
          title: triggerEl.dataset.eventTitle || "Etkinlik",
          date: sel.date,
          time: sel.timeObj.time,
          qty,
          unitPrice: sel.timeObj.price || 0,
          subtotal: (sel.timeObj.price || 0) * qty
        };
        current.push(item);
        localStorage.setItem(CART_KEY, JSON.stringify(current));

        alert("Sepete eklendi!");
        wrap.remove();
      } catch (err) {
        el.err.textContent = err?.message || "Sepete eklenemedi.";
      }
    });

    el.cancel.addEventListener("click", () => wrap.remove());
    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ---- Helpers ----
  async function loadSessions(eventId) {
    try {
      const r = await fetch(`${BASE}/events/${encodeURIComponent(eventId)}/sessions`);
      if (!r.ok) throw new Error("Oturumlar yüklenemedi");
      const data = await r.json();
      return data.map((d) => ({ ...d, event_id: eventId }));
    } catch {
      // Backend erişilemezse demo
      return [
        { event_id: eventId, session_id: "S-12-1", date: "2025-09-12",
          times: [{ time: "14:00", price: 350, stock: 40, key: "S-12-1-1400" },
                  { time: "18:00", price: 450, stock: 25, key: "S-12-1-1800" }] },
        { event_id: eventId, session_id: "S-18-1", date: "2025-09-18",
          times: [{ time: "14:00", price: 350, stock: 40, key: "S-18-1-1400" },
                  { time: "20:00", price: 500, stock: 15, key: "S-18-1-2000" }] },
      ];
    }
  }

  function fillDates(selectEl, sessions) {
    selectEl.innerHTML = "";
    sessions.forEach((s) => {
      const o = document.createElement("option");
      o.value = s.date;
      o.textContent = toTRDate(s.date);
      selectEl.appendChild(o);
    });
  }

  function fillTimes(selectEl, sessions, dateVal) {
    selectEl.innerHTML = "";
    const s = sessions.find((x) => x.date === dateVal);
    (s?.times || []).forEach((t) => {
      const o = document.createElement("option");
      o.value = t.key || t.time;
      o.textContent = `${t.time}${t.stock != null ? ` (Kalan: ${t.stock})` : ""}`;
      o.dataset.price = t.price ?? "";
      selectEl.appendChild(o);
    });
    if (!selectEl.value && selectEl.firstChild) {
      selectEl.value = selectEl.firstChild.value;
    }
  }

  function findSelection(sessions, dateVal, timeKeyOrVal) {
    const s = sessions.find((x) => x.date === dateVal);
    if (!s) return null;
    const timeObj = (s.times || []).find((t) => (t.key || t.time) === timeKeyOrVal);
    if (!timeObj) return null;
    return { event_id: s.event_id, session_id: s.session_id, date: s.date, timeObj };
  }

  async function addToCartForm(payload) {
    const params = new URLSearchParams(payload);
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const r = await fetch(`${BASE}/cart/items`, { method: "POST", headers, body: params });
    if (!r.ok) {
      let msg = "Sepete eklenemedi";
      try { const j = await r.json(); msg = j?.detail || JSON.stringify(j); } catch {}
      throw new Error(msg);
    }
    return r.json();
  }

  function toTRDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    return `${d} ${months[m - 1]} ${y}`;
  }

  function money(n) { return Number(n || 0).toLocaleString("tr-TR") + " ₺"; }
})();