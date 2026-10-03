---
title: Website and deployment
---

## Local documentation

```bash
cd docs-site
npm ci
npm run start
```

The development server hot reloads documentation edits. Its local root corresponds to the production `/manimce-claude/docs/` path.

Run a production check with:

```bash
npm run build
```

## Local Jekyll page

With Ruby, Bundler, and Jekyll available, run `bundle exec jekyll serve`. The root `_config.yml` excludes Docusaurus sources and skill internals from the Jekyll output.

## GitHub Pages

On a push to `main` or a manual dispatch, the Pages workflow installs Node dependencies, builds Docusaurus, builds Jekyll, merges both static outputs, and deploys one artifact. Build failures prevent deployment. The workflow uses only the minimum `contents`, `pages`, and OpenID token permissions required by GitHub Pages.
