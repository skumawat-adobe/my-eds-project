/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta.
 * Base block: hero
 * Source: https://www.lakepowell.com/ (section .center-content.cta-container)
 * Generated: 2026-07-31
 *
 * Library structure (Hero): 1 column, up to 3 rows.
 *   Row 2 (optional): background image.
 *   Row 3: title (heading), subheading, CTA.
 *
 * This is a centered CTA banner: heading + a single button, no background image.
 */

// Build a clean anchor: visible text only (drop sr-only helper spans) and no
// redundant title/aria attributes, so markdown link labels are not duplicated.
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
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');
  const subheading = element.querySelector('.default-content-wrapper p');
  const cta = cleanLink(element.querySelector('.cta-wrapper a, .cta a.button, .cta a, a.button'), document);

  // Empty-block guard
  if (!heading && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
