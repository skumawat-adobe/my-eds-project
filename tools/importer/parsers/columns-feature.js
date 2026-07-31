/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns
 * Source: https://www.lakepowell.com/ (section .layout-columns)
 * Generated: 2026-07-31
 *
 * Library structure (Columns): flexible columns/rows. Column count is derived
 * from the natural visual grouping of the source. Each cell may contain text,
 * images, or inline elements (no nested blocks).
 *
 * Source layout is a single row of 4 balanced columns:
 *   text (WAYS TO PLAY + heading + copy + READ MORE)
 *   image
 *   image
 *   text (ITINERARIES + heading + copy + READ MORE)
 * Every content row must contain the same number of cells as this first row.
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

function buildColumnCell(column, document) {
  const cell = [];
  // Text content (paragraphs, headings) in document order.
  const contentWrapper = column.querySelector('.default-content-wrapper');
  if (contentWrapper) {
    Array.from(contentWrapper.children).forEach((child) => cell.push(child));
  }
  // Image content — only from a dedicated image wrapper so decorative/icon
  // images injected elsewhere in a text column are not pulled in.
  column.querySelectorAll('.image-wrapper picture, .image.block picture').forEach((pic) => {
    cell.push(pic);
  });
  // CTA link, cleaned.
  const cta = cleanLink(column.querySelector('.cta-wrapper a, .cta a.button, .cta a, a.button'), document);
  if (cta) cell.push(cta);
  return cell;
}

export default function parse(element, { document }) {
  // Each direct layout column becomes a column cell.
  const columns = Array.from(element.querySelectorAll('.layout-column'));

  const cells = [];
  if (columns.length) {
    const row = columns.map((col) => {
      const cell = buildColumnCell(col, document);
      return cell.length ? cell : '';
    });
    cells.push(row);
  }

  // Empty-block guard
  if (!cells.length || !cells[0].some((c) => c && c.length)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
