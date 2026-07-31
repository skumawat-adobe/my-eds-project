/**
 * hero-video — full-bleed hero with an optional background video/photo,
 * a gradient overlay, an eyebrow line and a large headline.
 *
 * Authored structure (per row):
 *   - a media-only row (a cell containing just a <picture> or <video>) becomes
 *     the background layer;
 *   - the remaining row(s) hold the eyebrow/headline text shown over the media.
 * When no media row is authored, the block falls back to a solid navy
 * background with the gradient overlay (CSS handles this).
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  const mediaRow = rows.find((row) => {
    const media = row.querySelector('picture, video');
    return media && !row.querySelector('h1, h2, h3, h4, h5, h6');
  });

  if (mediaRow) {
    mediaRow.classList.add('hero-video-bg');
  } else {
    block.classList.add('no-media');
  }
}
