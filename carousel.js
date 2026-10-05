/*
 * Copyright (c) 2026 LANGLITZ Metalle GmbH. All rights reserved.
 */

(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const previousButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const toggleButton = carousel.querySelector('.carousel-toggle');
  const status = carousel.querySelector('.carousel-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = 0;
  let timer = null;
  let manuallyPaused = reducedMotion;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    status.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  function stopRotation() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function startRotation() {
    stopRotation();
    if (manuallyPaused || document.hidden) return;
    timer = window.setInterval(() => showSlide(currentIndex + 1), 6000);
  }

  function move(direction) {
    showSlide(currentIndex + direction);
    startRotation();
  }

  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  toggleButton.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    toggleButton.setAttribute('aria-pressed', String(manuallyPaused));
    toggleButton.textContent = manuallyPaused ? 'Start' : 'Pause';
    toggleButton.setAttribute('aria-label', manuallyPaused ? 'Automatischen Bildwechsel starten' : 'Automatischen Bildwechsel pausieren');
    startRotation();
  });

  carousel.addEventListener('mouseenter', stopRotation);
  carousel.addEventListener('mouseleave', startRotation);
  carousel.addEventListener('focusin', stopRotation);
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) startRotation();
  });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
  document.addEventListener('visibilitychange', startRotation);

  if (reducedMotion) {
    toggleButton.textContent = 'Start';
    toggleButton.setAttribute('aria-pressed', 'true');
    toggleButton.setAttribute('aria-label', 'Automatischen Bildwechsel starten');
  }

  showSlide(0);
  startRotation();
})();
