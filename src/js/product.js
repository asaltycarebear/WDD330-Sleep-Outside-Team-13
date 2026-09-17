import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import getParam from "./utils.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");
const productId = getParam("product");

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || []; // "|| means or, so it is an or give me an empty array"
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

//for testing
console.log(productId);
console.log(dataSource.findProductById(productId));
