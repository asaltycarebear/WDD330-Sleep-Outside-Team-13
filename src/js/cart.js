import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// function cartItemTemplate(item) {
//   const newItem = `<li class="cart-card divider">
//   <a href="#" class="cart-card__image">
//     <img
//       src="${item.Image}"
//       alt="${item.Name}"
//     />
//   </a>
//   <a href="#">
//     <h2 class="card__name">${item.Name}</h2>
//   </a>
//   <p class="cart-card__color">${item.Colors[0].ColorName}</p>
//   <p class="cart-card__quantity">qty: 1</p>
//   <p class="cart-card__price">$${item.FinalPrice}</p>
// </li>`;

//   return newItem;
// }

//Below added new remove from cart button
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>

    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="remove-from-cart" data-id="${item.Id}">
      Remove
    </button>
  </li>`;

  return newItem;
}

//Below is added function for week 2 indavidual activity, cgs
function removeFromCart(productId) {
  const cartItems = getLocalStorage("so-cart") || [];

  const updatedCart = cartItems.filter((item) => item.Id !== productId);

  setLocalStorage("so-cart", updatedCart);

  renderCartContents();
}

document.querySelector(".product-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart")) {
    const productId = event.target.dataset.id;
    removeFromCart(productId);
  }
});

renderCartContents();