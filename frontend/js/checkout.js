import { getProducts, clearBackendCart, addBackendCartItem, checkoutOrder } from "./api.js";
import { CartManager } from "./cart.js";

const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");
const ratingSection = document.getElementById("ratingSection");
const customerNameInput = document.getElementById("customerNameInput");
const shippingAddressInput = document.getElementById("shippingAddressInput");
const paymentMethodSelect = document.getElementById("paymentMethodSelect");
const orderIdInput = document.getElementById("orderIdInput");
const orderIdDisplay = document.getElementById("orderIdDisplay");

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

const customerName = customerNameInput ? customerNameInput.value.trim() : "";
const shippingAddress = shippingAddressInput ? shippingAddressInput.value.trim() : "";
const paymentMethod = paymentMethodSelect ? paymentMethodSelect.value : "";

if (!customerName || !shippingAddress || !paymentMethod) {
    if (checkoutMessage) {
        checkoutMessage.textContent = "Please complete all checkout details.";
        checkoutMessage.className = "error-message";
    }
    return;
}

const payload = {
    email: currentUser.email,
    customerName,
    shippingAddress,
    paymentMethod
};

const result = await checkoutOrder(payload);

        CartManager.clearCart();
        updateCartCount();
        await loadCart(updateCartCount);

        if (checkoutMessage) {
             checkoutMessage.textContent = `Order placed successfully. Order ID: ${result.orderId}. Total paid: €${Number(result.totalAmount).toFixed(2)}`;
             checkoutMessage.className = "success-message";
        }

        if (ratingSection) {
            ratingSection.style.display = "block";
        }

        if (orderIdDisplay) {
            orderIdDisplay.textContent = result.orderId;
        }

        if (orderIdInput) {
            orderIdInput.value = result.orderId;
        }
    } catch (error) {
        console.error("Checkout error:", error);

        if (checkoutMessage) {
            checkoutMessage.textContent = error.message || "Order could not be placed. Please try again.";
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
