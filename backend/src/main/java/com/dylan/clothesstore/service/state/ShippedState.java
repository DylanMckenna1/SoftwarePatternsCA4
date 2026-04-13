package com.dylan.clothesstore.service.state;

public class ShippedState implements OrderState {

    @Override
    public String getStatus() {
        return "SHIPPED";
    }

    @Override
    public OrderState nextState() {
        return new DeliveredState();
    }
}