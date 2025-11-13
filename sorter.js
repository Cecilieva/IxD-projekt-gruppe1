// SPIL: indlæs, sorter (dansk A–Å), og render som kort
// ---------------------------------------------------------------

const LIST = document.getElementById("game-list");
const DATA_URL = "./spil.json"; // samme mappe som sorter.html

const collator = new Intl.Collator("da", {
  usage: "sort",
  sensitivity: "base",
  ignorePunctuation: true,
  numeric: true,
});

let games = [];

// Hjælpefunktioner
function getTitle(g) {
  return (g.title ?? g.navn ?? "").trim();
}

function sortAsc(arr) {
  return [...arr].sort((a, b) => collator.compare(getTitle(a), getTitle(b)));
}
function sortDesc(arr) {
  return [...arr].sort((a, b) => collator.compare(getTitle(b), getTitle(a)));
}

function render(items) {
  if (!LIST) return;
  LIST.innerHTML = items.map(g => `
    <li class="card" style="list-style:none; padding:12px; margin:8px; border-radius:16px; background:#fff; color:#222; box-shadow:0 4px 12px rgba(0,0,0,.1)">
      <img src="${g.image}" alt="${getTitle(g)}" style="width:100%; height:180px; object-fit:cover; border-radius:12px" onerror="this.style.display='none'">
      <div class="title" style="margin-top:10px; font-weight:600">${getTitle(g)}</div>
    </li>
  `).join("");
}

// Hent JSON og vis A–Å fra start
async function load() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    games = await res.json();
    console.log("Loaded games:", games.slice(0, 3));
    render(sortAsc(games));
  } catch (e) {
    console.error("Kunne ikke hente JSON:", e);
    if (LIST) LIST.innerHTML = `<li>Fejl ved indlæsning af spil.</li>`;
  }
}

// Knapper
const btnAsc = document.getElementById("sort-asc");
const btnDesc = document.getElementById("sort-desc");

if (btnAsc) btnAsc.addEventListener("click", () => render(sortAsc(games)));
if (btnDesc) btnDesc.addEventListener("click", () => render(sortDesc(games)));

load();

const searchBtn = document.querySelector("#btn-search");
const searchContainer = document.querySelector("#search-container");
const searchInput = document.querySelector("#search-input");

// Åbn/luk på klik
if (searchBtn && searchContainer) {
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchContainer.classList.toggle("show");
    if (searchContainer.classList.contains("show")) {
      setTimeout(() => searchInput?.focus(), 50);
    }
  });
}

// Luk ved klik udenfor
document.addEventListener("click", (e) => {
  if (!e.target.closest("#search-container") && !e.target.closest("#btn-search")) {
    searchContainer?.classList.remove("show");
  }
});

// Luk ved Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") searchContainer?.classList.remove("show");
});

games.filter(g => g.title.toLowerCase().includes(query))

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      // Hvis feltet er tomt, vis alle spil igen
      render(sortAsc(games));
      return;
    }

    // Filtrer spil der matcher query i titel eller genre
    const filtered = games.filter((g) =>
      g.title.toLowerCase().includes(query) ||
      g.genre.toLowerCase().includes(query)
    );

    render(filtered);
  });
} 