package com.dylan.clothesstore.service;

import com.dylan.clothesstore.service.command.AddToCartCommand;
import com.dylan.clothesstore.service.command.CartCommandInvoker;
import com.dylan.clothesstore.service.command.ClearCartCommand;
import com.dylan.clothesstore.service.command.RemoveFromCartCommand;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    private final CartCommandInvoker cartCommandInvoker;
    private final Map<Long, Integer> cart = new HashMap<>();

    public CartService(CartCommandInvoker cartCommandInvoker) {
        this.cartCommandInvoker = cartCommandInvoker;
    }

    public Map<Long, Integer> getCart() {
        return cart;
    }

    public void addToCart(Long productId) {
        cartCommandInvoker.executeCommand(new AddToCartCommand(cart, productId));
    }

    public void removeFromCart(Long productId) {
        cartCommandInvoker.executeCommand(new RemoveFromCartCommand(cart, productId));
    }

    public void clearCart() {
        cartCommandInvoker.executeCommand(new ClearCartCommand(cart));
    }
}