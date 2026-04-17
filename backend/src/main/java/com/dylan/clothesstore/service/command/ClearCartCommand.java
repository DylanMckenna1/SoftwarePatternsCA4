package com.dylan.clothesstore.service.command;

import java.util.Map;

public class ClearCartCommand implements CartCommand {

    private final Map<Long, Integer> cart;

    public ClearCartCommand(Map<Long, Integer> cart) {
        this.cart = cart;
    }

    @Override
    public void execute() {
        cart.clear();
    }
}