package com.dylan.clothesstore.service.state;

public class PaidState implements OrderState {

    @Override
    public String getStatus() {
        return "PAID";
    }

    @Override
    public OrderState nextState() {
        return new ShippedState();
    }
}