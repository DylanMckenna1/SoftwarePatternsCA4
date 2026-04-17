export const CartManager = {
    getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    },

    saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    },

    addItem(productId) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        this.saveCart(cart);
    },

    removeItem(productId) {
        const updatedCart = this.getCart().filter(item => item.productId !== productId);
        this.saveCart(updatedCart);
    },

    clearCart() {
        localStorage.removeItem("cart");
    },

    getItemCount() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    }
};