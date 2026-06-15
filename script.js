const pageOrder = [
  "index.html",
  "sta-je-sumart.html",
  "nasa-misija.html",
  "projekti.html",
  "kontakt.html",
  "creality-tv.html",
];

const intro = document.querySelector(".intro");
const continueButton = document.querySelector("#continueButton");
const transitionLayer = document.createElement("div");

transitionLayer.className = "page-transition";
transitionLayer.setAttribute("aria-hidden", "true");
document.body.appendChild(transitionLayer);

const currentPage = getPageName(window.location.pathname);

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-transitioning-forward", "is-transitioning-back");
});

if (continueButton && intro) {
  continueButton.addEventListener("click", () => {
    intro.classList.add("is-leaving");
    continueButton.setAttribute("aria-disabled", "true");

    window.setTimeout(() => {
      window.location.href = "sta-je-sumart.html";
    }, 860);
  });
}

document.querySelectorAll("a[href]").forEach((link) => {
  const url = new URL(link.href, window.location.href);
  const isSameOrigin = url.origin === window.location.origin;
  const isPageLink = ["http:", "https:", "file:"].includes(url.protocol);
  const isHashOnly = url.pathname === window.location.pathname && url.hash;
  const target = link.getAttribute("target");

  if (!isPageLink || !isSameOrigin || isHashOnly || target === "_blank" || link.hasAttribute("download")) {
    return;
  }

  link.addEventListener("click", (event) => {
    const nextPage = getPageName(url.pathname);

    if (!nextPage || nextPage === currentPage) {
      return;
    }

    event.preventDefault();
    goToPage(url.href, getDirection(currentPage, nextPage));
  });
});

function goToPage(href, direction) {
  document.body.classList.add(
    direction === "back" ? "is-transitioning-back" : "is-transitioning-forward",
  );

  window.setTimeout(() => {
    window.location.href = href;
  }, 720);
}

function getPageName(pathname) {
  const page = pathname.split("/").filter(Boolean).pop();

  return page || "index.html";
}

function getDirection(fromPage, toPage) {
  const fromIndex = pageOrder.indexOf(fromPage);
  const toIndex = pageOrder.indexOf(toPage);

  if (fromIndex === -1 || toIndex === -1) {
    return "forward";
  }

  return toIndex < fromIndex ? "back" : "forward";
}
