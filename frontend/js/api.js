export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage = `Request failed: ${response.status}`;

        try {
            const errorBody = await response.text();
            if (errorBody) {
                errorMessage = errorBody;
            }
        } catch (error) {
            console.error("Error reading error response:", error);
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getProducts(query = "") {
    return fetchJson(`${API_BASE_URL}/products${query}`);
}

export async function clearBackendCart() {
    await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "POST"
    });
}

export async function addBackendCartItem(productId) {
    await fetch(`${API_BASE_URL}/cart/add/${productId}`, {
        method: "POST"
    });
}

export async function checkoutOrder() {
    return fetchJson(`${API_BASE_URL}/checkout`, {
        method: "POST"
    });
}

export async function submitOrderRating(orderId, score, comment) {
    return fetchJson(`${API_BASE_URL}/orders/${orderId}/rate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score,
            comment
        })
    });
}

export async function registerUser(payload) {
    return fetchJson(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export async function loginUser(payload) {
    return fetchJson(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}