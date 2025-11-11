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

let currentSlide = 0;
const totalSlides = 3; // Matador, UNO, Ludo

// Automatisk scroll hver 3. sekund
let autoSlideInterval = setInterval(nextSlide, 3000);

function updateCarousel() {
  const slideWidth = carousel.offsetWidth;
  carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
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
