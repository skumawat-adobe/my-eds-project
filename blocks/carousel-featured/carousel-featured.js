import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Recompute the position (`data-pos`) of every slide relative to the
 * active one. The active slide expands, following slides show as a
 * peeking rail, and slides before the active one collapse away.
 * @param {Element} block the carousel block
 */
function updatePositions(block) {
  const activeIndex = parseInt(block.dataset.activeSlide, 10) || 0;
  const slides = [...block.querySelectorAll('.carousel-featured-slide')];

  slides.forEach((slide, idx) => {
    if (idx < activeIndex) {
      slide.dataset.pos = 'prev';
    } else if (idx === activeIndex) {
      slide.dataset.pos = 'active';
    } else {
      slide.dataset.pos = `next-${idx - activeIndex - 1}`;
    }
    const isActive = idx === activeIndex;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.querySelectorAll('a').forEach((link) => {
      if (isActive) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
  });

  const liveRegion = block.querySelector('.carousel-featured-live-region');
  if (liveRegion) {
    const active = slides[activeIndex];
    const title = active?.querySelector('.carousel-featured-slide-title');
    liveRegion.textContent = `Slide ${activeIndex + 1} of ${slides.length}${title ? `: ${title.textContent}` : ''}`;
  }
}

/**
 * Move to a given slide index, clamped to the available slides.
 * @param {Element} block the carousel block
 * @param {number} index target slide index
 */
function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-featured-slide');
  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  block.dataset.activeSlide = clamped;
  updatePositions(block);
}

/**
 * Build a single slide from an authored row.
 * Row shape: [ image cell ][ text cell (eyebrow <p> + title heading) ]
 * @param {Element} row the authored row
 * @param {number} index the slide index
 * @returns {Element} the decorated <li> slide
 */
function createSlide(row, index) {
  const cells = [...row.children];
  const imageCell = cells[0];
  const textCell = cells[1];

  const slide = document.createElement('li');
  slide.className = 'carousel-featured-slide';
  slide.dataset.slideIndex = index;

  // Background image
  const bg = document.createElement('div');
  bg.className = 'carousel-featured-slide-bg';
  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) bg.append(picture);
  }

  // Foreground overlay (eyebrow + title)
  const fg = document.createElement('div');
  fg.className = 'carousel-featured-slide-fg';

  let href = '#';
  if (textCell) {
    const eyebrow = textCell.querySelector('p');
    if (eyebrow) {
      eyebrow.classList.add('carousel-featured-slide-eyebrow');
      fg.append(eyebrow);
    }
    const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      heading.classList.add('carousel-featured-slide-title');
      const anchor = heading.querySelector('a');
      if (anchor) {
        href = anchor.getAttribute('href');
        // unwrap the anchor: the whole tile becomes the link
        anchor.replaceWith(...anchor.childNodes);
      }
      fg.append(heading);
    }
  }

  // Whole-tile link
  const link = document.createElement('a');
  link.className = 'carousel-featured-slide-link';
  link.href = href;
  const title = fg.querySelector('.carousel-featured-slide-title');
  if (title) link.setAttribute('aria-label', title.textContent.trim());
  link.append(bg, fg);
  slide.append(link);

  return slide;
}

/**
 * loads and decorates the featured carousel
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.className = 'carousel-featured-slides-container';

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-featured-slides';

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);

  const isSingleSlide = rows.length < 2;
  if (!isSingleSlide) {
    const nav = document.createElement('div');
    nav.className = 'carousel-featured-navigation-buttons';
    nav.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    nav.querySelector('.slide-prev').addEventListener('click', () => {
      showSlide(block, (parseInt(block.dataset.activeSlide, 10) || 0) - 1);
    });
    nav.querySelector('.slide-next').addEventListener('click', () => {
      showSlide(block, (parseInt(block.dataset.activeSlide, 10) || 0) + 1);
    });
    container.append(nav);
  }

  block.append(container);

  const liveRegion = document.createElement('div');
  liveRegion.className = 'carousel-featured-live-region sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  block.append(liveRegion);

  block.dataset.activeSlide = 0;
  updatePositions(block);
}
