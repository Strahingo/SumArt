const pageOrder = [
  "index.html",
  "sta-je-sumart.html",
  "nasa-misija.html",
  "projekti.html",
  "kuks.html",
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

const teamCards = document.querySelectorAll(".team-card[data-member-name]");
const teamModal = document.querySelector("#teamModal");

if (teamCards.length && teamModal) {
  const modalPhoto = teamModal.querySelector(".team-modal__photo");
  const modalName = teamModal.querySelector(".team-modal__name");
  const modalRole = teamModal.querySelector(".team-modal__role");
  const modalBio = teamModal.querySelector(".team-modal__bio");
  const modalClose = teamModal.querySelector(".team-modal__close");
  let activeTeamCard = null;

  teamCards.forEach((card) => {
    card.addEventListener("click", () => openTeamModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openTeamModal(card);
    });
  });

  modalClose?.addEventListener("click", closeTeamModal);

  teamModal.addEventListener("click", (event) => {
    if (event.target === teamModal) {
      closeTeamModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && teamModal.classList.contains("is-open")) {
      closeTeamModal();
    }
  });

  function openTeamModal(card) {
    const { memberName, memberRole, memberBio, memberImage, memberInitials } = card.dataset;

    activeTeamCard = card;
    modalName.textContent = memberName || "";
    modalRole.textContent = memberRole || "";
    modalBio.textContent = memberBio || "";
    modalPhoto.innerHTML = "";

    if (memberImage) {
      const image = document.createElement("img");
      image.src = memberImage;
      image.alt = memberName || "";
      modalPhoto.appendChild(image);
      modalPhoto.classList.remove("team-modal__photo--placeholder");
    } else {
      const initials = document.createElement("span");
      initials.textContent = memberInitials || "";
      modalPhoto.appendChild(initials);
      modalPhoto.classList.add("team-modal__photo--placeholder");
    }

    teamModal.classList.add("is-open");
    document.body.classList.add("has-open-modal");
    teamModal.setAttribute("aria-hidden", "false");
    modalClose?.focus();
  }

  function closeTeamModal() {
    teamModal.classList.remove("is-open");
    document.body.classList.remove("has-open-modal");
    teamModal.setAttribute("aria-hidden", "true");
    activeTeamCard?.focus();
    activeTeamCard = null;
  }
}

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
