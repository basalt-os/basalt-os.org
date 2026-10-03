# basalt-os.org

Source of the [basalt-os.org](https://basalt-os.org) website, the home page of
Basalt OS.

Plain static HTML and CSS, no build step, no web fonts and no first party
JavaScript. The only script is the self-hosted analytics tag described below.
Served by GitHub Pages from the root of the `main` branch, with the custom
domain set in `CNAME`.

```
index.html               home page
404.html                 not found page
assets/site.css          styles (light and dark via prefers-color-scheme)
assets/lockup*.svg       Basalt OS lockup (mark and wordmark), light and dark
assets/social-preview.*  Open Graph image (PNG served, SVG source)
assets/, favicon.ico     favicons and touch icon
robots.txt, sitemap.xml
CNAME, .nojekyll         GitHub Pages settings
```

## Preview locally

Serve the folder with any static server and open it in a browser:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The 404 page uses root relative links, so
open it as http://localhost:8000/404.html.

## Deployment

GitHub Pages publishes the `main` branch root (Settings, Pages, Deploy from a
branch, `main` and `/`). The custom domain comes from `CNAME`. DNS for
basalt-os.org points the apex to the GitHub Pages addresses and `www` to
`basalt-os.github.io`; once the certificate is issued, HTTPS is enforced in
the Pages settings.

When `assets/site.css` changes, bump the `?v=` query in both HTML files so
browsers pick up the new file.

## Privacy and analytics

The site counts visits with [Umami](https://umami.is), self-hosted at
analytics.openbasalt.org. It sets no cookies, keeps no cross-site identifier
and collects no personal data. Both HTML files load the tag in `<head>` with:

- `data-do-not-track="true"`, so browsers that send Do Not Track are not
  counted;
- `data-domains="basalt-os.org,www.basalt-os.org"`, so forks and local
  previews do not report anything.

A short note in the footer of the home page tells visitors the same. To stop
counting, remove the `<script>` tag from `index.html` and `404.html`.

## Style

Published text is in English and follows the project style: no em or en
dashes, no bold for emphasis, no ellipsis. Basalt OS is based on Fedora and is
not affiliated with or endorsed by the Fedora Project; do not use Fedora logos.

## License

Basalt OS code is licensed under Apache-2.0, as stated in its source
repository.
