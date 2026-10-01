// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export const CART_KEY = "so-cart";
export const WISHLIST_KEY = "so-wishlist";

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getWishlist() {
  return getLocalStorage(WISHLIST_KEY) || [];
}

export function isInWishlist(productId) {
  return getWishlist().some((item) => item.Id === productId);
}

export function addToWishlist(product) {
  const wishlist = getWishlist();
  if (wishlist.some((item) => item.Id === product.Id)) {
    return wishlist;
  }
  wishlist.push(product);
  setLocalStorage(WISHLIST_KEY, wishlist);
  updateWishlistCount();
  return wishlist;
}

export function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter((item) => item.Id !== productId);
  setLocalStorage(WISHLIST_KEY, wishlist);
  updateWishlistCount();
  return wishlist;
}

export function addProductToCart(product) {
  const cart = getLocalStorage(CART_KEY) || [];
  cart.push(product);
  setLocalStorage(CART_KEY, cart);
  updateCartCount();
  return cart;
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector('main');
  if (!main) return;

  const alert = document.createElement('div');
  alert.classList.add('alert');

  const text = document.createElement('p');
  text.textContent = typeof message === 'string' ? message : JSON.stringify(message);

  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.classList.add('alert__dismiss');
  dismiss.setAttribute('aria-label', 'Dismiss message');
  dismiss.textContent = '×';

  alert.append(text, dismiss);
  dismiss.addEventListener('click', () => alert.remove());
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
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

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, null, () => {
    updateCartCount();
    updateWishlistCount();
  });
  renderWithTemplate(footerTemplate, footerElement);
}

function updateBadge(selector, count) {
  const badge = document.querySelector(selector);
  if (!badge) {
    return;
  }
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

export function updateCartCount() {
  const cart = getLocalStorage(CART_KEY) || [];
  const count = Array.isArray(cart) ? cart.length : cart ? 1 : 0;
  updateBadge(".cart-count", count);
}

export function updateWishlistCount() {
  const wishlist = getWishlist();
  updateBadge(".wishlist-count", wishlist.length);
}
