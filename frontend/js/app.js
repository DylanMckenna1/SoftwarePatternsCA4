const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

async function fetchProducts(query = "") {
    try {
        const response = await fetch(`${API_BASE_URL}/products${query}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
        if (productGrid) {
            productGrid.innerHTML = `<p class="empty-message">Could not load products.</p>`;
        }
    }
}

function renderProducts(products) {
    if (!productGrid) {
        return;
    }

    if (!products || products.length === 0) {
        productGrid.innerHTML = `<p class="empty-message">No products found.</p>`;
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.title}</h3>
            <p>${product.description || "No description available."}</p>
            <p class="product-meta">Category: ${product.category ? product.category.name : "N/A"}</p>
            <p class="product-meta">Manufacturer: ${product.manufacturer ? product.manufacturer.name : "N/A"}</p>
            <p class="product-meta">Stock: ${product.stockQuantity}</p>
            <div class="product-price">€${Number(product.price).toFixed(2)}</div>
            <button class="cart-button" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join("");
}

function buildQuery() {
    const title = searchInput ? searchInput.value.trim() : "";
    const sortValue = sortSelect ? sortSelect.value : "";

    const params = new URLSearchParams();

    if (title) {
        params.append("title", title);
    }

    if (sortValue) {
        const [sortBy, direction] = sortValue.split("-");
        params.append("sortBy", sortBy);
        params.append("direction", direction);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
}

function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
}

async function loadCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");

    if (!cartItemsContainer || !cartTotalContainer) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        cartTotalContainer.textContent = "€0.00";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();

        const cartProducts = cart.map(id => products.find(product => product.id === id)).filter(Boolean);

        if (cartProducts.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
            cartTotalContainer.textContent = "€0.00";
            return;
        }

        cartItemsContainer.innerHTML = cartProducts.map((product, index) => `
            <div class="cart-item">
                <div>
                    <h3>${product.title}</h3>
                    <p>${product.description || "No description available."}</p>
                    <p class="product-meta">Category: ${product.category ? product.category.name : "N/A"}</p>
                    <p class="product-meta">Manufacturer: ${product.manufacturer ? product.manufacturer.name : "N/A"}</p>
                </div>
                <div>
                    <div class="product-price">€${Number(product.price).toFixed(2)}</div>
                    <button class="remove-button" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `).join("");

        const total = cartProducts.reduce((sum, product) => sum + Number(product.price), 0);
        cartTotalContainer.textContent = `€${total.toFixed(2)}`;
    } catch (error) {
        console.error("Error loading cart:", error);
        cartItemsContainer.innerHTML = `<p class="empty-message">Could not load cart.</p>`;
        cartTotalContainer.textContent = "€0.00";
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

if (searchButton) {
    searchButton.addEventListener("click", () => {
        fetchProducts(buildQuery());
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
        fetchProducts();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    if (productGrid) {
        fetchProducts();
    }

    loadCart();
});