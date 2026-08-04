/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-blog.js
  function cleanLink(anchor, document) {
    if (!anchor) return null;
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll(".sr-only").forEach((el) => el.remove());
    let text = clone.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "").trim();
    const link = document.createElement("a");
    link.setAttribute("href", anchor.getAttribute("href") || "#");
    link.textContent = text;
    return link;
  }
  function parse(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".cards.block li, .cards-wrapper li, ul > li"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".cards-card-image picture, .cards-card-image img, picture, img");
      const body = card.querySelector(".cards-card-body") || card;
      const contentCell = [];
      const category = body.querySelector(":scope > p:not(.button-container)");
      if (category) contentCell.push(category);
      const title = body.querySelector("h1, h2, h3, h4, h5, h6");
      if (title) contentCell.push(title);
      const cta = cleanLink(body.querySelector(".cards-cta-group a, .cta a.button, .cta a, a.button"), document);
      if (cta) contentCell.push(cta);
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-billboard.js
  function cleanLink2(anchor, document) {
    if (!anchor) return null;
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll(".sr-only").forEach((el) => el.remove());
    let text = clone.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "").trim();
    const link = document.createElement("a");
    link.setAttribute("href", anchor.getAttribute("href") || "#");
    link.textContent = text;
    return link;
  }
  function parse2(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".carousel-featured-slide, .carousel-featured-slides > li, ul > li"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".carousel-featured-slide-bg picture, .carousel-featured-slide-bg img, picture, img");
      const fg = slide.querySelector(".carousel-featured-slide-fg") || slide;
      const contentCell = [];
      const eyebrow = fg.querySelector('.carousel-featured-slide-eyebrow, [class*="eyebrow"]');
      if (eyebrow) contentCell.push(eyebrow);
      const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
      if (title) contentCell.push(title);
      const description = fg.querySelector(".carousel-featured-slide-description");
      if (description) contentCell.push(description);
      fg.querySelectorAll(".carousel-featured-slide-ctas a, .cta a").forEach((a) => {
        const link = cleanLink2(a, document);
        if (link) contentCell.push(link);
      });
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-billboard", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-featured.js
  function parse3(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".carousel-featured-slide, .carousel-featured-slides > li, ul > li"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".carousel-featured-slide-bg picture, .carousel-featured-slide-bg img, picture, img");
      const fg = slide.querySelector(".carousel-featured-slide-fg") || slide;
      const contentCell = [];
      const eyebrow = fg.querySelector('.carousel-featured-slide-eyebrow, [class*="eyebrow"]');
      if (eyebrow) contentCell.push(eyebrow);
      const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
      const slideHref = slide.querySelector("a[href]") ? slide.querySelector("a[href]").getAttribute("href") : null;
      if (title) {
        if (slideHref) {
          const link = document.createElement("a");
          link.setAttribute("href", slideHref);
          link.textContent = title.textContent.replace(/\s+/g, " ").trim();
          const heading = document.createElement(title.tagName.toLowerCase());
          heading.appendChild(link);
          contentCell.push(heading);
        } else {
          contentCell.push(title);
        }
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-offers.js
  function cleanLink3(anchor, document) {
    if (!anchor) return null;
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll(".sr-only").forEach((el) => el.remove());
    let text = clone.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "").trim();
    const link = document.createElement("a");
    link.setAttribute("href", anchor.getAttribute("href") || "#");
    link.textContent = text;
    return link;
  }
  function parse4(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".carousel-cards-slide, .carousel-cards-slides > li, ul > li"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".carousel-cards-slide-bg picture, .carousel-cards-slide-bg img, picture, img");
      const fg = slide.querySelector(".carousel-cards-slide-fg") || slide;
      const contentCell = [];
      const eyebrow = fg.querySelector('.carousel-cards-slide-eyebrow, [class*="eyebrow"]');
      if (eyebrow) contentCell.push(eyebrow);
      const title = fg.querySelector('h1, h2, h3, h4, [class*="title"]');
      if (title) contentCell.push(title);
      const description = fg.querySelector(".carousel-cards-slide-description");
      if (description) contentCell.push(description);
      fg.querySelectorAll(".carousel-cards-slide-ctas a, .cta a").forEach((a) => {
        const link = cleanLink3(a, document);
        if (link) contentCell.push(link);
      });
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-offers", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function cleanLink4(anchor, document) {
    if (!anchor) return null;
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll(".sr-only").forEach((el) => el.remove());
    let text = clone.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "").trim();
    const link = document.createElement("a");
    link.setAttribute("href", anchor.getAttribute("href") || "#");
    link.textContent = text;
    return link;
  }
  function buildColumnCell(column, document) {
    const cell = [];
    const contentWrapper = column.querySelector(".default-content-wrapper");
    if (contentWrapper) {
      Array.from(contentWrapper.children).forEach((child) => cell.push(child));
    }
    column.querySelectorAll(".image-wrapper picture, .image.block picture").forEach((pic) => {
      cell.push(pic);
    });
    const cta = cleanLink4(column.querySelector(".cta-wrapper a, .cta a.button, .cta a, a.button"), document);
    if (cta) cell.push(cta);
    return cell;
  }
  function parse5(element, { document }) {
    const columns = Array.from(element.querySelectorAll(".layout-column"));
    const cells = [];
    if (columns.length) {
      const row = columns.map((col) => {
        const cell = buildColumnCell(col, document);
        return cell.length ? cell : "";
      });
      cells.push(row);
    }
    if (!cells.length || !cells[0].some((c) => c && c.length)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function cleanLink5(anchor, document) {
    if (!anchor) return null;
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll(".sr-only").forEach((el) => el.remove());
    let text = clone.textContent.replace(/\s+/g, " ").trim();
    if (!text) text = (anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "").trim();
    const link = document.createElement("a");
    link.setAttribute("href", anchor.getAttribute("href") || "#");
    link.textContent = text;
    return link;
  }
  function parse6(element, { document }) {
    const heading = element.querySelector('h1, h2, h3, [class*="title"]');
    const subheading = element.querySelector(".default-content-wrapper p");
    const cta = cleanLink5(element.querySelector(".cta-wrapper a, .cta a.button, .cta a, a.button"), document);
    if (!heading && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (cta) contentCell.push(cta);
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-video.js
  function parse7(element, { document }) {
    const eyebrow = element.querySelector('.booking-hero-eyebrow, [class*="eyebrow"]');
    const heading = element.querySelector('h1, h2, .booking-hero-title, [class*="title"]');
    const subheading = element.querySelector('.booking-hero-subtitle, [class*="subtitle"]');
    const ctaLinks = Array.from(element.querySelectorAll(".booking-hero-content a, a.button"));
    const cells = [];
    const bgImage = element.querySelector('.section-video-background img, picture img[class*="background"], img[class*="hero-bg"]');
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (!heading && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lakepowell-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".search-overlay",
        ".section.search-container",
        ".section.modal-from-metadata-container",
        "iframe"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "cards-blog": parse,
    "carousel-billboard": parse2,
    "carousel-featured": parse3,
    "carousel-offers": parse4,
    "columns-feature": parse5,
    "hero-cta": parse6,
    "hero-video": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Lake Powell homepage with hero booking video section, carousel cards of special offers, featured popular bookings carousel, activities billboard carousel, two-column ways-to-play columns, upcoming events CTA, and a blog cards section.",
    urls: [
      "https://www.lakepowell.com/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["body > main > div.section.booking-container.has-video-background"]
      },
      {
        name: "carousel-offers",
        instances: ["body > main > div.section.center-content.carousel-cards-container"]
      },
      {
        name: "carousel-featured",
        instances: ["body > main > div.section.carousel-featured-container:nth-of-type(3)"]
      },
      {
        name: "carousel-billboard",
        instances: ["body > main > div.section.carousel-featured-container:nth-of-type(4)"]
      },
      {
        name: "columns-feature",
        instances: ["body > main > div.section.layout-columns"]
      },
      {
        name: "hero-cta",
        instances: ["body > main > div.section.center-content.cta-container"]
      },
      {
        name: "cards-blog",
        instances: ["body > main > div.section.cards-container.cta-container"]
      }
    ]
  };
  var transformers = [
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!rawPath) rawPath = "/index";
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
