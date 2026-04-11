package com.dylan.clothesstore.service.facade;

import com.dylan.clothesstore.dto.CheckoutResponseDto;
import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.model.OrderItem;
import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import com.dylan.clothesstore.repository.ProductRepository;
import com.dylan.clothesstore.service.CartService;
import com.dylan.clothesstore.service.strategy.PricingContext;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CheckoutFacade {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final PricingContext pricingContext;

    public CheckoutFacade(CartService cartService,
                          ProductRepository productRepository,
                          CustomerOrderRepository customerOrderRepository,
                          PricingContext pricingContext) {
        this.cartService = cartService;
        this.productRepository = productRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.pricingContext = pricingContext;
    }

    public CheckoutResponseDto checkout() {
        Map<Long, Integer> cart = cartService.getCart();

        if (cart.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setOrderDate(LocalDateTime.now());
        customerOrder.setStatus("PLACED");

        BigDecimal total = BigDecimal.ZERO;
        int itemCount = 0;

        for (Map.Entry<Long, Integer> entry : cart.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

            BigDecimal discountedPrice = pricingContext.calculatePrice(product.getPrice(), true);
            BigDecimal lineTotal = discountedPrice.multiply(BigDecimal.valueOf(quantity));

            OrderItem orderItem = new OrderItem();
            orderItem.setCustomerOrder(customerOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setLineTotal(lineTotal);

            customerOrder.getItems().add(orderItem);

            total = total.add(lineTotal);
            itemCount += quantity;
        }

        customerOrder.setTotalAmount(total);

        CustomerOrder savedOrder = customerOrderRepository.save(customerOrder);

        cartService.clearCart();

        CheckoutResponseDto response = new CheckoutResponseDto();
        response.setOrderId(savedOrder.getId());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setStatus(savedOrder.getStatus());
        response.setItemCount(itemCount);

        return response;
    }
}