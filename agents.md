# My Eds Project — EDS Project Context

## Project Overview
- **Authoring mode:** Document Authoring (DA)
- **AEM / Content URL:** https://content.da.live/skumawat-adobe/my-eds-project/
- **Repo:** https://github.com/skumawat-adobe/my-eds-project
- **Preview:** https://main--my-eds-project--skumawat-adobe.aem.page
- **Live:** https://main--my-eds-project--skumawat-adobe.aem.live

## Architecture Decisions
- Authoring: DA — Google Drive / SharePoint / DA content source
- Boilerplate: adobe/aem-boilerplate
- Block library approach: Block Collection first, custom only if not found

## Block Inventory
| Block | Status | Notes |
|---|---|---|

## Governance Rules
- Never hardcode API URLs — always use fetchConfigs()
- Always run npm run lint before committing
- Every PR requires AI code-review pass before human review
- Hallucinations logged in /spec/hallucination-log.md

## Active Decisions Log
<!-- Record key decisions and rejections here so next session starts ahead -->
