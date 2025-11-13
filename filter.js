"use strict";

document.addEventListener("DOMContentLoaded", initApp);

let allGames = [];

async function initApp() {
  await getGames();
  document
    .querySelector("#genre-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#players-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#time-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#level-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#search-input")
    .addEventListener("input", filterGames);
  document
    .querySelector("#clear-filters")
    .addEventListener("click", clearAllFilters);
  document
    .querySelector("#anvend")
    .addEventListener("click", filterGames);
  document.querySelector("#close-dialog").addEventListener("click", () => {
    document.querySelector("#game-dialog").close();
  });
}

async function getGames() {
  const response = await fetch("spil.json"); // Lokalt JSON
  allGames = await response.json();
  populateGenreDropdown();
  displayGames(allGames);
}

function populateGenreDropdown() {
  const genreSelect = document.querySelector("#genre-select");
  const genres = new Set(allGames.map((game) => game.genre));
  genreSelect.innerHTML = `<option value="all">Alle genrer</option>`;
  [...genres].sort().forEach((genre) => {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`
    );
  });
}

function displayGames(games) {
  const list = document.querySelector("#game-list");
  list.innerHTML = "";

  if (games.length === 0) {
    list.innerHTML = `<p class="no-results">Ingen spil matchede dine filtre 😢</p>`;
    return;
  }

  games.forEach((game) => {
    const html = `
      <article class="movie-card" tabindex="0">
        <img src="${game.image}" alt="${game.title}" class="movie-poster">
        <div class="movie-info">
          <h3>${game.title} <span class="movie-year">(${game.playtime} min)</span></h3>
          <p class="movie-genre">${game.genre}</p>
          <p class="movie-rating">⭐ ${game.rating}</p>
          <p><strong>Location:</strong> ${game.location}</p>
        </div>
      </article>
    `;
    list.insertAdjacentHTML("beforeend", html);

    const newCard = list.lastElementChild;
    newCard.addEventListener("click", () => showGameModal(game));
    newCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") showGameModal(game);
    });
  });
}

function showGameModal(game) {
  document.querySelector("#dialog-content").innerHTML = `
    <img src="${game.image}" alt="${game.title}" class="movie-poster">
    <div class="dialog-details">
      <h2>${game.title}</h2>
      <p><strong>Genre:</strong> ${game.genre}</p>
      <p><strong>Spilletid:</strong> ${game.playtime} min</p>
      <p><strong>Rating:</strong> ⭐ ${game.rating}</p>
      <p><strong>Antal spillere:</strong> ${game.players.min} - ${game.players.max}</p>
      <p><strong>Regler:</strong> ${game.rules}</p>
    </div>
  `;
  document.querySelector("#game-dialog").showModal();
}

function clearAllFilters() {
  document.querySelector("#search-input").value = "";
  document.querySelector("#genre-select").value = "all";
  document.querySelector("#players-select").value = "all";
  document.querySelector("#time-select").value = "all";
  document.querySelector("#level-select").value = "all";
  filterGames();
}

function filterGames() {
  const search = document.querySelector("#search-input").value.toLowerCase();
  const genre = document.querySelector("#genre-select").value;
  const playersFilter = document.querySelector("#players-select").value;
  const timeFilter = document.querySelector("#time-select").value;
  const levelFilter = document.querySelector("#level-select").value;

  let filtered = allGames;

  // Søgning
  if (search)
    filtered = filtered.filter((g) => g.title.toLowerCase().includes(search));
  
  // Genre filter
  if (genre !== "all") 
    filtered = filtered.filter((g) => g.genre === genre);

  // Antal spillere filter
  if (playersFilter !== "all") {
    filtered = filtered.filter((g) => {
      const min = g.players.min;
      const max = g.players.max;
      
      if (playersFilter === "1-2") return min <= 2 && max >= 1;
      if (playersFilter === "3-4") return min <= 4 && max >= 3;
      if (playersFilter === "5+") return max >= 5;
      return true;
    });
  }

  // Spilletid filter
  if (timeFilter !== "all") {
    filtered = filtered.filter((g) => {
      const time = g.playtime;
      
      if (timeFilter === "0-30") return time <= 30;
      if (timeFilter === "30-60") return time > 30 && time <= 60;
      if (timeFilter === "60-90") return time > 60 && time <= 90;
      if (timeFilter === "90+") return time > 90;
      return true;
    });
  }

  // Sværhedsgrad filter
  if (levelFilter !== "all") {
    filtered = filtered.filter((g) => g.difficulty === levelFilter);
  }

  displayGames(filtered);
}

// Søgefunktionalitet
const searchBtn = document.querySelector("#btn-search");
const searchContainer = document.querySelector("#search-container");
const searchInput = document.querySelector("#search-input-header");

console.log("searchBtn:", searchBtn);
console.log("searchContainer:", searchContainer);
console.log("searchInput:", searchInput);

// Toggle søgebaren når man klikker på søgeikonet
if (searchBtn) {
  searchBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    console.log("Søgeknap klikket!");

    if (
      searchContainer.style.display === "none" ||
      searchContainer.style.display === ""
    ) {
      searchContainer.style.display = "block";
      setTimeout(() => searchInput.focus(), 80);
      console.log("Søgebar vist");
    } else {
      searchContainer.style.display = "none";
      console.log("Søgebar skjult");
    }
  });
}

// Søg ved Enter
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;

      const results = allGames.filter((g) => g.title.toLowerCase().includes(q));
      displayGames(results);
    }
  });
}

// Luk søgebaren når man klikker udenfor
document.addEventListener("click", function (event) {
  const inside =
    event.target.closest("#btn-search") ||
    event.target.closest("#search-container");
  if (!inside && searchContainer) {
    searchContainer.style.display = "none";
  }
});

// Luk søgebaren ved Escape tast
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    searchContainer &&
    searchContainer.style.display !== "none"
  ) {
    searchContainer.style.display = "none";
  }
});

// Menu overlay funktionalitet
const menuBtn = document.querySelector("#btn-menu");
const menuOverlay = document.querySelector("#menu-overlay");
const closeMenuBtn = document.querySelector("#close-menu");

// Åbn menu overlay
if (menuBtn) {
  menuBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    console.log("Menu knap klikket!");
    if (menuOverlay) {
      menuOverlay.classList.add("show");
    }
  });
}

// Luk menu overlay med X knap
if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", function () {
    menuOverlay.classList.remove("show");
  });
}

// Luk menu overlay når man klikker på baggrunden
if (menuOverlay) {
  menuOverlay.addEventListener("click", function (event) {
    if (event.target === menuOverlay) {
      menuOverlay.classList.remove("show");
    }
  });
}

// Luk menu overlay ved Escape tast
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    menuOverlay &&
    menuOverlay.classList.contains("show")
  ) {
    menuOverlay.classList.remove("show");
  }
});

// Sortering overlay funktionalitet
const pileBtn = document.querySelector("#btn-pile");
const sorteringOverlay = document.querySelector("#sortering-overlay");
const closeSorteringBtn = document.querySelector("#close-sortering");

// Åbn sortering overlay
if (pileBtn) {
  pileBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    console.log("Pileknap klikket!");
    if (sorteringOverlay) {
      sorteringOverlay.classList.add("show");
    }
  });
}

// Luk sortering overlay med X knap
if (closeSorteringBtn) {
  closeSorteringBtn.addEventListener("click", function () {
    sorteringOverlay.classList.remove("show");
  });
}

// Luk sortering overlay når man klikker udenfor
document.addEventListener("click", function (event) {
  const inside =
    event.target.closest("#btn-pile") ||
    event.target.closest("#sortering-overlay");
  if (
    !inside &&
    sorteringOverlay &&
    sorteringOverlay.classList.contains("show")
  ) {
    sorteringOverlay.classList.remove("show");
  }
});

// Luk sortering overlay ved Escape tast
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    sorteringOverlay &&
    sorteringOverlay.classList.contains("show")
  ) {
    sorteringOverlay.classList.remove("show");
  }
});
