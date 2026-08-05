# adofarsi.com — site + data

Source for [www.adofarsi.com](https://www.adofarsi.com): a Jekyll static site (GitHub
Pages) rendered entirely from the JSON data files in this repository.

## Layout

| Path | Purpose |
|------|---------|
| `json/` | **Single source of truth** — publications, talks (`dissemination`), students, collaborators, positions, education, funding, awards, memberships, academic service (`activities`) |
| `pdf/` | Publication PDFs, linked from `json/publications.json` |
| `students/`, `collaborators/` | Photos, matched by `Name_Surname.jpg` (placeholders used when missing) |
| `images/` | Other site images (teaching photos) |
| `_layouts/`, `_includes/`, `assets/`, `*.html` | Jekyll templates and pages |
| `cv/` | CV generation notebooks consuming the same JSON (not part of the site build) |
| `php/` | Legacy WordPress shortcodes from the old site (obsolete after migration) |

## Updating the site

Edit the relevant file in `json/` (or drop a photo/PDF in its folder), commit, push.
GitHub Pages rebuilds the site automatically in about a minute. No build tools needed.

## Local preview

With Docker running:

```bash
docker run --rm -p 4000:4000 -v "$PWD":/srv -w /srv ruby:3.3 \
  bash -c "gem install --no-document jekyll webrick jekyll-sitemap && \
           jekyll serve --host 0.0.0.0 --force_polling"
```

Then open <http://localhost:4000/>.

## Domain

The site is served at <https://www.adofarsi.com> via GitHub Pages: the `CNAME` file
binds the custom domain, `www` is a DNS CNAME to `adofarsi.github.io`, and the apex
`A` records point to GitHub Pages (`185.199.108.153`, `.109.`, `.110.`, `.111.`), so
the apex redirects to www. HTTPS is enforced in the repo's Pages settings.
