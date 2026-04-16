package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import com.dylan.clothesstore.service.state.OrderStateContext;
import org.springframework.web.bind.annotation.*;
import com.dylan.clothesstore.dto.RatingRequestDto;
import com.dylan.clothesstore.model.Rating;
import com.dylan.clothesstore.repository.RatingRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CustomerOrderRepository customerOrderRepository;
    private final OrderStateContext orderStateContext;
    private final RatingRepository ratingRepository;

    public OrderController(CustomerOrderRepository customerOrderRepository,
                       OrderStateContext orderStateContext,
                       RatingRepository ratingRepository) {
    this.customerOrderRepository = customerOrderRepository;
    this.orderStateContext = orderStateContext;
    this.ratingRepository = ratingRepository;
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

    @PostMapping("/{orderId}/rate")
    public Rating rateOrder(@PathVariable Long orderId, @RequestBody RatingRequestDto request) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Rating rating = new Rating();
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());
        rating.setCustomerOrder(order);

        return ratingRepository.save(rating);
    }

}