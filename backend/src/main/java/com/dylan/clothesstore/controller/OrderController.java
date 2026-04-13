package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import com.dylan.clothesstore.service.state.OrderStateContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CustomerOrderRepository customerOrderRepository;
    private final OrderStateContext orderStateContext;

    public OrderController(CustomerOrderRepository customerOrderRepository,
                           OrderStateContext orderStateContext) {
        this.customerOrderRepository = customerOrderRepository;
        this.orderStateContext = orderStateContext;
    }

    @GetMapping("/{orderId}")
    public CustomerOrder getOrderById(@PathVariable Long orderId) {
        return customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    @PostMapping("/{orderId}/advance")
    public CustomerOrder advanceOrderStatus(@PathVariable Long orderId) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String nextStatus = orderStateContext.getNextStatus(order.getStatus());
        order.setStatus(nextStatus);

        return customerOrderRepository.save(order);
    }
}