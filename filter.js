"use strict";

// Global variabel til alle spil
let allGames = [];

// Start app når DOM er loaded
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  // Hent spil data fra JSON
  getGames();

  // Event listeners for filtre
  document.querySelector("#search-input").addEventListener("input", filterGames);
  document.querySelector("#genre-select").addEventListener("change", filterGames);
  document.querySelector("#players-select").addEventListener("change", filterGames);
  document.querySelector("#time-select").addEventListener("change", filterGames);
  document.querySelector("#difficulty-select").addEventListener("change", filterGames);

  // Clear all filters
  document.querySelector("#clear-filters").addEventListener("click", clearAllFilters);
}

// Hent spil fra JSON
async function getGames() {
  try {
    const response = await fetch("spil.json");
    allGames = await response.json();
    displayGames(allGames);
  } catch (error) {
    console.error("Fejl ved hentning af spil:", error);
  }
}

// Filtreringsfunktion
function filterGames() {
  const search = document.querySelector("#search-input").value.toLowerCase();
  const genre = document.querySelector("#genre-select").value;
  const players = document.querySelector("#players-select").value;
  const time = document.querySelector("#time-select").value;
  const difficulty = document.querySelector("#difficulty-select").value;

  const filtered = allGames.filter(game => {
    const matchSearch = game.title.toLowerCase().includes(search);
    const matchGenre = genre === "all" || game.genre === genre;
    const matchPlayers = players === "all" || game.players === players;
    const matchTime = time === "all" || game.time === time;
    const matchDifficulty = difficulty === "all" || game.difficulty == difficulty;

    return matchSearch && matchGenre && matchPlayers && matchTime && matchDifficulty;
  });

  displayGames(filtered);
}

// Ryd alle filtre
function clearAllFilters() {
  document.querySelector("#search-input").value = "";
  document.querySelector("#genre-select").value = "all";
  document.querySelector("#players-select").value = "all";
  document.querySelector("#time-select").value = "all";
  document.querySelector("#difficulty-select").value = "all";

  displayGames(allGames);
}

// Vis spil på siden
function displayGames(games) {
  const list = document.querySelector("#spil-liste");
  list.innerHTML = "";

  if (games.length === 0) {
    list.innerHTML = "<p class='no-results'>Ingen spil matcher dine filtre 😢</p>";
    return;
  }

  for (const game of games) {
    const html = `
      <article class="game-card">
        <h3>${game.title}</h3>
        <p>Genre: ${game.genre}</p>
        <p>Antal personer: ${game.players}</p>
        <p>Tid: ${game.time}</p>
        <p>Sværhedsgrad: ${game.difficulty}</p>
      </article>
    `;
    list.insertAdjacentHTML("beforeend", html);
  }
}
