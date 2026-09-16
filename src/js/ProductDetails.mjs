import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
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
    // use the datasource to get the details for the current product. findProductById will return a promise!
    this.product = await this.dataSource.findProductById(this.productId);

    // the product details are needed before rendering the HTML
    this.renderProductDetails("main");

    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    this.addProductToCart(this.product);
  }

  addProductToCart(product = this.product) {
    const itemToAdd =
      product && !(product instanceof Event) ? product : this.product;
    const cart = getLocalStorage("so-cart") || [];
    cart.push(itemToAdd);
    setLocalStorage("so-cart", cart);
    updateCartCount();
  }

  renderProductDetails(selector = "main") {
    const element = document.querySelector(selector);
    if (!this.product) {
      element.innerHTML = "<p class=\"error\">Product not found.</p>";
      return;
    }
    element.innerHTML = productDetailsTemplate(this.product);
    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}
