const isPreviewPage = window.location.pathname.endsWith("/index.html") ||
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/4-module");

requestAnimationFrame(() => {
  document.body.classList.add("page-ready");
});

const navigationEntries = performance.getEntriesByType("navigation");
const isReload = navigationEntries[0]?.type === "reload";

if (isReload && !isPreviewPage) {
  window.location.replace("index.html");
}

const shirtPreviewTriggers = document.querySelectorAll("[data-shirt-preview]");

shirtPreviewTriggers.forEach((trigger) => {
  const previewName = trigger.getAttribute("data-shirt-preview");

  const activatePreview = () => {
    document.body.dataset.shirtPreview = previewName;
  };

  const clearPreview = () => {
    delete document.body.dataset.shirtPreview;
  };

  trigger.addEventListener("mouseenter", activatePreview);
  trigger.addEventListener("focus", activatePreview);
  trigger.addEventListener("mouseleave", clearPreview);
  trigger.addEventListener("blur", clearPreview);
});

const brochureStack = document.querySelector("[data-brochure-stack]");

if (brochureStack) {
  const brochureCards = Array.from(brochureStack.querySelectorAll(".brochureCard"));
  let brochureIndex = 0;

  const hideNextBrochureCard = () => {
    if (brochureIndex >= brochureCards.length) {
      brochureCards.forEach((card) => card.classList.remove("is-gone"));
      brochureIndex = 0;
      return;
    }

    brochureCards[brochureIndex].classList.add("is-gone");
    brochureIndex += 1;
  };

  brochureStack.addEventListener("mouseenter", hideNextBrochureCard);
  brochureStack.addEventListener("click", hideNextBrochureCard);
}

const lookbookViewport = document.querySelector("[data-lookbook-viewport]");
const lookbookNextButton = document.querySelector("[data-lookbook-next]");

if (lookbookViewport && lookbookNextButton) {
  let lookbookIndex = 0;
  const maxLookbookIndex = 2;

  const updateLookbook = () => {
    lookbookViewport.dataset.lookbookIndex = String(lookbookIndex);
  };

  updateLookbook();

  lookbookNextButton.addEventListener("click", () => {
    lookbookIndex = lookbookIndex >= maxLookbookIndex ? 0 : lookbookIndex + 1;
    updateLookbook();
  });
}

const internalPageLinks = document.querySelectorAll("a[href]");

internalPageLinks.forEach((link) => {
  const href = link.getAttribute("href");

  if (!href || href.startsWith("#")) {
    return;
  }

  const url = new URL(href, window.location.href);
  const isSamePage = url.pathname === window.location.pathname && url.hash === "";
  const isInternal = url.origin === window.location.origin;

  if (!isInternal || link.target === "_blank" || isSamePage) {
    return;
  }

  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("page-exit");

    window.setTimeout(() => {
      window.location.href = url.href;
    }, 320);
  });
});
