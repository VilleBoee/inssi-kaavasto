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

`dist/` käyttää oletuksena suhteellisia osoitteita, joten sama paketti toimii sekä paikallisesti että polussa `https://<käyttäjä>.github.io/<repositorio>/`.

Jos sivusto julkaistaan tunnettuun polkuun käsin, buildin voi tehdä näin:

```bash
VITE_BASE=/XXXX/ npm run build
```

Käyttäjäsivustolla (`käyttäjä.github.io` ilman alirepoa) käytä `VITE_BASE=/`.

## GitHub Pages

1. Luo GitHub-repositorio, esimerkiksi `XXXX`, ja työnnä tämä projekti sen `main`-haaraan.
2. Avaa repositorion **Settings → Pages → Build and deployment** ja valitse lähteeksi **GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` rakentaa sivuston ja julkaisee sen.

Osoite on `https://<käyttäjä>.github.io/XXXX/`. Yksittäinen kaava avautuu hashilla, esimerkiksi `https://<käyttäjä>.github.io/XXXX/#ohm`.

Repositorion pitää olla julkinen, jos et käytä GitHub Prota Pages-julkaisuun.
