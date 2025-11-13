"use strict";

// Indlæs spil fra JSON
let allGames = [];

async function loadGames() {
  try {
    const response = await fetch('./spil.json');
    allGames = await response.json();
    renderGameGrids();
  } catch (error) {
    console.error('Fejl ved indlæsning af spil:', error);
  }
}

function renderGameGrids() {
  // Familie spil
  const familieGrid = document.querySelector('#familie-spil-grid');
  const familieGames = allGames.filter(game => game.genre === 'Familie');
  if (familieGrid) {
    familieGrid.innerHTML = familieGames.map(game => `
      <a href="#" class="game-card" data-id="${game.id}">
        <div class="game-card-img-wrapper">
          <img src="${game.image}" alt="${game.title}">
          <span class="availability-badge ${game.available ? 'available' : 'unavailable'}">
            ${game.available ? '✓' : '✕'}
          </span>
        </div>
        <span class="card-title">${game.title}</span>
      </a>
    `).join('');
  }
  
  // Brætspil
  const braetspilGrid = document.querySelector('#braetspil-grid');
  const braetspilGames = allGames.filter(game => game.genre === 'Brætspil' || game.genre === 'Strategi');
  if (braetspilGrid) {
    braetspilGrid.innerHTML = braetspilGames.map(game => `
      <a href="#" class="game-card" data-id="${game.id}">
        <div class="game-card-img-wrapper">
          <img src="${game.image}" alt="${game.title}">
          <span class="availability-badge ${game.available ? 'available' : 'unavailable'}">
            ${game.available ? '✓' : '✕'}
          </span>
        </div>
        <span class="card-title">${game.title}</span>
      </a>
    `).join('');
  }
  
  // Tilføj click events
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const gameId = this.getAttribute('data-id');
      const game = allGames.find(g => g.id == gameId);
      if (game) {
        showGameOverlay(game);
      }
    });
  });
}

function showGameOverlay(game) {
  const kortOverlay = document.querySelector("#kort-overlay");
  const kortImage = document.querySelector("#kort-image");
  
  if (kortImage && kortOverlay) {
    kortImage.src = game.image;
    document.querySelector("#kort-title").textContent = game.title;
    document.querySelector("#kort-genre").textContent = game.genre;
    document.querySelector("#kort-rating").textContent = game.rating;
    document.querySelector("#kort-players").textContent = game.players;
    document.querySelector("#kort-playtime").textContent = game.playtime;
    document.querySelector("#kort-description").textContent = game.description;
    kortOverlay.classList.add("show");
  }
}

// Start indlæsning
loadGames();

function goToPage(location) {
  // Her sender vi bare brugeren videre til oversigten
  window.location.href = "filter.html";
}

// Søgefunktionalitet
const searchBtn = document.querySelector("#btn-search");
const searchContainer = document.querySelector("#search-container");
const searchInput = document.querySelector("#search-input");

console.log("searchBtn:", searchBtn);
console.log("searchContainer:", searchContainer);
console.log("searchInput:", searchInput);

// Toggle søgebaren når man klikker på søgeikonet
if (searchBtn) {
  searchBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    console.log("Søgeknap klikket!");
    
    if (searchContainer.style.display === "none" || searchContainer.style.display === "") {
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
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;
      console.log('Søg efter:', q);
      // TODO: Kald din filtreringsfunktion her
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

// Featured karussel funktionalitet
const featuredTrack = document.querySelector("#featured-track");
const featuredPrevBtn = document.querySelector("#featured-prev");
const featuredNextBtn = document.querySelector("#featured-next");
const featuredSlides = document.querySelectorAll(".featured-slide");
const dotsContainer = document.querySelector("#featured-dots");

let currentFeaturedSlide = 0;
const totalFeaturedSlides = featuredSlides.length;

// Opret dots
if (dotsContainer) {
  for (let i = 0; i < totalFeaturedSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

const dots = document.querySelectorAll('.dot');

// Automatisk scroll hver 4. sekund
let autoFeaturedInterval = setInterval(nextFeaturedSlide, 4000);

function updateFeaturedCarousel() {
  if (featuredTrack) {
    const slideWidth = featuredTrack.offsetWidth;
    featuredTrack.style.transform = `translateX(-${currentFeaturedSlide * slideWidth}px)`;
    
    // Opdater dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentFeaturedSlide);
    });
  }
}

function nextFeaturedSlide() {
  currentFeaturedSlide = (currentFeaturedSlide + 1) % totalFeaturedSlides;
  updateFeaturedCarousel();
}

function prevFeaturedSlide() {
  currentFeaturedSlide = (currentFeaturedSlide - 1 + totalFeaturedSlides) % totalFeaturedSlides;
  updateFeaturedCarousel();
}

function goToSlide(index) {
  currentFeaturedSlide = index;
  updateFeaturedCarousel();
  clearInterval(autoFeaturedInterval);
  autoFeaturedInterval = setInterval(nextFeaturedSlide, 4000);
}

// Klik på næste knap
if (featuredNextBtn) {
  featuredNextBtn.addEventListener("click", function() {
    clearInterval(autoFeaturedInterval);
    nextFeaturedSlide();
    autoFeaturedInterval = setInterval(nextFeaturedSlide, 4000);
  });
}

// Klik på forrige knap
if (featuredPrevBtn) {
  featuredPrevBtn.addEventListener("click", function() {
    clearInterval(autoFeaturedInterval);
    prevFeaturedSlide();
    autoFeaturedInterval = setInterval(nextFeaturedSlide, 4000);
  });
}

// Opdater karussel ved window resize
window.addEventListener("resize", updateFeaturedCarousel);

// Menu overlay funktionalitet
const menuBtn = document.querySelector("#btn-menu");
const menuOverlay = document.querySelector("#menu-overlay");
const closeMenuBtn = document.querySelector("#close-menu");

// Åbn menu overlay
if (menuBtn) {
  menuBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    console.log("Menu knap klikket!");
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
    console.log("Pileknap klikket!");
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

// Kort overlay funktionalitet
const kortOverlay = document.querySelector("#kort-overlay");
const kortImage = document.querySelector("#kort-image");
const closeKortBtn = document.querySelector("#close-kort");
const gameCards = document.querySelectorAll(".game-card");

// Åbn kort overlay når man klikker på et game-card
gameCards.forEach(card => {
  card.addEventListener("click", function(event) {
    event.preventDefault();
    const kortUrl = this.getAttribute("href");
    
    if (kortImage && kortOverlay) {
      kortImage.src = kortUrl;
      kortOverlay.classList.add("show");
    }
  });
});

// Luk kort overlay med X knap
if (closeKortBtn) {
  closeKortBtn.addEventListener("click", function() {
    kortOverlay.classList.remove("show");
  });
}

// Luk kort overlay når man klikker på baggrunden
if (kortOverlay) {
  kortOverlay.addEventListener("click", function(event) {
    if (event.target === kortOverlay) {
      kortOverlay.classList.remove("show");
    }
  });
}

// Luk kort overlay ved Escape tast
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && kortOverlay && kortOverlay.classList.contains("show")) {
    kortOverlay.classList.remove("show");
  }
});
