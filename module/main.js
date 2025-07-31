'use strict'

import {getFotosSenai} from "./api.js";

const carousel = document.getElementById('carousel');
const dotsContainer = document.getElementById('dots');
let currentIndex = 0;
let slides = [];

const extractGoogleDriveId = (url) => {
  const match = url.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
};

const createSlide = (foto) => {
  const slide = document.createElement('div');
  slide.classList.add('slide');

  const img = document.createElement('img');
  img.src = extractGoogleDriveId(foto.imagem);

  const caption = document.createElement('div');
  caption.classList.add('caption');
  caption.textContent = foto.legenda || "Sem legenda";

  slide.appendChild(img);
  slide.appendChild(caption);

  return slide;
};

const createDot = (index) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateCarousel();
  });
  return dot;
};

const updateCarousel = () => {
  const offset = -currentIndex * 100;
  carousel.style.transform = `translateX(${offset}%)`;

  [...dotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
};

const startAutoSlide = () => {
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 4000);
};

const initCarousel = async () => {
  const fotos = await getFotosSenai();
  console.log("Fotos recebidas:", fotos); 
  slides = fotos;

  fotos.forEach((foto, index) => {
    carousel.appendChild(createSlide(foto));
    dotsContainer.appendChild(createDot(index));
  });

  updateCarousel();
  startAutoSlide();
};

initCarousel();
