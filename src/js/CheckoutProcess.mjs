import ExternalServices from './ExternalServices.mjs';
import { alertMessage, getLocalStorage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(form) {
    this.form = form;
    this.cart = getLocalStorage('so-cart') || [];
    this.services = new ExternalServices();
    this.renderOrderSummary();
  }

  renderOrderSummary() {
    const summary = document.querySelector('#checkout-items');
    const total = document.querySelector('#checkout-total');
    if (!summary || !total) return;

    summary.innerHTML = this.cart.map((item) => `
      <li class="checkout-item">
        <span>${item.Name}</span>
        <span>$${Number(item.FinalPrice).toFixed(2)}</span>
      </li>
    `).join('');
    const amount = this.cart.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    total.textContent = `Total: $${amount.toFixed(2)}`;
  }

  packageOrder() {
    const fields = this.form.elements;
    return {
      orderDate: new Date().toISOString(),
      fname: fields.fname.value,
      lname: fields.lname.value,
      street: fields.street.value,
      city: fields.city.value,
      state: fields.state.value,
      zip: fields.zip.value,
      cardNumber: fields.cardNumber.value,
      expiration: fields.expiration.value,
      items: this.cart.map((item) => item.Id),
    };
  }

  async checkout() {
    if (!this.cart.length) {
      alertMessage('Your cart is empty. Add an item before checking out.');
      return;
    }

    try {
      await this.services.checkout(this.packageOrder());
      localStorage.removeItem('so-cart');
      window.location.href = './success.html';
    } catch (error) {
      const details = error?.message;
      const message = typeof details === 'string'
        ? details
        : details?.message || JSON.stringify(details || 'The order could not be placed.');
      alertMessage(message);
    }
  }
}