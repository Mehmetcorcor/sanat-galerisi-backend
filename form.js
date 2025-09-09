const form = document.getElementById('chatt-form');
const message = document.getElementById('form-message');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        message.textContent = "🎉 Başvurunuz başarıyla alındı. Teşekkür ederiz!";
        message.style.color = "green";
        form.reset();
      } else {
        message.textContent = "⚠️ Gönderim sırasında bir sorun oluştu.";
        message.style.color = "red";
      }
    } catch (error) {
      message.textContent = "🚫 Bağlantı hatası. Lütfen tekrar deneyin.";
      message.style.color = "red";
    }
});