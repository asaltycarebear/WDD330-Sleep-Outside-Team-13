import {
    addProductToCart,
    addToWishlist,
    isInWishlist,
    removeFromWishlist,
} from "./utils.mjs";
import { alertMessage } from "./utils.mjs";

function productDetailsTemplate(product, onWishlist) {
    const wishlistLabel = onWishlist ? "Remove from Wishlist" : "Add to Wishlist";
    return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      <button id="wishlistBtn" class="btn-secondary" data-id="${product.Id}">
        ${wishlistLabel}
      </button>
    </div>
  </section>`;
}

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails("main");

        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
        document
            .getElementById("wishlistBtn")
            .addEventListener("click", this.toggleWishlist.bind(this));
    }

    addToCart() {
        addProductToCart(this.product);
        alertMessage(`${this.product.Name} added to your cart.`, false);
    }

    toggleWishlist() {
        if (isInWishlist(this.product.Id)) {
            removeFromWishlist(this.product.Id);
        } else {
            addToWishlist(this.product);
        }
        this.updateWishlistButton();
    }

    updateWishlistButton() {
        const button = document.getElementById("wishlistBtn");
        if (!button) {
            return;
        }
        button.textContent = isInWishlist(this.product.Id)
            ? "Remove from Wishlist"
            : "Add to Wishlist";
    }

    renderProductDetails(selector = "main") {
        const element = document.querySelector(selector);
        if (!this.product) {
            element.innerHTML = "<p class=\"error\">Product not found.</p>";
            return;
        }
        element.innerHTML = productDetailsTemplate(
            this.product,
            isInWishlist(this.product.Id),
        );
        document.title = `Sleep Outside | ${this.product.Name}`;
    }
}
