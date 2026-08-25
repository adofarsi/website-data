(function () {
  "use strict";

  var shell = document.querySelector("[data-section-navigation]");
  if (!shell) return;

  var page = shell.querySelector(".section-nav-page");
  var rail = shell.querySelector(".section-nav-rail");
  var railList = rail.querySelector("ol");
  var mobileNav = shell.querySelector(".section-nav-mobile");
  var mobileLinks = mobileNav.querySelector(".section-nav-mobile-links");
  var headingSelector = shell.dataset.sectionHeadingSelector || ":scope > section > h2";
  var headings = [];
  var overviewLabel = shell.dataset.sectionOverviewLabel;
  var overview = page.querySelector(":scope > header h1");

  if (overviewLabel && overview) headings.push({ heading: overview, label: overviewLabel });
  page.querySelectorAll(headingSelector).forEach(function (heading) {
    headings.push({ heading: heading, label: heading.textContent.trim() });
  });

  if (!headings.length) return;

  var usedIds = new Set();
  function slugify(value) {
    return value.toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section";
  }

  headings.forEach(function (item) {
    var base = item.heading.id || slugify(item.label);
    var id = base;
    var suffix = 2;
    while (usedIds.has(id) || (document.getElementById(id) && document.getElementById(id) !== item.heading)) {
      id = base + "-" + suffix;
      suffix += 1;
    }
    item.heading.id = id;
    item.heading.classList.add("section-nav-target");
    usedIds.add(id);

    var listItem = document.createElement("li");
    var link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = item.label;
    listItem.appendChild(link);
    railList.appendChild(listItem);
    item.link = link;

    var mobileLink = document.createElement("a");
    mobileLink.href = "#" + id;
    mobileLink.textContent = item.label;
    mobileLinks.appendChild(mobileLink);
    item.mobileLink = mobileLink;
  });

  rail.hidden = false;
  mobileNav.hidden = false;

  function updateRailLineBounds() {
    if (window.getComputedStyle(rail).display === "none") return;
    var links = railList.querySelectorAll("a");
    if (!links.length) return;
    var listRect = railList.getBoundingClientRect();
    var firstRect = links[0].getBoundingClientRect();
    var lastRect = links[links.length - 1].getBoundingClientRect();
    var lineTop = firstRect.top - listRect.top + firstRect.height / 2;
    var lineBottom = listRect.bottom - lastRect.top - lastRect.height / 2;
    railList.style.setProperty("--rail-line-top", lineTop + "px");
    railList.style.setProperty("--rail-line-bottom", lineBottom + "px");
  }

  var siteHeader = document.querySelector(".site-header");
  function updateHeaderHeight() {
    var height = siteHeader ? Math.ceil(siteHeader.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty("--site-header-height", height + "px");
  }

  var activeIndex = -1;
  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    headings.forEach(function (item, itemIndex) {
      if (itemIndex === index) {
        item.link.setAttribute("aria-current", "location");
        item.mobileLink.setAttribute("aria-current", "location");
      } else {
        item.link.removeAttribute("aria-current");
        item.mobileLink.removeAttribute("aria-current");
      }
    });
  }

  var ticking = false;
  function updateScrollspy() {
    ticking = false;
    var headerHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
    var activationLine = headerHeight + Math.min(window.innerHeight * 0.22, 160);
    var index = 0;

    headings.forEach(function (item, itemIndex) {
      if (item.heading.getBoundingClientRect().top <= activationLine) index = itemIndex;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      index = headings.length - 1;
    }
    setActive(index);
  }

  function requestScrollspy() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollspy);
  }

  window.addEventListener("scroll", requestScrollspy, { passive: true });
  window.addEventListener("resize", function () {
    updateHeaderHeight();
    updateRailLineBounds();
    requestScrollspy();
  });

  if (siteHeader && "ResizeObserver" in window) {
    new ResizeObserver(function () {
      updateHeaderHeight();
      requestScrollspy();
    }).observe(siteHeader);
  }

  updateHeaderHeight();
  updateRailLineBounds();
  updateScrollspy();

  if (window.location.hash) {
    var initialTarget = document.getElementById(window.location.hash.slice(1));
    if (initialTarget) {
      window.requestAnimationFrame(function () {
        initialTarget.scrollIntoView({ block: "start" });
      });
    }
  }
}());
