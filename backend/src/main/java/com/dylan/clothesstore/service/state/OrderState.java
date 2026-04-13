package com.dylan.clothesstore.service.state;

public interface OrderState {
    String getStatus();
    OrderState nextState();
}