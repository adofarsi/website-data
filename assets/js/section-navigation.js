(function () {
  "use strict";

  var shell = document.querySelector("[data-section-navigation]");
  if (!shell) return;

  var page = shell.querySelector(".section-nav-page");
  var rail = shell.querySelector(".section-nav-rail");
  var railList = rail.querySelector("ol");
  var picker = shell.querySelector(".section-nav-picker");
  var select = picker.querySelector("select");
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

    var option = document.createElement("option");
    option.value = id;
    option.textContent = item.label;
    select.appendChild(option);
  });

  rail.hidden = false;
  picker.hidden = false;

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
      } else {
        item.link.removeAttribute("aria-current");
      }
    });
    select.value = headings[index].heading.id;
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

  select.addEventListener("change", function () {
    var target = document.getElementById(select.value);
    if (!target) return;
    history.pushState(null, "", "#" + target.id);
    target.scrollIntoView({ block: "start" });
  });

  window.addEventListener("scroll", requestScrollspy, { passive: true });
  window.addEventListener("resize", function () {
    updateHeaderHeight();
    requestScrollspy();
  });

  if (siteHeader && "ResizeObserver" in window) {
    new ResizeObserver(function () {
      updateHeaderHeight();
      requestScrollspy();
    }).observe(siteHeader);
  }

  updateHeaderHeight();
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
