function toggleChat() {
    const chatbox = document.getElementById('chatbox');
    chatbox.style.display = chatbox.style.display === 'none' ? 'flex' : 'none';
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const chatlogs = document.getElementById("chatlogs");
    const message = input.value.trim();

    if (!message) return;

    // Kullanıcının mesajını göster
    chatlogs.innerHTML += `<div class="user">${message}</div>`;

    // Basit cevaplar
    let response = "Üzgünüm, bunu anlayamadım.";
    if (message.toLowerCase().includes("açık")) {
        response = "Galeri Pazartesi Günleri hariç ,haftanın her günü 12:00 - 20:00 arası açık.";
    } else if (message.toLowerCase().includes("bilet")) {
        response = "etkinlik linki üzerinden ilgili etkinliklere bilet alabilirsiniz.";
    } else if (message.toLowerCase().includes("atölye")) {
        response = "Atölye kayıtları için 'workshop.html' sayfamıza göz atabilirsin.";
    } else if (message.toLowerCase().includes("merhaba")) {
        response = "Merhaba,Size Nasıl yardımcı Olabilirim";
    } else if (message.toLowerCase().includes("günaydın")) {
        response = "Günaydın,Size Nasıl yardımcı Olabilirim";
    } else if (message.toLowerCase().includes("adres")) {
        response = "Bitlisin Tatvan ilçesinde hizmet vermekteyiz.sitemizin altında adres linklerimiz mevcut";
    } else if (message.toLowerCase().includes("iletişim")) {
        response = "+905386188297 numara üzerinden iletişime geçebilirsiniz";
    } else if (message.toLowerCase().includes("workshop")) {
        response = "workshoplar linkinden bilgi alabilir,workshoplara katılabilirsiniz.";
    } else if (message.toLowerCase().includes("kimsin")) {
        response = "Ben Javascript temelli basit bir yapay zekayım bu site için özel tasarlandım.";
    } else if (message.toLowerCase().includes("tasarladı")) {
        response = "Ben Mehmet Corcor Tarafından tasarlandım.";
    } else if (message.toLowerCase().includes("nasılsın")) {
        response = "Bomba gibiyim sen nasılsın.";
    } else if (message.toLowerCase().includes("teşekkür")) {
        response = "Ben Teşekkür Ederim,Çok incesiniz.";
    } else if (message.toLowerCase().includes("bilgi")) {
        response = "Başlık Kısmında ki linkler üzerinden detaylı bilgi alabilirsiniz";
    } else if (message.toLowerCase().includes("fiyat")) {
        response = "Workshop Linki Üzerinden Dilediğiniz Workshopu Görebilir,Bilet Alabilirsiniz.";
    }
     // Cevabı göster
     chatlogs.innerHTML += `<div class="bot">${response}</div>`;
     input.value = "";
     chatlogs.scrollTop = chatlogs.scrollHeight;
}