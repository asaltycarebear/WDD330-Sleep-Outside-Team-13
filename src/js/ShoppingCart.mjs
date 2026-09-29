import {
  CART_KEY,
  addToWishlist,
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

function cartItemTemplate(item, index) {
  return `<li class="cart-card divider" data-index="${index}">
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium || item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <div class="cart-card__actions">
    <button type="button" class="btn-secondary move-to-wishlist" data-index="${index}">
      Move to Wishlist
    </button>
    <button type="button" class="btn-secondary remove-from-cart" data-index="${index}">
      Remove
    </button>
  </div>
</li>`;
}

export default class ShoppingCart {
  constructor(key = CART_KEY, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  init() {
    this.renderList();
    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-index]");
      if (!button) {
        return;
      }
      const index = Number(button.dataset.index);
      if (button.classList.contains("move-to-wishlist")) {
        this.moveToWishlist(index);
      } else if (button.classList.contains("remove-from-cart")) {
        this.removeItem(index);
      }
    });
  }

  getItems() {
    return getLocalStorage(this.key) || [];
  }

  renderList() {
    const list = this.getItems();
    if (!list.length) {
      this.listElement.innerHTML =
        "<li class=\"empty-list\">Your cart is empty.</li>";
      return;
    }
    const htmlStrings = list.map((item, index) =>
      cartItemTemplate(item, index),
    );
    this.listElement.innerHTML = htmlStrings.join("");
  }

  moveToWishlist(index) {
    const cart = this.getItems();
    const [product] = cart.splice(index, 1);
    if (!product) {
      return;
    }
    setLocalStorage(this.key, cart);
    updateCartCount();
    addToWishlist(product);
    this.renderList();
  }

  removeItem(index) {
    const cart = this.getItems();
    cart.splice(index, 1);
    setLocalStorage(this.key, cart);
    updateCartCount();
    this.renderList();
  }
}
