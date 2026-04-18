import { getProducts, clearBackendCart, addBackendCartItem, checkoutOrder } from "./api.js";
import { CartManager } from "./cart.js";

const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");
const ratingSection = document.getElementById("ratingSection");
const orderIdInput = document.getElementById("orderIdInput");

export async function loadCart(updateCartCount) {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");

    if (!cartItemsContainer || !cartTotalContainer) {
        return;
    }

    const cart = CartManager.getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        cartTotalContainer.textContent = "€0.00";
        updateCartCount();
        return;
    }

    try {
        const products = await getProducts("?discount=true");

        const cartProducts = cart.map(item => {
            const product = products.find(productEntry => productEntry.id === item.productId);
            return product ? { ...product, quantity: item.quantity } : null;
        }).filter(Boolean);

        if (cartProducts.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
            cartTotalContainer.textContent = "€0.00";
            updateCartCount();
            return;
        }

        cartItemsContainer.innerHTML = cartProducts.map(product => `
            <div class="cart-item">
                <div>
                    <h3>${product.title}</h3>
                    <p>${product.description || "No description available."}</p>
                    <p class="product-meta">Category: ${product.categoryName || "N/A"}</p>
                    <p class="product-meta">Manufacturer: ${product.manufacturerName || "N/A"}</p>
                    <p class="product-meta">Quantity: ${product.quantity}</p>
                </div>
                <div>
                    <div class="product-price">€${(Number(product.discountedPrice) * product.quantity).toFixed(2)}</div>
                    <button class="remove-button" data-product-id="${product.id}">Remove</button>
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".remove-button[data-product-id]").forEach(button => {
            button.addEventListener("click", () => {
                const productId = Number(button.dataset.productId);
                CartManager.removeItem(productId);
                updateCartCount();
                loadCart(updateCartCount);
            });
        });

        const total = cartProducts.reduce((sum, product) => {
            return sum + (Number(product.discountedPrice) * product.quantity);
        }, 0);

        cartTotalContainer.textContent = `€${total.toFixed(2)}`;
        updateCartCount();
    } catch (error) {
        console.error("Error loading cart:", error);
        cartItemsContainer.innerHTML = `<p class="empty-message">Could not load cart.</p>`;
        cartTotalContainer.textContent = "€0.00";
    }
}

export async function checkoutCart(updateCartCount) {
    if (checkoutMessage) {
        checkoutMessage.textContent = "";
        checkoutMessage.className = "";
    }

    const cart = CartManager.getCart();

    if (!cart || cart.length === 0) {
        if (checkoutMessage) {
            checkoutMessage.textContent = "Your cart is empty.";
            checkoutMessage.className = "error-message";
        }
        return;
    }

    try {
        await clearBackendCart();

        for (const item of cart) {
            for (let i = 0; i < item.quantity; i++) {
                await addBackendCartItem(item.productId);
            }
        }

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.email) {
    if (checkoutMessage) {
        checkoutMessage.textContent = "Please log in before placing an order.";
        checkoutMessage.className = "error-message";
            }
        return;
        }

const result = await checkoutOrder(currentUser.email);

        CartManager.clearCart();
        updateCartCount();
        await loadCart(updateCartCount);

        if (checkoutMessage) {
            checkoutMessage.textContent = `Order placed successfully. Order ID: ${result.orderId}`;
            checkoutMessage.className = "success-message";
        }

        if (ratingSection) {
            ratingSection.style.display = "block";
        }

        if (orderIdInput) {
            orderIdInput.value = result.orderId;
        }
    } catch (error) {
        console.error("Checkout error:", error);

        if (checkoutMessage) {
            checkoutMessage.textContent = "Order could not be placed. Please try again.";
            checkoutMessage.className = "error-message";
        }
    }
}

export function bindCheckoutButton(updateCartCount) {
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            checkoutCart(updateCartCount);
        });
    }
}