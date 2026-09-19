import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  document.title = `Sleep Outside | ${product.Name}`;
  document.getElementById("productBrand").textContent = product.Brand.Name;
  document.getElementById("productName").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
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
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = cartItems ? [cartItems] : [];
    }
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}
