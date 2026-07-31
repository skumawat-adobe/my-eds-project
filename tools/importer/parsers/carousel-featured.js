/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-featured.
 * Base block: carousel
 * Source: https://www.lakepowell.com/ (section .carousel-featured-container:nth-of-type(3))
 * Generated: 2026-07-31
 *
 * Library structure (Carousel): 2 columns, 1 row per slide.
 *   Cell 1: image (mandatory, image only).
 *   Cell 2: text content (title heading, description, CTA).
 *
 * Each slide is a linked image tile: bg image + eyebrow category + h2 title.
 * The whole slide links somewhere; the link is preserved by wrapping the title
 * text in an anchor so the destination is not lost. The section intro heading
 * ("Our Most Popular Bookings") is section-level default content and excluded.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.carousel-featured-slide, .carousel-featured-slides > li, ul > li'));

  const cells = [];
  slides.forEach((slide) => {
    // Cell 1: image only
    const image = slide.querySelector('.carousel-featured-slide-bg picture, .carousel-featured-slide-bg img, picture, img');

    // Cell 2: text content (eyebrow, title)
    const fg = slide.querySelector('.carousel-featured-slide-fg') || slide;
    const contentCell = [];
    const eyebrow = fg.querySelector('.carousel-featured-slide-eyebrow, [class*="eyebrow"]');
    if (eyebrow) contentCell.push(eyebrow);

    const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
    const slideHref = slide.querySelector('a[href]') ? slide.querySelector('a[href]').getAttribute('href') : null;
    if (title) {
      if (slideHref) {
        // Preserve the slide's link destination on the title text.
        const link = document.createElement('a');
        link.setAttribute('href', slideHref);
        link.textContent = title.textContent.replace(/\s+/g, ' ').trim();
        const heading = document.createElement(title.tagName.toLowerCase());
        heading.appendChild(link);
        contentCell.push(heading);
      } else {
        contentCell.push(title);
      }
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-featured', cells });
  element.replaceWith(block);
}
