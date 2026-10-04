// Feedback form, progressive enhancement: send the form with fetch and show
// the answer in place. Without JavaScript the form posts as usual and the
// endpoint redirects to /feedback/sent.html or /feedback/problem.html.
// No cookies, no storage, no other requests.
(function () {
  "use strict";

  var form = document.getElementById("feedback-form");
  if (!form || !window.fetch || !window.FormData) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");

  // Text shown to people, by the endpoint's error codes.
  var TEXT = {
    sending: "Sending your feedback.",
    sent: "Thank you. Your feedback arrived, and a person will read it.",
    empty_message: "Please write a message first.",
    message_too_long: "The message is longer than 5000 characters. Please shorten it.",
    system_too_long: "The system details are longer than 4000 characters. Please shorten them.",
    bad_email: "The e-mail address does not look right. Please check it, or leave it empty.",
    bad_kind: "Please pick what it is about.",
    rate_limited: "Too many messages came from your network in the last hour. Please try again later.",
    busy: "We received a lot of feedback today. Please try again tomorrow, or write to feedback@basalt-os.org.",
    network: "Your feedback could not be sent. Check your connection and try again, or write to feedback@basalt-os.org.",
    other: "Your feedback could not be sent. Please try again, or write to feedback@basalt-os.org.",
  };

  function show(key, ok) {
    status.textContent = TEXT[key] || TEXT.other;
    status.className = "form-status" + (ok ? " is-ok" : key === "sending" ? "" : " is-error");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var data = new FormData(form);
    var body = {
      kind: data.get("kind") || "",
      message: data.get("message") || "",
      email: data.get("email") || "",
      system: data.get("system") || "",
      website: data.get("website") || "",
    };
    button.disabled = true;
    show("sending");
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "omit",
      referrerPolicy: "no-referrer",
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (answer) {
            if (res.ok && answer.ok) {
              form.reset();
              show("sent", true);
            } else {
              show(answer.error || "other");
            }
          });
      })
      .catch(function () {
        show("network");
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
