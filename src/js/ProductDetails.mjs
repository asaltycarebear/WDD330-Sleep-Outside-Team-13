import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    const addToCartButton = document.getElementById("add-to-cart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  const categoryElem = document.querySelector("#p-category");
  if (categoryElem && product.Category) {
    categoryElem.textContent =
      product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  }

  const brandElem = document.querySelector("#p-brand");
  if (brandElem && product.Brand) {
    brandElem.textContent = product.Brand.Name;
  }

  const nameElem = document.querySelector("#p-name");
  if (nameElem) {
    nameElem.textContent = product.NameWithoutBrand || product.Name;
  }

  const productImage = document.querySelector("#p-image");
  if (productImage) {
    productImage.src =
      product.Images?.PrimaryExtraLarge ||
      product.Images?.PrimaryLarge ||
      product.Images?.PrimaryMedium ||
      product.Image;
    productImage.alt = product.NameWithoutBrand || product.Name;
  }

  const priceElem = document.querySelector("#p-price");
  if (priceElem) {
    priceElem.textContent = `$${product.FinalPrice}`;
  }

  const colorElem = document.querySelector("#p-color");
  if (colorElem && product.Colors && product.Colors.length > 0) {
    colorElem.textContent = product.Colors[0].ColorName;
  }

  const descElem = document.querySelector("#p-description");
  if (descElem) {
    descElem.innerHTML = product.DescriptionHtmlSimple;
  }

  const addToCartBtn = document.querySelector("#add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.dataset.id = product.Id;
  }
}
