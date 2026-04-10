package com.dylan.clothesstore.service.command;

import java.util.Map;

public class RemoveFromCartCommand implements CartCommand {

    private final Map<Long, Integer> cart;
    private final Long productId;

    public RemoveFromCartCommand(Map<Long, Integer> cart, Long productId) {
        this.cart = cart;
        this.productId = productId;
    }

    @Override
    public void execute() {
        cart.remove(productId);
    }
}