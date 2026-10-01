import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
    const checkout = new CheckoutProcess(checkoutForm);
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();
        checkout.checkout();
    });
}
