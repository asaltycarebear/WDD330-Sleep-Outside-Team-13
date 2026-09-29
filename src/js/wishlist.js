import { loadHeaderFooter } from "./utils.mjs";
import Wishlist from "./Wishlist.mjs";

loadHeaderFooter();

const element = document.querySelector(".product-list");
const wishlist = new Wishlist(element);
wishlist.init();
