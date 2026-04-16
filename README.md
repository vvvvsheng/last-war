# Last War

Last War is an anti-war NFT collection built around a post-bitcoin wasteland myth.

## What is inside

- An English-first landing page with premium NFT-style positioning
- A dedicated `mint.html` terminal with wallet connection and launch logic
- A procedural SVG-based Genesis sample collection
- Metadata, manifest, and rarity report outputs
- A weighted rarity protocol that can scale toward the full `2140` supply

## Project structure

- `index.html`: brand site and collection presentation
- `mint.html`: mint interface and launch console
- `styles.css`: shared visual system for site and mint page
- `script.js`: homepage gallery interactions
- `mint.js`: wallet connect, quantity, countdown, and mint UI logic
- `scripts/generate-collection.mjs`: outputs sample NFT images, metadata, manifest, and rarity report
- `assets/collection/images`: generated SVG artwork
- `assets/collection/metadata`: generated metadata JSON
- `assets/collection/manifest.js`: gallery data consumed by the site
- `assets/collection/rarity-report.json`: weighted rarity output
- `docs/rarity-system.md`: rarity rules and scaling notes

## How to regenerate the sample collection

```bash
node ./scripts/generate-collection.mjs
```

## Open from other devices

Run the local static server:

```bash
npm run serve
```

Then open one of the printed LAN addresses on another computer or phone connected to the same Wi-Fi.

Examples:

- `http://192.168.x.x:4173`
- `http://10.x.x.x:4173`

Pages:

- Homepage: `/index.html`
- Mint page: `/mint.html`

## Mint hand-off

The mint page is production-shaped but still uses a placeholder contract address. To take it live:

1. Deploy the NFT contract.
2. Replace the placeholder contract address in `mint.js`.
3. Swap the placeholder mint branch in `mint.js` for your ABI-backed transaction call.
4. Update chain info, mint price, launch date, and metadata base URI.

## Publish to GitHub

After you create an empty repository named `last-war` on GitHub, run:

```bash
git add .
git commit -m "Expand Last War with mint page and rarity system"
git branch -M main
git remote add origin https://github.com/<your-name>/last-war.git
git push -u origin main
```

## Publish publicly with GitHub Pages

This repo now includes a GitHub Pages workflow in `.github/workflows/pages.yml`.

After the repository is on GitHub:

1. Open the repository on GitHub.
2. Go to `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or rerun the Pages workflow manually.

According to GitHub's official Pages docs, GitHub Pages can publish static HTML/CSS/JS directly from a repository, and GitHub Actions is the recommended deployment path for custom static sites. For a project site, the default URL is `https://<owner>.github.io/<repositoryname>`. Sources:
- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [Creating a GitHub Pages site](https://docs.github.com/github/working-with-github-pages/creating-a-github-pages-site)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
