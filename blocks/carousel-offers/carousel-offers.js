import { moveInstrumentation } from '../../scripts/scripts.js';

const placeholders = {
  carousel: 'Carousel',
  carouselSlideControls: 'Carousel Slide Controls',
  previousSlide: 'Previous Slide',
  nextSlide: 'Next Slide',
  showSlide: 'Show Slide',
  of: 'of',
};

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-offers');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-offers-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-offers-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-offers-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));

  // Center-peek layout: bring the active slide to the horizontal center of the
  // scroller (not its left edge) so the previous/next slides peek on each side.
  const scroller = block.querySelector('.carousel-offers-slides');
  const scrollerRect = scroller.getBoundingClientRect();
  const slideRect = activeSlide.getBoundingClientRect();
  const delta = (slideRect.left + slideRect.width / 2)
    - (scrollerRect.left + scrollerRect.width / 2);
  scroller.scrollBy({ top: 0, left: delta, behavior: 'smooth' });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-offers-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  // A high threshold ensures only the fully-visible centred card (not the
  // partially-visible peeking neighbours) is treated as the active slide.
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.75 });
  block.querySelectorAll('.carousel-offers-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-offers-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-offers-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-offers-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  // Classify content-cell children:
  //  - a leading <p> before the heading with no link  -> eyebrow (SPECIAL OFFER)
  //  - a <p> after the heading with no link           -> description
  //  - a <p> whose only content is a link             -> CTA (first = filled)
  const content = slide.querySelector('.carousel-offers-slide-content');
  if (content) {
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    let seenHeading = false;
    let ctaIndex = 0;
    [...content.children].forEach((child) => {
      if (child === heading) { seenHeading = true; return; }
      if (child.tagName !== 'P') return;
      const link = child.querySelector('a');
      if (link && child.textContent.trim() === link.textContent.trim()) {
        child.classList.add('carousel-offers-cta');
        child.classList.add(ctaIndex === 0 ? 'carousel-offers-cta-primary' : 'carousel-offers-cta-text');
        ctaIndex += 1;
      } else if (!seenHeading) {
        child.classList.add('carousel-offers-eyebrow');
      } else {
        child.classList.add('carousel-offers-description');
      }
    });
  }

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-offers-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-offers-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-offers-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  let slideNavButtons;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-offers-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-offers-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-offers-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  if (slideNavButtons) {
    // arrows render below the carousel, centred
    container.append(slideNavButtons);
  }
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
