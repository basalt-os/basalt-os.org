# basalt-os.org

Source of the [basalt-os.org](https://basalt-os.org) website, the home page of
Basalt OS.

Plain static HTML and CSS, no build step and no web fonts. The only scripts
are the self-hosted analytics tag and its small bot filter, the feedback
form's small enhancement script and the gallery viewer, all described below.
Served by GitHub Pages from the root of the `main` branch, with the custom
domain set in `CNAME`.

```
index.html               home page
gallery/index.html       gallery: screenshots and design mockups, with versions
security/index.html      the security model in plain language, linking the docs
404.html                 not found page
assets/site.css          styles (light and dark via prefers-color-scheme)
assets/umami-filter.js   keeps automated browsers out of the visit count
assets/feedback.js       sends the feedback form in place (the form works without it)
assets/gallery.js        gallery viewer and the optional Videos section (links work without it)
assets/gallery/          gallery images: <id>-720.webp and .jpg thumbnails, <id>-1600.webp
feedback/sent.html       shown after a form post without JavaScript
feedback/problem.html    shown when such a post is refused
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

When `assets/site.css` changes, bump the `?v=` query in every HTML file so
browsers pick up the new file.

## Gallery

`gallery/index.html` lists each image as a `figure` in a `ul.shots`, grouped
by section, with a one-line caption and the version and date it shows. Every
image comes in three files under `assets/gallery/`: a 720 px wide WebP and
JPEG thumbnail (the JPEG is the fallback for browsers without WebP) and a
1600 px wide WebP opened in the viewer. Thumbnails carry `width`, `height`
and `loading="lazy"`.

Rules for new images: captures from lab virtual machines with made-up people,
names and addresses only; no real accounts, e-mail addresses, internal host
names or addresses, passwords, recovery keys or other keys (crop or blur
them); no Fedora logos (blur web pages that show them). Mockups go in the
Design previews section, which labels each one as a mockup. Keep the preview
notice at the top of the page while Basalt OS is pre-alpha.

Without JavaScript every thumbnail is a link to the large image. With it,
`assets/gallery.js` opens a dialog with the caption, arrow keys, Home, End,
Escape and swipe.

Videos: the Videos section stays hidden until the JSON block
`#gallery-videos` in `gallery/index.html` lists at least one video, as
`[{"id": "<YouTube video id>", "title": "...", "caption": "..."}]`. The page
requests nothing from YouTube until a person presses Play; then it loads the
player from youtube-nocookie.com.

## Social links

The footer, the gallery and the security page link to the project on GitHub
(basalt-os and openbasalt), X and YouTube with plain links and inline SVG
icons (`ul.social`), no widgets or trackers.

## Security page

`security/index.html` explains the security model in plain language and
links the documents in
[basalt-os/basalt-os docs/security](https://github.com/basalt-os/basalt-os/tree/main/docs/security).
When a new model release is published, update the version, the release link,
the catalog version and date, and the control counts (from the summary of
`controls.md`) in that page.

## Privacy and analytics

The site counts visits with [Umami](https://umami.is), self-hosted at
analytics.openbasalt.org. It sets no cookies, keeps no cross-site identifier
and collects no personal data. Both HTML files load the tag in `<head>` with:

- `data-do-not-track="true"`, so browsers that send Do Not Track are not
  counted;
- `data-domains="basalt-os.org,www.basalt-os.org"`, so forks and local
  previews do not report anything;
- `data-before-send="umamiBeforeSend"`, a function defined in
  `assets/umami-filter.js`, loaded just before the tag.

The filter keeps automated browsers out of the count without blocking them:
crawlers, previews and test tools can fetch every page as usual, they are just
not counted. Umami calls the function before each report, and it skips the
report when `navigator.webdriver` is true, when the user agent carries a common
headless or bot marker (HeadlessChrome, PhantomJS, bot, crawler, spider, slurp,
facebookexternalhit, preview and similar, case insensitive), or when the screen
is exactly 800x600 and the browser reports no languages at all. Every other
report goes out unchanged. It stores nothing and sets no cookie. When the
filter changes, bump the `?v=` query on its tag in both HTML files.

A short note in the footer of the home page tells visitors the same. To stop
counting, remove both `<script>` tags from `index.html` and `404.html`.

## Feedback form

The "Try it and tell us" section (`#feedback`) holds a plain HTML form that
posts to the feedback endpoint, a Cloudflare Worker on workers.dev whose
source is [basalt-os/feedback-worker](https://github.com/basalt-os/feedback-worker).
The endpoint accepts browser requests only from `https://basalt-os.org`.

- Without JavaScript the browser posts the form, and the endpoint redirects
  to `feedback/sent.html` or `feedback/problem.html`.
- With JavaScript, `assets/feedback.js` sends the same fields as JSON with
  `fetch` (no cookies, no referrer) and shows the answer under the button.
  The texts for the endpoint's error codes are at the top of the script.
- A hidden `website` field is a honeypot: people never see it, bots fill it,
  and the endpoint drops those posts.
- What is stored is said under the form: the message, the kind, the e-mail
  and system details when given, and the time. No IP address and no
  cookies; a copy goes to the project's feedback mailbox; the endpoint's
  README has the details.

When the endpoint moves, change the form's `action` in `index.html`. When
`assets/feedback.js` changes, bump its `?v=` query.

## Style

Published text is in English and follows the project style: no em or en
dashes, no bold for emphasis, no ellipsis. Basalt OS is based on Fedora and is
not affiliated with or endorsed by the Fedora Project; do not use Fedora logos.

## License

Basalt OS code is licensed under Apache-2.0, as stated in its source
repository.
