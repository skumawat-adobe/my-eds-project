/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: lakepowell site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only the
 * page-level authorable content of <main>. Every selector below was
 * verified against migration-work/cleaned.html for the Lake Powell
 * homepage (https://www.lakepowell.com/) — none are guessed.
 *
 * Source is itself an EDS-rendered page, so the non-authorable shell
 * lives OUTSIDE <main>: <header>/<nav>, <footer>, the OneTrust cookie
 * SDK, the search block/overlay, the modal-from-metadata block, and
 * tracking iframes.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent SDK — blocks/overlays the page. Verified in cleaned.html:
    //   <div id="onetrust-consent-sdk"> ... #onetrust-banner-sdk / #onetrust-pc-sdk
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Verified in cleaned.html:
    //   <header class="header-wrapper"> ... <nav id="nav"> ... </header>  (lines 2-1655)
    //   <footer ...>                                                       (lines 2637-2863)
    //   <div class="section search-container"> ... <div class="search minimal block">  (2841)
    //   <div class="search-overlay">                                       (2866)
    //   <div class="section modal-from-metadata-container">                (2855)
    //   <iframe title="Adobe ID Syncing iFrame" ...> and <iframe class="ot-text-resize">
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.search-overlay',
      '.section.search-container',
      '.section.modal-from-metadata-container',
      'iframe',
    ]);
  }
}
