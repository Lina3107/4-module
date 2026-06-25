const isPreviewPage = window.location.pathname.endsWith("/index.html") ||
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/4-module");

const markPageReady = () => {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
};

if (document.fonts?.ready) {
  document.fonts.ready.then(markPageReady).catch(markPageReady);
} else {
  markPageReady();
}

const navigationEntries = performance.getEntriesByType("navigation");
const isReload = navigationEntries[0]?.type === "reload";

if (isReload && !isPreviewPage) {
  window.location.replace("index.html");
}

const subscribeCloseButton = document.querySelector("[data-subscribe-close]");
const subscribeForm = document.querySelector("[data-subscribe-form]");

if (subscribeCloseButton) {
  subscribeCloseButton.addEventListener("click", () => {
    subscribeCloseButton.closest(".aboutSubscribe")?.classList.add("is-hidden");
  });
}

if (subscribeForm) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!subscribeForm.checkValidity()) {
      subscribeForm.reportValidity();
      return;
    }

    alert("Subscription confirmed.");
    subscribeForm.reset();
  });
}

const brochureStack = document.querySelector("[data-brochure-stack]");

if (brochureStack) {
  const brochureCards = Array.from(brochureStack.querySelectorAll(".brochureCard"));
  let brochureIndex = 0;

  const hideNextBrochureCard = () => {
    if (brochureIndex >= brochureCards.length - 1) {
      return;
    }

    brochureCards[brochureIndex].classList.add("is-gone");
    brochureIndex += 1;
  };

  brochureStack.addEventListener("click", hideNextBrochureCard);
}

const catalogButtons = document.querySelectorAll("[data-catalog-target]");
const productView = document.querySelector(".collectionProduct");
const productImage = productView?.querySelector("[data-product-image]");
const productTitle = productView?.querySelector("[data-product-title]");
const productComposition = productView?.querySelector("[data-product-composition]");
const productColor = productView?.querySelector("[data-product-color]");
const productClose = productView?.querySelector(".collectionProduct__close");

if (catalogButtons.length > 0) {
  let productReturnTarget = "shirts";

  const setCatalogView = (target) => {
    const catalogTargets = ["tops", "jeans", "shorts", "tshirts", "jackets", "knitwear"];

    document.body.classList.toggle("is-shirts-catalog", target === "shirts");
    document.body.classList.toggle("is-trousers-catalog", target === "trousers");
    document.body.classList.toggle("is-catalog-mode", catalogTargets.includes(target));
    document.body.classList.toggle("is-shirt-detail", target === "shirt-detail");

    document.querySelectorAll("[data-catalog-view]").forEach((view) => {
      view.classList.toggle("is-active", view.dataset.catalogView === target);
    });

    catalogButtons.forEach((button) => {
      const buttonTarget = button.dataset.catalogTarget;
      const isActive = buttonTarget === target ||
        (target === "shirt-detail" && buttonTarget === productReturnTarget);

      button.classList.toggle("is-active", isActive);
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  catalogButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.productSrc && productImage && productTitle && productComposition && productColor) {
        productReturnTarget = button.dataset.productReturn || "shirts";
        productImage.src = button.dataset.productSrc;
        productImage.alt = button.dataset.productAlt || button.dataset.productColor || "Product";
        productTitle.textContent = button.dataset.productTitle || "Lot.";
        productComposition.innerHTML = (button.dataset.productComposition || "")
          .split("|")
          .map((line) => line.trim())
          .join("<br />");
        productColor.textContent = button.dataset.productColor || "Color";

        if (productClose) {
          productClose.dataset.catalogTarget = productReturnTarget;
        }
      }

      setCatalogView(button.dataset.catalogTarget);
    });
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
