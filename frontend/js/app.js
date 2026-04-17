import { CartManager } from "./cart.js";
import { loadProducts, buildQuery, loadProductDetails } from "./products.js";
import { loadCart, bindCheckoutButton } from "./checkout.js";
import { bindRatingButton } from "./rating.js";

const cartCountBadge = document.getElementById("cartCountBadge");
const checkoutButton = document.getElementById("checkoutButton");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function updateCartCount() {
    const totalCount = CartManager.getItemCount();

    if (cartCountBadge) {
        cartCountBadge.textContent = totalCount;
    }

    if (checkoutButton) {
        checkoutButton.disabled = totalCount === 0;
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    updateCartCount();
    await loadProducts(updateCartCount, "?discount=true");
    await loadCart(updateCartCount);
    await loadProductDetails(updateCartCount);
    bindCheckoutButton(updateCartCount);
    bindRatingButton();
});

if (searchButton) {
    searchButton.addEventListener("click", () => {
        loadProducts(updateCartCount, buildQuery());
    });
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (sortSelect) {
            sortSelect.value = "";
        }

        loadProducts(updateCartCount, "?discount=true");
    });
}