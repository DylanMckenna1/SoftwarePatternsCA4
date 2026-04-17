import { getProducts } from "./api.js";
import { CartManager } from "./cart.js";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const pageMessage = document.getElementById("pageMessage");

function showPageMessage(message, type = "success") {
    if (!pageMessage) return;
    pageMessage.innerHTML = `<p class="${type}-message message-banner">${message}</p>`;
    setTimeout(() => {
        pageMessage.innerHTML = "";
    }, 2500);
}

function getDisplayPrice(product) {
    if (product.discountedPrice !== undefined && product.discountedPrice !== null) {
        return Number(product.discountedPrice);
    }
    return Number(product.price);
}

function getCategoryName(product) {
    if (product.categoryName) return product.categoryName;
    if (product.category && product.category.name) return product.category.name;
    return "N/A";
}

function getManufacturerName(product) {
    if (product.manufacturerName) return product.manufacturerName;
    if (product.manufacturer && product.manufacturer.name) return product.manufacturer.name;
    return "N/A";
}

function sortProducts(products) {
    const sortValue = sortSelect ? sortSelect.value : "";

    const sortStrategies = {
        "price-asc": (a, b) => getDisplayPrice(a) - getDisplayPrice(b),
        "price-desc": (a, b) => getDisplayPrice(b) - getDisplayPrice(a),
        "title-asc": (a, b) => a.title.localeCompare(b.title),
        "title-desc": (a, b) => b.title.localeCompare(a.title)
    };

    if (sortStrategies[sortValue]) {
        products.sort(sortStrategies[sortValue]);
    }

    return products;
}

export function buildQuery() {
    const title = searchInput ? searchInput.value.trim() : "";
    const params = new URLSearchParams();

    if (title) {
        params.append("title", title);
    }

    params.append("discount", "true");

    return params.toString() ? `?${params.toString()}` : "";
}

export function renderProducts(products, onCartUpdate) {
    if (!productGrid) return;

    if (!products || products.length === 0) {
        productGrid.innerHTML = `<p class="empty-message">No products found.</p>`;
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.title}</h3>
            <p>${product.description || "No description available."}</p>
            <p class="product-meta">Category: ${getCategoryName(product)}</p>
            <p class="product-meta">Brand: ${getManufacturerName(product)}</p>
            <p class="product-meta">Stock: ${product.stockQuantity ?? "N/A"}</p>
            <div class="product-price">€${getDisplayPrice(product).toFixed(2)}</div>
            <div class="product-actions">
                <button class="cart-button" data-product-id="${product.id}">Add to Cart</button>
                <a class="details-button" href="product.html?id=${product.id}">View Details</a>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".cart-button[data-product-id]").forEach(button => {
        button.addEventListener("click", () => {
            const productId = Number(button.dataset.productId);
            CartManager.addItem(productId);
            onCartUpdate();
            showPageMessage("Item added to cart.");
        });
    });
}

export async function loadProducts(onCartUpdate, query = "?discount=true") {
    if (!productGrid) return;

    try {
        productGrid.innerHTML = `<p class="empty-message">Loading products...</p>`;
        let products = await getProducts(query);
        products = sortProducts(products);
        renderProducts(products, onCartUpdate);
    } catch (error) {
        console.error("Error loading products:", error);
        productGrid.innerHTML = `<p class="empty-message">Could not load products.</p>`;
    }
}

export async function loadProductDetails(onCartUpdate) {
    const productDetailsContainer = document.getElementById("productDetails");

    if (!productDetailsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        productDetailsContainer.innerHTML = `<p class="empty-message">Product not found.</p>`;
        return;
    }

    try {
        const products = await getProducts("?discount=true");
        const product = products.find(item => item.id === Number(productId));

        if (!product) {
            productDetailsContainer.innerHTML = `<p class="empty-message">Product not found.</p>`;
            return;
        }

        productDetailsContainer.innerHTML = `
            <div class="product-detail-card">
                <h1>${product.title}</h1>
                <p>${product.description || "No description available."}</p>
                <p class="product-meta">Category: ${getCategoryName(product)}</p>
                <p class="product-meta">Brand: ${getManufacturerName(product)}</p>
                <p class="product-meta">Stock: ${product.stockQuantity ?? "N/A"}</p>
                <div class="product-price">€${getDisplayPrice(product).toFixed(2)}</div>
                <button id="detailAddToCartButton" class="cart-button">Add to Cart</button>
                <div id="detailPageMessage"></div>
            </div>
        `;

        const button = document.getElementById("detailAddToCartButton");
        const detailPageMessage = document.getElementById("detailPageMessage");

        if (button) {
            button.addEventListener("click", () => {
                CartManager.addItem(product.id);
                onCartUpdate();
                if (detailPageMessage) {
                    detailPageMessage.innerHTML = `<p class="success-message message-banner">Item added to cart.</p>`;
                    setTimeout(() => {
                        detailPageMessage.innerHTML = "";
                    }, 2500);
                }
            });
        }
    } catch (error) {
        console.error("Error loading product details:", error);
        productDetailsContainer.innerHTML = `<p class="empty-message">Could not load product details.</p>`;
    }
}