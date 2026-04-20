import { getProducts } from "./api.js";
import { CartManager } from "./cart.js";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryInput = document.getElementById("categoryInput");
const manufacturerInput = document.getElementById("manufacturerInput");
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

function getProductImage(product) {
    return product.imageUrl || "https://via.placeholder.com/600x400?text=No+Image";
}

function normalizeSearchValue(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function matchesSearchValue(value, searchTerm) {
    if (!searchTerm) return true;
    return normalizeSearchValue(value).includes(normalizeSearchValue(searchTerm));
}

function filterProducts(products) {
    const title = searchInput ? searchInput.value.trim() : "";
    const category = categoryInput ? categoryInput.value.trim() : "";
    const manufacturer = manufacturerInput ? manufacturerInput.value.trim() : "";

    return products.filter(product => {
        return matchesSearchValue(product.title, title)
            && matchesSearchValue(getCategoryName(product), category)
            && matchesSearchValue(getManufacturerName(product), manufacturer);
    });
}

function sortProducts(products) {
    const sortValue = sortSelect ? sortSelect.value : "";

    const sortStrategies = {
        "price-asc": (a, b) => getDisplayPrice(a) - getDisplayPrice(b),
        "price-desc": (a, b) => getDisplayPrice(b) - getDisplayPrice(a),
        "title-asc": (a, b) => a.title.localeCompare(b.title),
        "title-desc": (a, b) => b.title.localeCompare(a.title),
        "manufacturer-asc": (a, b) => getManufacturerName(a).localeCompare(getManufacturerName(b)),
        "manufacturer-desc": (a, b) => getManufacturerName(b).localeCompare(getManufacturerName(a))
    };

    if (sortStrategies[sortValue]) {
        products.sort(sortStrategies[sortValue]);
    }

    return products;
}

export function buildQuery() {
    const params = new URLSearchParams();
    params.append("discount", "true");
    return `?${params.toString()}`;
}

export function renderProducts(products, onCartUpdate) {
    if (!productGrid) return;

    if (!products || products.length === 0) {
        productGrid.innerHTML = `<p class="empty-message">No products found.</p>`;
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img class="product-image" src="${getProductImage(product)}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description || "No description available."}</p>
            <p class="product-meta">Category: ${getCategoryName(product)}</p>
            <p class="product-meta">Brand: ${getManufacturerName(product)}</p>
            <p class="product-meta">Size: ${product.size || "N/A"}</p>
            <p class="product-meta">Colour: ${product.colour || "N/A"}</p>
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
            const cartCount = CartManager.getItemCount();
            showPageMessage(`Item added to cart. Cart now has ${cartCount} item${cartCount === 1 ? "" : "s"}.`);
        });
    });
}

export async function loadProducts(onCartUpdate, query = "?discount=true") {
    if (!productGrid) return;

    try {
        productGrid.innerHTML = `<p class="empty-message">Loading products...</p>`;
        let products = await getProducts(query);
        products = filterProducts(products);
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
                <img class="product-detail-image" src="${getProductImage(product)}" alt="${product.title}">
                <h1>${product.title}</h1>
                <p>${product.description || "No description available."}</p>
                <p class="product-meta">Category: ${getCategoryName(product)}</p>
                <p class="product-meta">Brand: ${getManufacturerName(product)}</p>
                <p class="product-meta">Size: ${product.size || "N/A"}</p>
                <p class="product-meta">Colour: ${product.colour || "N/A"}</p>
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
