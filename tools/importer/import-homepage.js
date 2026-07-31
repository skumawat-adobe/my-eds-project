/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBlogParser from './parsers/cards-blog.js';
import carouselBillboardParser from './parsers/carousel-billboard.js';
import carouselFeaturedParser from './parsers/carousel-featured.js';
import carouselOffersParser from './parsers/carousel-offers.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroCtaParser from './parsers/hero-cta.js';
import heroVideoParser from './parsers/hero-video.js';

// TRANSFORMER IMPORTS
import lakepowellCleanupTransformer from './transformers/lakepowell-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'cards-blog': cardsBlogParser,
  'carousel-billboard': carouselBillboardParser,
  'carousel-featured': carouselFeaturedParser,
  'carousel-offers': carouselOffersParser,
  'columns-feature': columnsFeatureParser,
  'hero-cta': heroCtaParser,
  'hero-video': heroVideoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Lake Powell homepage with hero booking video section, carousel cards of special offers, featured popular bookings carousel, activities billboard carousel, two-column ways-to-play columns, upcoming events CTA, and a blog cards section.',
  urls: [
    'https://www.lakepowell.com/',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['body > main > div.section.booking-container.has-video-background'],
    },
    {
      name: 'carousel-offers',
      instances: ['body > main > div.section.center-content.carousel-cards-container'],
    },
    {
      name: 'carousel-featured',
      instances: ['body > main > div.section.carousel-featured-container:nth-of-type(3)'],
    },
    {
      name: 'carousel-billboard',
      instances: ['body > main > div.section.carousel-featured-container:nth-of-type(4)'],
    },
    {
      name: 'columns-feature',
      instances: ['body > main > div.section.layout-columns'],
    },
    {
      name: 'hero-cta',
      instances: ['body > main > div.section.center-content.cta-container'],
    },
    {
      name: 'cards-blog',
      instances: ['body > main > div.section.cards-container.cta-container'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  lakepowellCleanupTransformer,
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path.
    // Root URL ("/") reduces to an empty pathname; map it to "/index" so the
    // path is absolute and non-empty (an empty/relative path makes the
    // importer's internal path resolver fall back to process.cwd()).
    let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!rawPath) rawPath = '/index';
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
