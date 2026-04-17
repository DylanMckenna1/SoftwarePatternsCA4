package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.OrderItemResponseDto;
import com.dylan.clothesstore.dto.OrderResponseDto;
import com.dylan.clothesstore.dto.RatingRequestDto;
import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.model.OrderItem;
import com.dylan.clothesstore.model.Rating;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import com.dylan.clothesstore.repository.RatingRepository;
import com.dylan.clothesstore.service.state.OrderStateContext;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

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
    public OrderResponseDto getOrderById(@PathVariable Long orderId) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        return mapToDto(order);
    }

    @PostMapping("/{orderId}/advance")
    public OrderResponseDto advanceOrderStatus(@PathVariable Long orderId) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String nextStatus = orderStateContext.getNextStatus(order.getStatus());
        order.setStatus(nextStatus);

        CustomerOrder savedOrder = customerOrderRepository.save(order);
        return mapToDto(savedOrder);
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

    private OrderResponseDto mapToDto(CustomerOrder order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());

        dto.setItems(order.getItems().stream().map(this::mapItemToDto).collect(Collectors.toList()));

        return dto;
    }

    private OrderItemResponseDto mapItemToDto(OrderItem item) {
        OrderItemResponseDto dto = new OrderItemResponseDto();
        dto.setProductId(item.getProduct().getId());
        dto.setProductTitle(item.getProduct().getTitle());
        dto.setQuantity(item.getQuantity());
        dto.setLineTotal(item.getLineTotal());
        return dto;
    }
}