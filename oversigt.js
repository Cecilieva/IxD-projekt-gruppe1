"use strict";

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

// Karussel funktionalitet
const carousel = document.querySelector("#carousel");
const prevBtn = document.querySelector("#carousel-prev");
const nextBtn = document.querySelector("#carousel-next");
const slides = document.querySelectorAll(".carousel-slide");

let currentSlide = 0;
const totalSlides = slides.length;

// Automatisk scroll hver 3. sekund
let autoSlideInterval = setInterval(nextSlide, 3000);

function updateCarousel() {
  const slideWidth = carousel.offsetWidth;
  carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  
  // Fjern active class fra alle slides
  slides.forEach(slide => slide.classList.remove('active'));
  
  // Tilføj active class til current slide
  if (slides[currentSlide]) {
    slides[currentSlide].classList.add('active');
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

// Initialiser første slide som active
if (slides.length > 0) {
  slides[0].classList.add('active');
}

// Klik på næste knap
if (nextBtn) {
  nextBtn.addEventListener("click", function() {
    clearInterval(autoSlideInterval); // Stop auto-scroll når man klikker
    nextSlide();
    autoSlideInterval = setInterval(nextSlide, 3000); // Genstart auto-scroll
  });
}

// Klik på forrige knap
if (prevBtn) {
  prevBtn.addEventListener("click", function() {
    clearInterval(autoSlideInterval);
    prevSlide();
    autoSlideInterval = setInterval(nextSlide, 3000);
  });
}

// Opdater karussel ved window resize
window.addEventListener("resize", updateCarousel);

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
