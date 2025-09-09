const track = document.getElementById('carouselTrack');
const viewport = document.getElementById('carouselViewport');
const leftBtn = document.querySelector('.carousel-button.left');
const rightBtn = document.querySelector('.carousel-button.right');

const scrollStep = 180;

leftBtn.addEventListener('click', () => {
  viewport.scrollLeft -= scrollStep;
});

rightBtn.addEventListener('click', () => {
  viewport.scrollLeft += scrollStep;
});