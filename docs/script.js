const apiUrl = "https://rabattis-backend.onrender.com/api/koder";

let allKoder = [];

async function fetchKoder() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    allKoder = data.koder || [];
    renderFilters(allKoder);
    renderCards(allKoder);
  } catch (e) {
    console.error("Fel vid hämtning:", e);
  }
}

function renderFilters(koder) {
  const storeSelect = document.getElementById("storeFilter");
  const categorySelect = document.getElementById("categoryFilter");

  const stores = [...new Set(koder.map(k => k.butiksnamn || k.store || "Okänd butik"))];
  const categories = [...new Set(koder.map(k => k.kategori || "Okänd kategori"))];

  for (const s of stores) {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    storeSelect.appendChild(opt);
  }

  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  }
}

function renderCards(koder) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  if (koder.length === 0) {
    container.innerHTML = "<p>Inga rabattkoder hittades.</p>";
    return;
  }

  for (const kod of koder) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${kod.kod || kod.code || "Ingen kod"}</h2>
      <p><strong>Butik:</strong> <a href="${kod.länk || '#'}" target="_blank">${kod.butiksnamn || kod.store || "Okänd"}</a></p>
      <p><strong>Beskrivning:</strong> ${kod.beskrivning || kod.description || ""}</p>
      <p><strong>Kategori:</strong> ${kod.kategori || "Okänd"}</p>
      <p><strong>Utgångsdatum:</strong> ${kod.utgångsdatum || kod.expires || "Okänt"}</p>
    `;
    container.appendChild(card);
  }
}

function applyFilters() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const selectedStore = document.getElementById("storeFilter").value;
  const selectedCategory = document.getElementById("categoryFilter").value;

  let filtered = allKoder;

  if (query) {
    filtered = filtered.filter(k =>
      (k.kod || k.code || "").toLowerCase().includes(query) ||
      (k.butiksnamn || k.store || "").toLowerCase().includes(query) ||
      (k.beskrivning || k.description || "").toLowerCase().includes(query)
    );
  }

  if (selectedStore) {
    filtered = filtered.filter(k => (k.butiksnamn || k.store) === selectedStore);
  }

  if (selectedCategory) {
    filtered = filtered.filter(k => k.kategori === selectedCategory);
  }

  renderCards(filtered);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("storeFilter").addEventListener("change", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);

// Start
fetchKoder();
