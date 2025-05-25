// script.js
fetch("https://rabattis-backend.onrender.com/api/koder")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("koder");
    data.koder.forEach(kod => {
      const el = document.createElement("div");
      el.innerHTML = `<strong>${kod.butik}</strong>: ${kod.kod} – ${kod.beskrivning}`;
      container.appendChild(el);
    });
  })
  .catch(error => {
    console.error("Fel vid hämtning av koder:", error);
  });
