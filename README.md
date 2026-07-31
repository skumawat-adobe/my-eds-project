# My Eds Project

AEM Edge Delivery Services project with **Document Authoring** support.

## Environments

| | URL |
|---|---|
| Preview | https://main--my-eds-project--skumawat-adobe.aem.page/ |
| Live    | https://main--my-eds-project--skumawat-adobe.aem.live/ |

## Prerequisites

- Node.js 20 or newer

## Installation

```sh
npm i
```

## Site Setup

- [ ] Install [AEM Code Sync](https://github.com/apps/aem-code-sync) on this repo
- [ ] Share your content folder with helix@adobe.com (Viewer access)
- [ ] Install [AEM Sidekick](https://www.aem.live/tools/sidekick/) → Add project
- [ ] Open a document in your content source → Sidekick → Preview
- [ ] Verify https://main--my-eds-project--skumawat-adobe.aem.page
- [ ] Sidekick → Publish → verify https://main--my-eds-project--skumawat-adobe.aem.live

## Repository Structure

This repo was bootstrapped with the [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate) and includes pre-configured governance artefacts and EMA reference docs.

### Governance Artefacts
| File | Purpose |
|---|---|
| [agents.md](./agents.md) | AI session context — every AI session reads this first |
| [spec/hallucination-log.md](./spec/hallucination-log.md) | Log every caught AI error immediately |
| [BLOCK-GENERATION-GUIDE.md](./BLOCK-GENERATION-GUIDE.md) | Non-negotiable rules for all EDS block development |
| [.github/workflows/pr-review.yaml](./.github/workflows/pr-review.yaml) | AI first-pass review on every PR (requires ANTHROPIC_API_KEY secret) |
| [.github/pull_request_template.md](./.github/pull_request_template.md) | PR checklist — JS, CSS, performance, accessibility, security |

### Reference Docs (from Adobe EMA Skills)
| File | Purpose |
|---|---|
| [docs/js-guidelines.md](./docs/js-guidelines.md) | EDS JavaScript patterns and anti-patterns |
| [docs/css-guidelines.md](./docs/css-guidelines.md) | EDS CSS scoping, responsive design, anti-patterns |
| [docs/cdd-philosophy.md](./docs/cdd-philosophy.md) | Content-Driven Development principles |
| [docs/ue-field-types.md](./docs/ue-field-types.md) | Universal Editor component model field type reference |

## Development Workflow

1. **Never write code before identifying test content** — follow CDD ([docs/cdd-philosophy.md](./docs/cdd-philosophy.md))
2. **Check Block Collection first** — https://www.aem.live/developer/block-collection
3. **Follow JS/CSS guidelines** — see [docs/js-guidelines.md](./docs/js-guidelines.md) and [docs/css-guidelines.md](./docs/css-guidelines.md)
4. **Run lint before every commit** — `npm run lint`
5. **Open a PR with preview URLs** — AI review fires automatically

## Resources

- [AEM EDS Documentation](https://www.aem.live/docs)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Block Party](https://www.aem.live/developer/block-party/)
- [AEM Sidekick](https://www.aem.live/tools/sidekick/)
- [Admin API](https://www.aem.live/docs/admin.html)
