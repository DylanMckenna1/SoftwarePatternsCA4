package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.AdminOrderResponseDto;
import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dylan.clothesstore.service.state.OrderStateContext;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final CustomerOrderRepository customerOrderRepository;
    private final OrderStateContext orderStateContext;

    public AdminOrderController(CustomerOrderRepository customerOrderRepository,
                            OrderStateContext orderStateContext) {
    this.customerOrderRepository = customerOrderRepository;
    this.orderStateContext = orderStateContext;
}

    @GetMapping
     public List<AdminOrderResponseDto> getAllOrders() {
        return customerOrderRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @PutMapping("/{id}/advance")
     public AdminOrderResponseDto advanceOrderStatus(@PathVariable Long id) {
      CustomerOrder order = customerOrderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

      String nextStatus = orderStateContext.getNextStatus(order.getStatus());
       order.setStatus(nextStatus);

      CustomerOrder savedOrder = customerOrderRepository.save(order);
    return mapToDto(savedOrder);
}

    private AdminOrderResponseDto mapToDto(CustomerOrder order) {
        AdminOrderResponseDto dto = new AdminOrderResponseDto();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setItemCount(order.getItems() != null ? order.getItems().size() : 0);

        if (order.getUser() != null) {
            dto.setCustomerEmail(order.getUser().getEmail());
            dto.setCustomerName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        } else {
            dto.setCustomerEmail("N/A");
            dto.setCustomerName("Guest / Legacy Order");
        }

        return dto;
    }
}