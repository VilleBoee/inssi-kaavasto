# Kaavasto

Insinöörin kaavakirja selaimessa. Tavallinen React- ja Vite-sovellus, jonka voi julkaista GitHub Pagesiin.

## Kehitys

```bash
npm install
npm run dev
```

Sovellus aukeaa osoitteessa http://localhost:8080.

## Build

```bash
npm run build
npm run preview
```

`npm run build` kirjoittaa valmiin sivuston kansioon `docs/` (ei `dist/`). Tiedostot käyttävät suhteellisia osoitteita, joten sama paketti toimii polussa `https://<käyttäjä>.github.io/<repositorio>/`.

## GitHub Pages haarasta

GitHubin kansiovalikossa on vain `/ (root)` ja `/docs`. `dist` ei ole vaihtoehto, eikä juuri toimi: juuren `index.html` on kehitysversio.

1. Aja `npm run build` ja työnnä `docs/`-kansio `main`-haaraan.
2. **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**. Branch: **main**. Folder: **/docs**. **Save**.

Osoite on `https://<käyttäjä>.github.io/<repositorio>/`. Yksittäinen kaava: `https://<käyttäjä>.github.io/<repositorio>/#ohm`.

`docs/.nojekyll` estää Jekylliä käsittelemästä sivustoa. Repositorion pitää olla julkinen, jos et käytä GitHub Prota.
