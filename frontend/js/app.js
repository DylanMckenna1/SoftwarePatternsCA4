const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");
const ratingSection = document.getElementById("ratingSection");
const orderIdInput = document.getElementById("orderIdInput");
const ratingScore = document.getElementById("ratingScore");
const ratingComment = document.getElementById("ratingComment");
const submitRatingButton = document.getElementById("submitRatingButton");
const ratingMessage = document.getElementById("ratingMessage");

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
            <p class="product-meta">Category: ${product.categoryName || "N/A"}</p>
            <p class="product-meta">Manufacturer: ${product.manufacturerName || "N/A"}</p>
            <p class="product-meta">Stock: ${product.stockQuantity}</p>
            <div class="product-price">€${Number(product.discountedPrice).toFixed(2)}</div>
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

    params.append("discount", "true");

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
        const response = await fetch(`${API_BASE_URL}/products?discount=true`);
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
                    <p class="product-meta">Category: ${product.categoryName || "N/A"}</p>
                    <p class="product-meta">Manufacturer: ${product.manufacturerName || "N/A"}</p>
                    <p class="product-meta">Quantity: ${product.quantity}</p>
                </div>
                <div>
                    <div class="product-price">€${(Number(product.discountedPrice) * product.quantity).toFixed(2)}</div>
                    <button class="remove-button" onclick="removeFromCart(${product.id})">Remove</button>
                </div>
            </div>
        `).join("");

        const total = cartProducts.reduce((sum, product) => {
            return sum + (Number(product.discountedPrice) * product.quantity);
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
        const response = await fetch(`${API_BASE_URL}/products?discount=true`);
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
                <p class="product-meta">Category: ${product.categoryName || "N/A"}</p>
                <p class="product-meta">Manufacturer: ${product.manufacturerName || "N/A"}</p>
                <p class="product-meta">Stock: ${product.stockQuantity}</p>
                <p class="product-meta">Original Price: €${Number(product.price).toFixed(2)}</p>
                <div class="product-price">Discounted Price: €${Number(product.discountedPrice).toFixed(2)}</div>
                <button class="cart-button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    } catch (error) {
        console.error("Error loading product details:", error);
        productDetailsContainer.innerHTML = `<p class="empty-message">Could not load product details.</p>`;
    }
}

async function checkoutCart() {
    if (checkoutMessage) {
        checkoutMessage.textContent = "";
        checkoutMessage.className = "";
    }

    const cart = getCart();

    if (!cart || cart.length === 0) {
        if (checkoutMessage) {
            checkoutMessage.textContent = "Your cart is empty.";
            checkoutMessage.className = "error-message";
        }
        return;
    }

    try {
        await fetch(`${API_BASE_URL}/cart/clear`, {
            method: "POST"
        });

        for (const item of cart) {
            for (let i = 0; i < item.quantity; i++) {
                await fetch(`${API_BASE_URL}/cart/add/${item.productId}`, {
                    method: "POST"
                });
            }
        }

        const response = await fetch(`${API_BASE_URL}/checkout`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Checkout failed");
        }

        const result = await response.json();

        localStorage.removeItem("cart");
        loadCart();

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
            checkoutMessage.textContent = "Checkout failed. Please try again.";
            checkoutMessage.className = "error-message";
        }
    }
}

async function submitRating() {
    if (ratingMessage) {
        ratingMessage.textContent = "";
        ratingMessage.className = "";
    }

    const orderId = orderIdInput ? orderIdInput.value.trim() : "";
    const score = ratingScore ? parseInt(ratingScore.value) : 5;
    const comment = ratingComment ? ratingComment.value.trim() : "";

    if (!orderId) {
        if (ratingMessage) {
            ratingMessage.textContent = "Please enter an order ID.";
            ratingMessage.className = "error-message";
        }
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: score,
                comment: comment
            })
        });

        if (!response.ok) {
            throw new Error("Rating submission failed");
        }

        if (ratingMessage) {
            ratingMessage.textContent = "Rating submitted successfully.";
            ratingMessage.className = "success-message";
        }

        if (ratingComment) {
            ratingComment.value = "";
        }
    } catch (error) {
        console.error("Rating error:", error);

        if (ratingMessage) {
            ratingMessage.textContent = "Failed to submit rating.";
            ratingMessage.className = "error-message";
        }
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
        fetchProducts("?discount=true");
    });
}

window.addEventListener("DOMContentLoaded", () => {
    if (productGrid) {
        fetchProducts("?discount=true");
    }

    loadCart();
    loadProductDetails();
});

if (submitRatingButton) {
    submitRatingButton.addEventListener("click", () => {
        submitRating();
    });
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        checkoutCart();
    });
}