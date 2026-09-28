import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs";

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
        (sum, item) =>
          sum + Number(item.FinalPrice || 0) * (item.quantity || 1),
        0
      );

      const totalElem = document.querySelector(".cart-total-value");

      if (totalElem) {
        totalElem.textContent = `$${total.toFixed(2)} `;
      }
    } else {
      cartFooter.classList.add("hide");
    }
  }
}

// Below added quantity and remove buttons
// image, product link, color, and price code.
function cartItemTemplate(item) {
  // If the item does not have a quantity yet, use 1
  const quantity = item.quantity || 1;

  const imgSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimarySmall ||
    item.Image ||
    "";

  const colorName =
    item.Colors && item.Colors.length > 0
      ? item.Colors[0].ColorName
      : "";

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

  <div class="cart-card__quantity">
    <label for="quantity-${item.Id}">qty:</label>

    <button class="quantity-decrease" data-id="${item.Id}">
      -
    </button>

    <input
      type="number"
      id="quantity-${item.Id}"
      class="quantity-input"
      data-id="${item.Id}"
      value="${quantity}"
      min="1"
    />

    <button class="quantity-increase" data-id="${item.Id}">
      +
    </button>
  </div>

  <p class="cart-card__price">$${item.FinalPrice}</p>

  <button class="remove-from-cart" data-id="${item.Id}">
    Remove
  </button>
</li>`;

  return newItem;
}

// Below added function for week 2 individual activity, cgs
function removeFromCart(productId) {
  const cartItems = getLocalStorage("so-cart") || [];

  const updatedCart = cartItems.filter((item) => item.Id !== productId);

  setLocalStorage("so-cart", updatedCart);

  renderCartContents();
}

// Below added function to change the quantity of a product
function changeQuantity(productId, newQuantity) {
  const cartItems = getLocalStorage("so-cart") || [];

  const updatedCart = cartItems.map((item) => {
    if (item.Id === productId) {
      return {
        ...item,
        quantity: newQuantity,
      };
    }

    return item;
  });

  setLocalStorage("so-cart", updatedCart);

  renderCartContents();
}

// Below added event listener for remove and quantity buttons
const productList = document.querySelector(".product-list");

if (productList) {
  productList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
      const productId = event.target.dataset.id;
      removeFromCart(productId);
    }

    if (event.target.classList.contains("quantity-increase")) {
      const productId = event.target.dataset.id;
      const cartItems = getLocalStorage("so-cart") || [];
      const item = cartItems.find((item) => item.Id === productId);

      if (item) {
        const quantity = item.quantity || 1;
        changeQuantity(productId, quantity + 1);
      }
    }

    if (event.target.classList.contains("quantity-decrease")) {
      const productId = event.target.dataset.id;
      const cartItems = getLocalStorage("so-cart") || [];
      const item = cartItems.find((item) => item.Id === productId);

      if (item) {
        const quantity = item.quantity || 1;

        if (quantity > 1) {
          changeQuantity(productId, quantity - 1);
        }
      }
    }
  });

  // Below added event listener for manually entering a quantity
  productList.addEventListener("change", (event) => {
    if (event.target.classList.contains("quantity-input")) {
      const productId = event.target.dataset.id;
      let newQuantity = parseInt(event.target.value);

      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
      }

      changeQuantity(productId, newQuantity);
    }
  });
}

renderCartContents();

