export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage = "Something went wrong";

        try {
            const text = await response.text();

            try {
                const json = JSON.parse(text);
                if (json.message) {
                    errorMessage = json.message;
                } else if (json.error) {
                    errorMessage = json.error;
                } else {
                    errorMessage = text;
                }
            } catch {
                errorMessage = text || `Request failed: ${response.status}`;
            }
        } catch {
            errorMessage = `Request failed: ${response.status}`;
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

export async function checkoutOrder(email) {
    return fetchJson(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
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

function buildAdminHeaders(username, password) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${username}:${password}`)}`
    };
}

export async function getAdminProducts(username, password) {
    return fetchJson(`${API_BASE_URL}/admin/products`, {
        headers: buildAdminHeaders(username, password)
    });
}

export async function createAdminProduct(payload, username, password) {
    return fetchJson(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: buildAdminHeaders(username, password),
        body: JSON.stringify(payload)
    });
}

export async function updateAdminProduct(productId, payload, username, password) {
    return fetchJson(`${API_BASE_URL}/admin/products/${productId}`, {
        method: "PUT",
        headers: buildAdminHeaders(username, password),
        body: JSON.stringify(payload)
    });
}

export async function deleteAdminProduct(productId, username, password) {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Basic ${btoa(`${username}:${password}`)}`
        }
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }

    return response.text();
}