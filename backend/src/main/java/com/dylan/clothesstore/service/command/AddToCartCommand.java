package com.dylan.clothesstore.service.command;

import java.util.Map;

public class AddToCartCommand implements CartCommand {

    private final Map<Long, Integer> cart;
    private final Long productId;

    public AddToCartCommand(Map<Long, Integer> cart, Long productId) {
        this.cart = cart;
        this.productId = productId;
    }

    @Override
    public void execute() {
        cart.put(productId, cart.getOrDefault(productId, 0) + 1);
    }
}