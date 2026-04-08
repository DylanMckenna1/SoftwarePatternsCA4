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
        productGrid.innerHTML = `<p class="empty-message">Could not load products.</p>`;
    }
}

function renderProducts(products) {
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
        </div>
    `).join("");
}

function buildQuery() {
    const title = searchInput.value.trim();
    const sortValue = sortSelect.value;

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

searchButton.addEventListener("click", () => {
    fetchProducts(buildQuery());
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    sortSelect.value = "";
    fetchProducts();
});

window.addEventListener("DOMContentLoaded", () => {
    if (productGrid) {
        fetchProducts();
    }
});