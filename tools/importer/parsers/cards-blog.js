/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-blog.
 * Base block: cards
 * Source: https://www.lakepowell.com/ (section .cards-container.cta-container)
 * Generated: 2026-07-31
 *
 * Library structure (Cards): 2 columns, 1 row per card.
 *   Cell 1: image/icon (mandatory)
 *   Cell 2: text content (category tag, title heading, CTA)
 *
 * The section also carries intro default-content (h2 + p) and a trailing
 * "Discover More" CTA; both are section-level default content handled by the
 * transformer, not part of this block, so they are intentionally excluded.
 */
// Build a clean anchor: visible text only (drop sr-only helper spans) and no
// redundant title/aria attributes, so markdown link labels are not duplicated.
function cleanLink(anchor, document) {
  if (!anchor) return null;
  const clone = anchor.cloneNode(true);
  // Drop screen-reader duplicate spans only (visible label may live in an
  // aria-hidden span, so do not remove aria-hidden elements).
  clone.querySelectorAll('.sr-only').forEach((el) => el.remove());
  let text = clone.textContent.replace(/\s+/g, ' ').trim();
  if (!text) text = (anchor.getAttribute('title') || anchor.getAttribute('aria-label') || '').trim();
  const link = document.createElement('a');
  link.setAttribute('href', anchor.getAttribute('href') || '#');
  link.textContent = text;
  return link;
}

export default function parse(element, { document }) {
  // Each card is a <li> inside the cards block.
  const cards = Array.from(element.querySelectorAll('.cards.block li, .cards-wrapper li, ul > li'));

  const cells = [];
  cards.forEach((card) => {
    // Column 1: image
    const image = card.querySelector('.cards-card-image picture, .cards-card-image img, picture, img');

    // Column 2: text content (category tag, title, CTA)
    const body = card.querySelector('.cards-card-body') || card;
    const contentCell = [];
    const category = body.querySelector(':scope > p:not(.button-container)');
    if (category) contentCell.push(category);
    const title = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) contentCell.push(title);
    const cta = cleanLink(body.querySelector('.cards-cta-group a, .cta a.button, .cta a, a.button'), document);
    if (cta) contentCell.push(cta);

    // Only emit a row if the card has real content
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
