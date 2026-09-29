import {
  WISHLIST_KEY,
  addProductToCart,
  getLocalStorage,
  removeFromWishlist,
  renderListWithTemplate,
} from "./utils.mjs";

function wishlistItemTemplate(item) {
  return `<li class="cart-card divider" data-id="${item.Id}">
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
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <div class="cart-card__actions">
    <button type="button" class="btn-secondary move-to-cart" data-id="${item.Id}">
      Add to Cart
    </button>
    <button type="button" class="btn-secondary remove-from-wishlist" data-id="${item.Id}">
      Remove
    </button>
  </div>
</li>`;
}

export default class Wishlist {
  constructor(listElement) {
    this.key = WISHLIST_KEY;
    this.listElement = listElement;
  }

  init() {
    this.renderList();
    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-id]");
      if (!button) {
        return;
      }
      const { id } = button.dataset;
      if (button.classList.contains("move-to-cart")) {
        this.moveToCart(id);
      } else if (button.classList.contains("remove-from-wishlist")) {
        this.removeItem(id);
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
        "<li class=\"empty-list\">Your wishlist is empty.</li>";
      return;
    }
    renderListWithTemplate(
      wishlistItemTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }

  moveToCart(productId) {
    const product = this.getItems().find((item) => item.Id === productId);
    if (!product) {
      return;
    }
    addProductToCart(product);
    removeFromWishlist(productId);
    this.renderList();
  }

  removeItem(productId) {
    removeFromWishlist(productId);
    this.renderList();
  }
}
