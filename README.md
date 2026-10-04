# basalt-os.org

Source of the [basalt-os.org](https://basalt-os.org) website, the home page of
Basalt OS.

Plain static HTML and CSS, no build step and no web fonts. The only scripts
are the self-hosted analytics tag and its small bot filter, and the feedback
form's small enhancement script, all described below.
Served by GitHub Pages from the root of the `main` branch, with the custom
domain set in `CNAME`.

```
index.html               home page
404.html                 not found page
assets/site.css          styles (light and dark via prefers-color-scheme)
assets/umami-filter.js   keeps automated browsers out of the visit count
assets/feedback.js       sends the feedback form in place (the form works without it)
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

When `assets/site.css` changes, bump the `?v=` query in both HTML files so
browsers pick up the new file.

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
