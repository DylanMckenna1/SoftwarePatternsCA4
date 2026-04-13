package com.dylan.clothesstore.service.state;

import org.springframework.stereotype.Service;

@Service
public class OrderStateContext {

    public OrderState getStateFromStatus(String status) {
        return switch (status) {
            case "PLACED" -> new PlacedState();
            case "PAID" -> new PaidState();
            case "SHIPPED" -> new ShippedState();
            case "DELIVERED" -> new DeliveredState();
            default -> throw new IllegalArgumentException("Unknown order status: " + status);
        };
    }

    public String getNextStatus(String currentStatus) {
        OrderState currentState = getStateFromStatus(currentStatus);
        return currentState.nextState().getStatus();
    }
}