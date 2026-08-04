/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-offers.
 * Base block: carousel
 * Source: https://www.lakepowell.com/ (section .center-content.carousel-cards-container)
 * Generated: 2026-07-31
 *
 * Library structure (Carousel): 2 columns, 1 row per slide.
 *   Cell 1: image (mandatory, image only).
 *   Cell 2: text content (title heading, description, CTAs).
 *
 * Each slide is a promo offer: bg image + eyebrow "SPECIAL OFFER" + title +
 * description + two CTAs (BOOK NOW, LEARN MORE). CTA anchors contain duplicate
 * sr-only spans that must be stripped.
 */

// Build a clean anchor: visible text only (drop sr-only helper spans) so
// markdown link labels are not duplicated.
function cleanLink(anchor, document) {
  if (!anchor) return null;
  const clone = anchor.cloneNode(true);
  clone.querySelectorAll('.sr-only').forEach((el) => el.remove());
  let text = clone.textContent.replace(/\s+/g, ' ').trim();
  if (!text) text = (anchor.getAttribute('title') || anchor.getAttribute('aria-label') || '').trim();
  const link = document.createElement('a');
  link.setAttribute('href', anchor.getAttribute('href') || '#');
  link.textContent = text;
  return link;
}

export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.carousel-cards-slide, .carousel-cards-slides > li, ul > li'));

  const cells = [];
  slides.forEach((slide) => {
    // Cell 1: image only
    const image = slide.querySelector('.carousel-cards-slide-bg picture, .carousel-cards-slide-bg img, picture, img');

    // Cell 2: text content
    const fg = slide.querySelector('.carousel-cards-slide-fg') || slide;
    const contentCell = [];
    const eyebrow = fg.querySelector('.carousel-cards-slide-eyebrow, [class*="eyebrow"]');
    if (eyebrow) contentCell.push(eyebrow);
    const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
    if (title) contentCell.push(title);
    const description = fg.querySelector('.carousel-cards-slide-description');
    if (description) contentCell.push(description);
    fg.querySelectorAll('.carousel-cards-slide-ctas a, .cta a').forEach((a) => {
      const link = cleanLink(a, document);
      if (link) contentCell.push(link);
    });

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-offers', cells });
  element.replaceWith(block);
}
