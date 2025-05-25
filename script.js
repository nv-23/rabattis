// Byt ut denna till din riktiga backend-url!
const API_URL = "https://rabattis-backend.onrender.com/api/koder";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("koder");
    container.innerHTML = ""; // rensa "Hämtar koder..."
    data.koder.forEach(kod => {
      const box = document.createElement("div");
      box.className = "kod-box";
      box.innerHTML = `
        <h2>${kod.butik}</h2>
        <p><strong>Kod:</strong> ${kod.kod}</p>
        <p>${kod.beskrivning}</p>
        <a href="${kod.url}" target="_blank">Till erbjudande</a>
      `;
      container.appendChild(box);
    });
  })
  .catch(error => {
    document.getElementById("koder").innerHTML = "<p>Kunde inte ladda koder just nu.</p>";
    console.error("Fel vid hämtning:", error);
  });

