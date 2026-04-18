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

function updateNavbarForUser() {
    const nav = document.querySelector(".navbar nav");
    if (!nav) return;

    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser) {
        nav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="products.html">Products</a>
            <a href="cart.html">Cart</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
        return;
    }

    const adminLink = currentUser.role === "ADMIN"
        ? `<a href="admin.html">Admin</a>`
        : "";

    nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="cart.html">Cart</a>
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

        if (sortSelect) {
            sortSelect.value = "";
        }

        loadProducts(updateCartCount, "?discount=true");
    });
}