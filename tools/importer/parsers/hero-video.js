/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video.
 * Base block: hero
 * Source: https://www.lakepowell.com/ (section .booking-container.has-video-background)
 * Generated: 2026-07-31
 *
 * Library structure (Hero): 1 column, up to 3 rows.
 *   Row 2 (optional): background image.
 *   Row 3: title (heading), subheading, CTA.
 *
 * This hero uses a full-bleed background VIDEO defined by section attributes
 * (data-backgroundvideo / data-videoposter) rather than an <img>, so no
 * background-image row is emitted. Content is the eyebrow line + headline.
 * The booking <select> is an interactive widget, not a hero CTA link, so it is
 * intentionally excluded.
 */
export default function parse(element, { document }) {
  const eyebrow = element.querySelector('.booking-hero-eyebrow, [class*="eyebrow"]');
  const heading = element.querySelector('h1, h2, .booking-hero-title, [class*="title"]');
  const subheading = element.querySelector('.booking-hero-subtitle, [class*="subtitle"]');
  const ctaLinks = Array.from(element.querySelectorAll('.booking-hero-content a, a.button'));

  const cells = [];

  // Optional background image (this variant has none, but support the pattern).
  const bgImage = element.querySelector('.section-video-background img, picture img[class*="background"], img[class*="hero-bg"]');
  if (bgImage) cells.push([bgImage]);

  // Content row (single cell holding all text/CTA elements).
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  // Empty-block guard
  if (!heading && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
