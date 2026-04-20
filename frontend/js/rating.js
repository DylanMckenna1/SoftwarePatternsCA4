import { submitOrderRating } from "./api.js";

const orderIdInput = document.getElementById("orderIdInput");
const orderIdDisplay = document.getElementById("orderIdDisplay");
const ratingScore = document.getElementById("ratingScore");
const ratingComment = document.getElementById("ratingComment");
const submitRatingButton = document.getElementById("submitRatingButton");
const ratingMessage = document.getElementById("ratingMessage");

export async function submitRating() {
    if (ratingMessage) {
        ratingMessage.textContent = "";
        ratingMessage.className = "";
    }

    const orderId = orderIdInput
        ? orderIdInput.value.trim()
        : (orderIdDisplay ? orderIdDisplay.textContent.trim() : "");
    const score = ratingScore ? parseInt(ratingScore.value) : 5;
    const comment = ratingComment ? ratingComment.value.trim() : "";

    if (score < 1 || score > 5) {
        if (ratingMessage) {
            ratingMessage.textContent = "Rating must be between 1 and 5.";
            ratingMessage.className = "error-message";
        }
        return;
    }

    if (!orderId || orderId === "Not available" || Number.isNaN(Number(orderId))) {
        if (ratingMessage) {
            ratingMessage.textContent = "Please enter an order ID.";
            ratingMessage.className = "error-message";
        }
        return;
    }

    try {
        await submitOrderRating(orderId, score, comment);

        if (ratingMessage) {
            ratingMessage.textContent = "Rating submitted successfully.";
            ratingMessage.className = "success-message";
        }

        if (ratingComment) ratingComment.value = "";
        if (orderIdInput) orderIdInput.value = "";
        if (orderIdDisplay) orderIdDisplay.textContent = "Not available";
        if (ratingScore) ratingScore.value = "5";
    } catch (error) {
        console.error("Rating error:", error);

        if (ratingMessage) {
            ratingMessage.textContent = "Failed to submit rating.";
            ratingMessage.className = "error-message";
        }
    }
}

export function bindRatingButton() {
    if (submitRatingButton) {
        submitRatingButton.addEventListener("click", () => {
            submitRating();
        });
    }
}
