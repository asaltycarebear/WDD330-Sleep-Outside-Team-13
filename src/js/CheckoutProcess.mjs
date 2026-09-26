import {
  alertMessage,
  getLocalStorage,
  removeAllAlerts,
  setLocalStorage,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    const storedItems = getLocalStorage(this.key);
    this.list = Array.isArray(storedItems)
      ? storedItems
      : storedItems
        ? [storedItems]
        : [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const subtotal = this.list.reduce(
      (sum, item) => sum + Number(item.FinalPrice || 0),
      0
    );
    this.itemTotal = Number(subtotal.toFixed(2));
    const numItemsElem = document.querySelector(`${this.outputSelector} #num-items`);
    const cartTotalElem = document.querySelector(`${this.outputSelector} #cartTotal`);

    if (numItemsElem) {
      numItemsElem.textContent = this.list.length;
    }
    if (cartTotalElem) {
      cartTotalElem.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrdertotal() {
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.tax = Number((this.itemTotal * 0.06).toFixed(2));
    this.orderTotal = Number(
      (this.itemTotal + this.shipping + this.tax).toFixed(2)
    );
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shippingElem = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotalElem = document.querySelector(
      `${this.outputSelector} #orderTotal`
    );

    if (shippingElem) {
      shippingElem.textContent = `$${this.shipping.toFixed(2)}`;
    }
    if (taxElem) {
      taxElem.textContent = `$${this.tax.toFixed(2)}`;
    }
    if (orderTotalElem) {
      orderTotalElem.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout() {
    const form = document.forms.checkout || document.forms[0];
    const payload = formDataToJSON(form);
    payload.orderDate = new Date().toISOString();
    payload.orderTotal = this.orderTotal.toString();
    payload.tax = this.tax.toString();
    payload.shipping = this.shipping;
    payload.items = packageItems(this.list);

    try {
      await services.checkout(payload);
      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");
    } catch (error) {
      removeAllAlerts();
      if (error && error.message) {
        if (typeof error.message === "object") {
          Object.values(error.message).forEach((msg) => {
            alertMessage(msg);
          });
        } else {
          alertMessage(error.message);
        }
      } else {
        alertMessage("Unable to place your order. Please try again.");
      }
    }
  }
}
