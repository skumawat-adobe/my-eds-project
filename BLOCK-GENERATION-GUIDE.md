# Block Generation Guide — My Eds Project

## Non-Negotiable Rules
- Every block: <block>.js + <block>.css + _<block>.json
- decorate(block) is the ONLY export from block.js
- Import with .js extensions always
- No hardcoded URLs — use fetchConfigs() from /scripts/scripts.js
- moveInstrumentation() whenever DOM structure changes

## Block Collection First
1. https://www.aem.live/developer/block-collection (Adobe-maintained, prefer)
2. https://www.aem.live/developer/block-party/ (community)

## Lint Rules
- ESLint: airbnb-base + plugin:json/recommended
- CSS: rgb() not rgba(), one declaration per line
- Run: npm run lint before every commit

## UE Component Model Rules (if using Universal Editor)
- image fields: type=reference, pair with imageAlt text field
- link fields: type=aem-content
- style variants: type=multiselect, name=classes
- rich text: type=richtext
