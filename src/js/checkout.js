import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".checkout-summary");
checkout.init();
checkout.calculateOrdertotal();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrdertotal();
  });
}

const submitBtn = document.querySelector("#checkoutSubmit");
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.forms.checkout || document.forms[0];
    const isValid = form.checkValidity();
    form.reportValidity();
    if (isValid) {
      checkout.checkout();
    }
  });
}
