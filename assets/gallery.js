// Gallery, progressive enhancement. Without JavaScript every thumbnail is a
// plain link to the large image. With it, a native <dialog> shows the large
// image with its caption, and the keyboard (left, right, Home, End, Escape)
// or a swipe moves between images. It also fills the optional Videos section
// from the JSON in #gallery-videos, with players that load only on click.
// No cookies, no storage, no requests until a person asks for them.
(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll(".shot-link"));
  var dialog = document.querySelector(".lightbox");

  if (links.length && dialog && typeof dialog.showModal === "function") {
    var img = dialog.querySelector(".lightbox-stage img");
    var caption = dialog.querySelector(".lightbox-caption .shot-caption");
    var meta = dialog.querySelector(".lightbox-caption .shot-meta");
    var count = dialog.querySelector(".lb-count");
    var current = 0;
    var opener = null;

    function show(index) {
      current = (index + links.length) % links.length;
      var link = links[current];
      var thumb = link.querySelector("img");
      var figure = link.closest("figure");
      // Browsers without WebP keep the JPEG thumbnail they already loaded.
      var full = /\.jpe?g($|\?)/i.test(thumb.currentSrc || "") ? thumb.currentSrc : link.getAttribute("data-full");
      img.src = full;
      img.width = Number(link.getAttribute("data-width")) || thumb.width;
      img.height = Number(link.getAttribute("data-height")) || thumb.height;
      img.alt = thumb.alt;
      caption.textContent = figure.querySelector(".shot-caption").textContent;
      meta.textContent = figure.querySelector(".shot-meta").textContent;
      count.textContent = "Image " + (current + 1) + " of " + links.length;
    }

    function open(index, from) {
      opener = from || null;
      show(index);
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }

    links.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
        event.preventDefault();
        open(index, link);
      });
    });

    dialog.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    dialog.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { show(current - 1); event.preventDefault(); }
      else if (event.key === "ArrowRight") { show(current + 1); event.preventDefault(); }
      else if (event.key === "Home") { show(0); event.preventDefault(); }
      else if (event.key === "End") { show(links.length - 1); event.preventDefault(); }
    });

    // A click on the dark area around the image closes the viewer.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.classList.contains("lightbox-stage")) dialog.close();
    });

    dialog.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      img.removeAttribute("src");
      if (opener) opener.focus();
    });

    // Horizontal swipe on touch screens.
    var startX = null;
    dialog.addEventListener("touchstart", function (event) {
      startX = event.touches.length === 1 ? event.touches[0].clientX : null;
    }, { passive: true });
    dialog.addEventListener("touchend", function (event) {
      if (startX === null) return;
      var dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  // Videos: listed in one place, the JSON block #gallery-videos. The section
  // stays hidden while the list is empty.
  var data = document.getElementById("gallery-videos");
  var section = document.getElementById("videos");
  if (!data || !section) return;
  var videos;
  try {
    videos = JSON.parse(data.textContent || "[]");
  } catch (e) {
    return;
  }
  if (!Array.isArray(videos) || !videos.length) return;

  var list = section.querySelector(".video-list");
  videos.forEach(function (video) {
    if (!video || !/^[A-Za-z0-9_-]{6,20}$/.test(video.id || "")) return;
    var item = document.createElement("li");
    var frame = document.createElement("div");
    frame.className = "video-frame";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "video-load";
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    var title = document.createElement("span");
    title.textContent = video.title || "Play the video";
    var note = document.createElement("small");
    note.textContent = "Plays from YouTube (youtube-nocookie.com). Nothing is loaded from YouTube until you choose Play.";
    button.appendChild(title);
    button.appendChild(note);
    button.setAttribute("aria-label", "Play: " + (video.title || "video") + ", loads the player from YouTube");
    button.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.id) + "?autoplay=1&rel=0";
      iframe.title = video.title || "Video";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      frame.replaceChild(iframe, button);
      iframe.focus();
    });
    frame.appendChild(button);
    item.appendChild(frame);
    if (video.caption) {
      var p = document.createElement("p");
      p.className = "shot-caption";
      p.textContent = video.caption;
      item.appendChild(p);
    }
    list.appendChild(item);
  });
  if (list.children.length) section.hidden = false;
})();
