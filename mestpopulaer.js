"use strict";

// Indlæs og vis alle spil fra JSON
const gameGrid = document.getElementById("game-grid");
const DATA_URL = "./spil.json";

let games = [];

// Indlæs spil fra JSON
async function loadGames() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    games = await res.json();
    
    // Sorter efter rating (højest til lavest)
    games.sort((a, b) => b.rating - a.rating);
    
    renderGames(games);
  } catch (e) {
    console.error("Fejl ved indlæsning:", e);
    gameGrid.innerHTML = `<p>Kunne ikke hente spil.</p>`;
  }
}

// Render alle spil som i filter.html
function renderGames(items) {
  gameGrid.innerHTML = items.map(game => `
    <article class="game-card" tabindex="0" data-id="${game.id}">
      <img src="${game.image}" alt="${game.title}" class="game-poster">
      <div class="game-info">
        <h3>${game.title} <span class="game-year">(${game.playtime} min)</span></h3>
        <p class="game-genre">${game.genre}</p>
        <p class="game-rating">⭐ ${game.rating}</p>
        <p><strong>Location:</strong> ${game.location}</p>
      </div>
    </article>
  `).join("");
  
  // Tilføj click events til cards
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
      const gameId = this.getAttribute('data-id');
      const game = games.find(g => g.id == gameId);
      if (game) {
        showGameDetails(game);
      }
    });
  });
}

// Vis spil detaljer
function showGameDetails(game) {
  alert(`${game.title}\n\nGenre: ${game.genre}\nSpilletid: ${game.playtime} min\nRating: ${game.rating}\nSpillere: ${game.players.min}-${game.players.max}\n\n${game.rules}`);
}

// Søgefunktionalitet
const searchBtn = document.querySelector("#btn-search");
const searchContainer = document.querySelector("#search-container");
const searchInput = document.querySelector("#search-input");

// Toggle søgebaren når man klikker på søgeikonet
if (searchBtn) {
  searchBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    if (searchContainer.style.display === "none" || searchContainer.style.display === "") {
      searchContainer.style.display = "block";
      setTimeout(() => searchInput.focus(), 80);
    } else {
      searchContainer.style.display = "none";
    }
  });
}

// Luk søgebaren når man klikker udenfor
document.addEventListener("click", function(event) {
  const inside = event.target.closest('#btn-search') || event.target.closest('#search-container');
  if (!inside && searchContainer) {
    searchContainer.style.display = "none";
  }
});

// Luk søgebaren ved Escape tast
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && searchContainer && searchContainer.style.display !== "none") {
    searchContainer.style.display = "none";
  }
});

// Menu overlay funktionalitet
const menuBtn = document.querySelector("#btn-menu");
const menuOverlay = document.querySelector("#menu-overlay");
const closeMenuBtn = document.querySelector("#close-menu");

// Åbn menu overlay
if (menuBtn) {
  menuBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    if (menuOverlay) {
      menuOverlay.classList.add("show");
    }
  });
}

// Luk menu overlay med X knap
if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", function() {
    menuOverlay.classList.remove("show");
  });
}

// Luk menu overlay når man klikker på baggrunden
if (menuOverlay) {
  menuOverlay.addEventListener("click", function(event) {
    if (event.target === menuOverlay) {
      menuOverlay.classList.remove("show");
    }
  });
}

// Luk menu overlay ved Escape tast
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && menuOverlay && menuOverlay.classList.contains("show")) {
    menuOverlay.classList.remove("show");
  }
});

// Sortering overlay funktionalitet
const pileBtn = document.querySelector("#btn-pile");
const sorteringOverlay = document.querySelector("#sortering-overlay");
const closeSorteringBtn = document.querySelector("#close-sortering");

// Åbn sortering overlay
if (pileBtn) {
  pileBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    if (sorteringOverlay) {
      sorteringOverlay.classList.add("show");
    }
  });
}

// Luk sortering overlay med X knap
if (closeSorteringBtn) {
  closeSorteringBtn.addEventListener("click", function() {
    sorteringOverlay.classList.remove("show");
  });
}

// Luk sortering overlay når man klikker udenfor
document.addEventListener("click", function(event) {
  const inside = event.target.closest('#btn-pile') || event.target.closest('#sortering-overlay');
  if (!inside && sorteringOverlay && sorteringOverlay.classList.contains("show")) {
    sorteringOverlay.classList.remove("show");
  }
});

// Luk sortering overlay ved Escape tast
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && sorteringOverlay && sorteringOverlay.classList.contains("show")) {
    sorteringOverlay.classList.remove("show");
  }
});

// Start app
loadGames();