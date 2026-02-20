# Rebel Art — rebelart.de

Personal art portfolio of Ludek Pesek Pachl. Built with Jekyll and deployed on GitHub Pages.

## Structure

```
_config.yml          Jekyll configuration
_layouts/default.html  Shared page layout (header + footer)
_includes/
  header.html        Logo + navigation
  footer.html        Footer nav + language switch
_data/
  paintings.json     Paintings gallery data (edit to add/remove items)
  posters.json       Posters gallery data
  installations.json Installation gallery data
assets/
  css/style.css      All styles (responsive, CSS custom properties)
  js/main.js         Language switching, pagination, lightbox
index.html           Landing page
paintings.html       Paintings gallery (reads from _data/paintings.json)
posters.html         Posters gallery
installation.html    Installation gallery
exhibitions.html     Exhibition history
biography.html       Biography (DE + EN)
press.html           Press article (DE + EN)
media.html           Media links (PDFs, audio, video)
contact.html         Contact info
```

## Adding a new artwork

Edit the relevant JSON file in `_data/` and add an entry:

```json
{
  "img": "img/pics/full_image.jpg",
  "thumb": "img/pics/thumbnail.jpg",
  "title_de": "German title (year)",
  "title_en": "English title (year)",
  "desc_de": "Acryl auf Leinwand, 100x100 cm",
  "desc_en": "Acrylic on canvas, 100x100 cm"
}
```

Add the entry at the **top** of the JSON array for newest-first ordering. Place image files in `img/pics/`.

## Language switching

All pages support DE/EN via `data-lang` attributes. Language preference is saved in `localStorage`. No duplicate HTML files needed.

## Local development

```bash
# With Docker
docker run --rm --volume="$PWD:/srv/jekyll" -it jekyll/minimal jekyll build --watch
```