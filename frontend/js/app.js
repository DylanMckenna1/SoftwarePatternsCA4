import { CartManager } from "./cart.js";
import { loadProducts, buildQuery, loadProductDetails } from "./products.js?v=20260420-2";
import { loadCart, bindCheckoutButton } from "./checkout.js?v=20260420-2";
import { bindRatingButton } from "./rating.js?v=20260420-2";

const checkoutButton = document.getElementById("checkoutButton");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const searchInput = document.getElementById("searchInput");
const categoryInput = document.getElementById("categoryInput");
const manufacturerInput = document.getElementById("manufacturerInput");
const sortSelect = document.getElementById("sortSelect");

function updateCartCount() {
    const totalCount = CartManager.getItemCount();
    const cartCountBadge = document.getElementById("cartCountBadge");

    if (cartCountBadge) {
        cartCountBadge.textContent = totalCount;
    }

    if (checkoutButton) {
        checkoutButton.disabled = totalCount === 0;
    }
}

function updateNavbarForUser() {
    const nav = document.querySelector(".navbar nav");
    if (!nav) return;

    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser) {
        nav.innerHTML = `
       <a href="index.html">Home</a>
       <a href="products.html">Products</a>
       <a href="cart.html">Cart <span id="cartCountBadge" class="cart-badge">0</span></a>
       <a href="login.html">Login</a>
       <a href="register.html">Register</a>
`;
        updateCartCount();
        return;
    }

    const adminLink = currentUser.role === "ADMIN"
        ? `<a href="admin.html">Admin</a>`
        : "";

    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="cart.html">Cart <span id="cartCountBadge" class="cart-badge">0</span></a>
      ${adminLink}
      <span class="nav-user">Welcome, ${currentUser.firstName}</span>
      <a href="#" id="logoutLink">Logout</a>
`;

    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
         updateCartCount();
}

window.addEventListener("DOMContentLoaded", async () => {
    updateNavbarForUser();
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

        if (categoryInput) {
            categoryInput.value = "";
        }

        if (manufacturerInput) {
            manufacturerInput.value = "";
        }

        if (sortSelect) {
            sortSelect.value = "";
        }

        loadProducts(updateCartCount, "?discount=true");
    });
}
