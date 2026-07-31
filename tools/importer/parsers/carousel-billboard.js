/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-billboard.
 * Base block: carousel
 * Source: https://www.lakepowell.com/ (section .carousel-featured-container:nth-of-type(4))
 * Generated: 2026-07-31
 *
 * Library structure (Carousel): 2 columns, 1 row per slide.
 *   Cell 1: image (mandatory, image only).
 *   Cell 2: text content (title heading, description, CTA).
 *
 * Each slide is a full-bleed billboard photo + overlay card containing a
 * decorative icon, eyebrow category, title, description, and a single CTA.
 * The decorative icon (<span class="ph ...">) is skipped. CTA anchors contain
 * duplicate sr-only spans that must be stripped.
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
  const slides = Array.from(element.querySelectorAll('.carousel-featured-slide, .carousel-featured-slides > li, ul > li'));

  const cells = [];
  slides.forEach((slide) => {
    // Cell 1: image only
    const image = slide.querySelector('.carousel-featured-slide-bg picture, .carousel-featured-slide-bg img, picture, img');

    // Cell 2: text content (eyebrow, title, description, CTA); icon skipped
    const fg = slide.querySelector('.carousel-featured-slide-fg') || slide;
    const contentCell = [];
    const eyebrow = fg.querySelector('.carousel-featured-slide-eyebrow, [class*="eyebrow"]');
    if (eyebrow) contentCell.push(eyebrow);
    const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
    if (title) contentCell.push(title);
    const description = fg.querySelector('.carousel-featured-slide-description');
    if (description) contentCell.push(description);
    fg.querySelectorAll('.carousel-featured-slide-ctas a, .cta a').forEach((a) => {
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-billboard', cells });
  element.replaceWith(block);
}
