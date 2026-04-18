import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct
} from "./api.js";

const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");
const adminPanel = document.getElementById("adminPanel");
const adminProductsList = document.getElementById("adminProductsList");
const adminProductForm = document.getElementById("adminProductForm");
const adminProductMessage = document.getElementById("adminProductMessage");
const clearAdminFormButton = document.getElementById("clearAdminFormButton");

let adminCredentials = null;

function setMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `${type}-message`;
}

function getFormPayload() {
    return {
        title: document.getElementById("productTitle").value.trim(),
        description: document.getElementById("productDescription").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        stockQuantity: parseInt(document.getElementById("productStock").value),
        imageUrl: document.getElementById("productImageUrl").value.trim(),
        size: document.getElementById("productSize").value.trim(),
        colour: document.getElementById("productColour").value.trim(),
        categoryName: document.getElementById("productCategory").value.trim(),
        manufacturerName: document.getElementById("productManufacturer").value.trim()
    };
}

function clearForm() {
    document.getElementById("productId").value = "";
    document.getElementById("productTitle").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";
    document.getElementById("productImageUrl").value = "";
    document.getElementById("productSize").value = "";
    document.getElementById("productColour").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productManufacturer").value = "";
}

function populateForm(product) {
    document.getElementById("productId").value = product.id;
    document.getElementById("productTitle").value = product.title;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stockQuantity;
    document.getElementById("productImageUrl").value = product.imageUrl || "";
    document.getElementById("productSize").value = product.size || "";
    document.getElementById("productColour").value = product.colour || "";
    document.getElementById("productCategory").value = product.categoryName || "";
    document.getElementById("productManufacturer").value = product.manufacturerName || "";
}

async function loadAdminProducts() {
    if (!adminCredentials) return;

    try {
        const products = await getAdminProducts(adminCredentials.username, adminCredentials.password);

        adminProductsList.innerHTML = products.map(product => `
            <div class="admin-product-item">
                <div>
                    <strong>${product.title}</strong>
                    <p>€${Number(product.price).toFixed(2)} | Stock: ${product.stockQuantity}</p>
                    <p>${product.categoryName || "N/A"} | ${product.manufacturerName || "N/A"}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="cart-button edit-product-btn" data-id="${product.id}">Edit</button>
                    <button class="remove-button delete-product-btn" data-id="${product.id}">Delete</button>
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".edit-product-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const products = await getAdminProducts(adminCredentials.username, adminCredentials.password);
                const product = products.find(p => p.id === Number(button.dataset.id));
                if (product) {
                    populateForm(product);
                    setMessage(adminProductMessage, "Editing product.", "success");
                }
            });
        });

        document.querySelectorAll(".delete-product-btn").forEach(button => {
            button.addEventListener("click", async () => {
                try {
                    await deleteAdminProduct(button.dataset.id, adminCredentials.username, adminCredentials.password);
                    setMessage(adminProductMessage, "Product deleted successfully.", "success");
                    await loadAdminProducts();
                    clearForm();
                } catch (error) {
                    console.error(error);
                    setMessage(adminProductMessage, "Failed to delete product.", "error");
                }
            });
        });
    } catch (error) {
        console.error(error);
        setMessage(adminLoginMessage, "Could not load admin products.", "error");
    }
}

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        try {
            await getAdminProducts(username, password);
            adminCredentials = { username, password };
            adminPanel.style.display = "block";
            setMessage(adminLoginMessage, "Admin connected successfully.", "success");
            await loadAdminProducts();
        } catch (error) {
            console.error(error);
            adminPanel.style.display = "none";
            setMessage(adminLoginMessage, "Invalid admin credentials.", "error");
        }
    });
}

if (adminProductForm) {
    adminProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!adminCredentials) {
            setMessage(adminProductMessage, "Please connect as admin first.", "error");
            return;
        }

        const productId = document.getElementById("productId").value;
        const payload = getFormPayload();

        try {
            if (productId) {
                await updateAdminProduct(productId, payload, adminCredentials.username, adminCredentials.password);
                setMessage(adminProductMessage, "Product updated successfully.", "success");
            } else {
                await createAdminProduct(payload, adminCredentials.username, adminCredentials.password);
                setMessage(adminProductMessage, "Product created successfully.", "success");
            }

            clearForm();
            await loadAdminProducts();
        } catch (error) {
            console.error(error);
            setMessage(adminProductMessage, "Failed to save product.", "error");
        }
    });
}

if (clearAdminFormButton) {
    clearAdminFormButton.addEventListener("click", () => {
        clearForm();
        setMessage(adminProductMessage, "", "success");
    });
}