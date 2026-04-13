package com.dylan.clothesstore.service.state;

public class DeliveredState implements OrderState {

    @Override
    public String getStatus() {
        return "DELIVERED";
    }

    @Override
    public OrderState nextState() {
        return this;
    }
}