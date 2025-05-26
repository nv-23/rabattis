async function fetchKoder() {
  try {
    const res = await fetch("https://rabattis-backend.onrender.com/api/koder");
    const data = await res.json();
    return data.koder || [];
  } catch (error) {
    console.error("Fel vid hämtning:", error);
    return [];
  }
}

function renderTable(koder) {
  const tbody = document.querySelector("#codesTable tbody");
  tbody.innerHTML = "";

  if (koder.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Inga rabattkoder hittades.</td></tr>`;
    return;
  }

  for (const kod of koder) {
    const tr = document.createElement("tr");
    const butik = kod.butiksnamn || kod.store || "";
    const länk = kod.länk || kod.link || "";
    const kategori = kod.kategori || "";

    tr.innerHTML = `
      <td data-label="Kod">${kod.kod || kod.code || ""}</td>
      <td data-label="Butik">
        ${länk ? `<a href="${länk}" target="_blank">${butik}</a>` : butik}
      </td>
      <td data-label="Beskrivning">${kod.beskrivning || kod.description || ""}</td>
      <td data-label="Utgångsdatum">${kod.utgångsdatum || kod.expires || ""}</td>
    `;

    tr.dataset.kategori = kategori.toLowerCase();
    tbody.appendChild(tr);
  }
}

function filterKoder(koder, query, kategori) {
  return koder.filter(k => {
    const kodtext = (k.kod || "").toLowerCase();
    const butik = (k.butiksnamn || "").toLowerCase();
    const beskrivning = (k.beskrivning || "").toLowerCase();
    const matchKategori = kategori ? (k.kategori || "").toLowerCase() === kategori : true;

    return (
      (kodtext.includes(query) || butik.includes(query) || beskrivning.includes(query)) &&
      matchKategori
    );
  });
}

function populateCategories(koder) {
  const select = document.getElementById("categoryFilter");
  const kategorier = new Set();

  koder.forEach(kod => {
    if (kod.kategori) {
      kategorier.add(kod.kategori);
    }
  });

  for (const kat of kategorier) {
    const option = document.createElement("option");
    option.value = kat.toLowerCase();
    option.textContent = kat;
    select.appendChild(option);
  }
}

document.getElementById("searchInput").addEventListener("input", async () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("categoryFilter").value;
  const allKoder = await fetchKoder();
  const filtered = filterKoder(allKoder, query, kategori);
  renderTable(filtered);
});

document.getElementById("categoryFilter").addEventListener("change", async () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("categoryFilter").value;
  const allKoder = await fetchKoder();
  const filtered = filterKoder(allKoder, query, kategori);
  renderTable(filtered);
});

(async () => {
  const koder = await fetchKoder();
  populateCategories(koder);
  renderTable(koder);
})();
