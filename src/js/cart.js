import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const listElement = document.querySelector(".product-list");
  if (listElement) {
    listElement.innerHTML = htmlItems.join("");
  }

  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    if (cartItems.length > 0) {
      cartFooter.classList.remove("hide");
      const total = cartItems.reduce(
        (sum, item) => sum + Number(item.FinalPrice || 0),
        0
      );
      const totalElem = document.querySelector(".cart-total-value");
      if (totalElem) {
        totalElem.textContent = `$${total.toFixed(2)}`;
      }
    } else {
      cartFooter.classList.add("hide");
    }
  }
}


function cartItemTemplate(item) {
  const imgSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimarySmall ||
    item.Image ||
    "";
  const colorName =
    item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "";

  const newItem = `<li class="cart-card divider">
  <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${imgSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
