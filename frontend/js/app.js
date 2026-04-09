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
            <div class="product-actions">
                <button class="cart-button" onclick="addToCart(${product.id})">Add to Cart</button>
                <a class="details-button" href="product.html?id=${product.id}">View Details</a>
            </div>
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

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCart(cart);
    alert("Product added to cart");
}

async function loadCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");

    if (!cartItemsContainer || !cartTotalContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        cartTotalContainer.textContent = "€0.00";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();

        const cartProducts = cart.map(item => {
            const product = products.find(productEntry => productEntry.id === item.productId);
            return product ? { ...product, quantity: item.quantity } : null;
        }).filter(Boolean);

        if (cartProducts.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
            cartTotalContainer.textContent = "€0.00";
            return;
        }

        cartItemsContainer.innerHTML = cartProducts.map(product => `
            <div class="cart-item">
                <div>
                    <h3>${product.title}</h3>
                    <p>${product.description || "No description available."}</p>
                    <p class="product-meta">Category: ${product.category ? product.category.name : "N/A"}</p>
                    <p class="product-meta">Manufacturer: ${product.manufacturer ? product.manufacturer.name : "N/A"}</p>
                    <p class="product-meta">Quantity: ${product.quantity}</p>
                </div>
                <div>
                    <div class="product-price">€${(Number(product.price) * product.quantity).toFixed(2)}</div>
                    <button class="remove-button" onclick="removeFromCart(${product.id})">Remove</button>
                </div>
            </div>
        `).join("");

        const total = cartProducts.reduce((sum, product) => {
            return sum + (Number(product.price) * product.quantity);
        }, 0);

        cartTotalContainer.textContent = `€${total.toFixed(2)}`;
    } catch (error) {
        console.error("Error loading cart:", error);
        cartItemsContainer.innerHTML = `<p class="empty-message">Could not load cart.</p>`;
        cartTotalContainer.textContent = "€0.00";
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    loadCart();
}

async function loadProductDetails() {
    const productDetailsContainer = document.getElementById("productDetails");

    if (!productDetailsContainer) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        productDetailsContainer.innerHTML = `<p class="empty-message">Product not found.</p>`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        const product = products.find(item => item.id === Number(productId));

        if (!product) {
            productDetailsContainer.innerHTML = `<p class="empty-message">Product not found.</p>`;
            return;
        }

        productDetailsContainer.innerHTML = `
            <div class="product-detail-card">
                <h1>${product.title}</h1>
                <p>${product.description || "No description available."}</p>
                <p class="product-meta">Category: ${product.category ? product.category.name : "N/A"}</p>
                <p class="product-meta">Manufacturer: ${product.manufacturer ? product.manufacturer.name : "N/A"}</p>
                <p class="product-meta">Stock: ${product.stockQuantity}</p>
                <div class="product-price">€${Number(product.price).toFixed(2)}</div>
                <button class="cart-button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    } catch (error) {
        console.error("Error loading product details:", error);
        productDetailsContainer.innerHTML = `<p class="empty-message">Could not load product details.</p>`;
    }
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
    loadProductDetails();
});