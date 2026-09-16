// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const count = Array.isArray(cart) ? cart.length : cart ? 1 : 0;
  let badge = document.querySelector(".cart-count");
  if (!badge) {
    const cartLink = document.querySelector(".cart a");
    if (cartLink) {
      badge = document.createElement("sup");
      badge.className = "cart-count";
      cartLink.appendChild(badge);
    }
  }
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "flex";
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.classList.add("pop");
    } else {
      badge.textContent = "";
      badge.style.display = "none";
    }
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", updateCartCount);
  } else {
    updateCartCount();
  }
}
