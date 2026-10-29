/* Shenzhen Jianai — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var WHATSAPP = "8613682377128"; // +86 136 8237 7128

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }

  /* ---------- Age gate (18+) ---------- */
  var gate = document.getElementById("ageGate");
  if (gate) {
    var KEY = "jianai_age_ok";
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
    if (!stored) gate.classList.add("is-open");
    document.body.style.overflow = stored ? "" : "hidden";

    var confirmBtn = gate.querySelector("[data-age-confirm]");
    var declineBtn = gate.querySelector("[data-age-decline]");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
        gate.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        window.location.href = "https://www.google.com/";
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    }
    // Safety net: never leave content hidden if the observer does not fire
    // (some in-app browsers and screenshot tools fail to report intersections).
    window.setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
        el.classList.add("is-in");
      });
    }, 2000);
  }

  /* ---------- Catalog filters ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll("[data-category]");
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var f = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = f === "all" || card.getAttribute("data-category") === f;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Inquiry form -> WhatsApp message ---------- */
  var form = document.getElementById("inquiryForm");
  if (form) {
    var productSelect = form.querySelector("#f-product");
    var params = new URLSearchParams(window.location.search);
    var pre = params.get("product");
    if (pre && productSelect) {
      Array.prototype.forEach.call(productSelect.options, function (opt) {
        if (opt.value.toLowerCase() === pre.toLowerCase()) productSelect.value = opt.value;
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: (form.querySelector("#f-name") || {}).value || "",
        company: (form.querySelector("#f-company") || {}).value || "",
        country: (form.querySelector("#f-country") || {}).value || "",
        product: (form.querySelector("#f-product") || {}).value || "",
        qty: (form.querySelector("#f-qty") || {}).value || "",
        message: (form.querySelector("#f-message") || {}).value || ""
      };

      var lines = [
        "New OEM/ODM inquiry — jianai-rubber.com",
        "",
        "Name: " + (data.name || "-"),
        "Company: " + (data.company || "-"),
        "Country / Market: " + (data.country || "-"),
        "Product interest: " + (data.product || "-"),
        "Estimated quantity: " + (data.qty || "-"),
        "",
        "Requirement:",
        data.message || "-"
      ];

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/" + WHATSAPP + "?text=" + text, "_blank", "noopener");

      var status = document.getElementById("formStatus");
      if (status) {
        status.textContent =
          "WhatsApp should open in a new tab with your inquiry pre-filled. If it did not open, call or message +86 136 8237 7128 directly.";
        status.style.display = "block";
      }
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
