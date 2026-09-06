/* Cozy Dental : By Dr. Patani — interactions */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- year ---------- */
  var yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- navbar scrolled ---------- */
  var navbar = document.getElementById("navbar");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 620);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("no-scroll", open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  /* ---------- active section highlight ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1600;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".stat-num");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animateCounter(en.target);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = parseFloat(c.getAttribute("data-count")).toFixed(c.getAttribute("data-decimals") || 0);
    });
  }

  /* ---------- lazy images with fallback (gallery) ---------- */
  var fallbackPool = [
    "assets/img/clinic/clinic-room.jpg",
    "assets/img/clinic/clinic-exterior.jpg",
    "assets/img/doctors/dr-shruti-patani.jpg"
  ];
  var fbIdx = 0;
  var imgs = document.querySelectorAll("img[data-src]");
  function loadImg(img) {
    var remote = img.getAttribute("data-src");
    var local = img.getAttribute("data-fallback");
    if (!local && fallbackPool.length) {
      local = fallbackPool[fbIdx++ % fallbackPool.length];
    }
    var done = false;
    var tryNext = function () {
      if (done) return;
      if (local) {
        done = true;
        img.src = local;
        img.addEventListener("error", hideTile, { once: true });
      } else {
        hideTile();
      }
    };
    function hideTile() {
      if (img.dataset.failed) return;
      img.dataset.failed = "1";
      img.style.display = "none";
      var fig = img.closest(".g-item");
      if (fig) {
        fig.style.display = "flex";
        fig.style.alignItems = "center";
        fig.style.justifyContent = "center";
        fig.style.minHeight = "180px";
        fig.innerHTML = '<span style="color:#bfe6e0;font-weight:700;font-size:.85rem;text-align:center;padding:20px">Photo coming soon</span>';
      }
    }
    img.addEventListener("error", tryNext, { once: true });
    img.src = remote;
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            loadImg(en.target);
            obs.unobserve(en.target);
          }
        });
      },
      { rootMargin: "300px 0px" }
    );
    imgs.forEach(function (i) { io.observe(i); });
  } else {
    imgs.forEach(loadImg);
  }

  /* ---------- lazy map iframe ---------- */
  var mapFrame = document.querySelector("iframe[data-src]");
  if (mapFrame) {
    if ("IntersectionObserver" in window) {
      var mio = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              mapFrame.src = mapFrame.getAttribute("data-src");
              mapFrame.removeAttribute("data-src");
              obs.unobserve(mapFrame);
            }
          });
        },
        { rootMargin: "400px 0px" }
      );
      mio.observe(mapFrame);
    } else {
      mapFrame.src = mapFrame.getAttribute("data-src");
    }
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var gItems = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var current = -1;

  function srcOf(fig) {
    var img = fig.querySelector("img");
    return img ? img.currentSrc || img.src || img.getAttribute("data-src") || "" : "";
  }
  function show(idx) {
    current = (idx + gItems.length) % gItems.length;
    var src = srcOf(gItems[current]);
    if (!src) return;
    lbImg.src = src;
    lb.classList.add("open");
    document.body.classList.add("no-scroll");
  }
  function hide() {
    lb.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  if (lb && gItems.length) {
    gItems.forEach(function (fig, i) {
      fig.addEventListener("click", function () { show(i); });
    });
    lbClose.addEventListener("click", hide);
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- review slider arrows ---------- */
  var track = document.getElementById("reviewTrack");
  var prevBtn = document.querySelector(".sl-prev");
  var nextBtn = document.querySelector(".sl-next");
  if (track && prevBtn && nextBtn) {
    var step = function () {
      var card = track.querySelector(".r-card");
      return card ? card.getBoundingClientRect().width + 18 : 360;
    };
    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
    // simple drag-to-scroll support
    var down = false, startX = 0, startL = 0;
    track.addEventListener("mousedown", function (e) {
      down = true; startX = e.pageX; startL = track.scrollLeft;
      track.style.cursor = "grabbing";
    });
    window.addEventListener("mousemove", function (e) {
      if (!down) return;
      track.scrollLeft = startL - (e.pageX - startX);
    });
    window.addEventListener("mouseup", function () {
      down = false; track.style.cursor = "";
    });
  }
})();
