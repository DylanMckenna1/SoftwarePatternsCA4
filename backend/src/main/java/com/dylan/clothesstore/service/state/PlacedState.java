package com.dylan.clothesstore.service.state;

public class PlacedState implements OrderState {

    @Override
    public String getStatus() {
        return "PLACED";
    }

    @Override
    public OrderState nextState() {
        return new PaidState();
    }
}