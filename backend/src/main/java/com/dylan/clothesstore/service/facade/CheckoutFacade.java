package com.dylan.clothesstore.service.facade;

import com.dylan.clothesstore.dto.CheckoutResponseDto;
import com.dylan.clothesstore.model.CustomerOrder;
import com.dylan.clothesstore.model.OrderItem;
import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.model.User;
import com.dylan.clothesstore.repository.CustomerOrderRepository;
import com.dylan.clothesstore.repository.ProductRepository;
import com.dylan.clothesstore.repository.UserRepository;
import com.dylan.clothesstore.service.CartService;
import com.dylan.clothesstore.service.observer.OrderObserver;
import com.dylan.clothesstore.service.strategy.PricingContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CheckoutFacade {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final PricingContext pricingContext;
    private final List<OrderObserver> observers;
    private final UserRepository userRepository;

    public CheckoutFacade(CartService cartService,
                          ProductRepository productRepository,
                          CustomerOrderRepository customerOrderRepository,
                          PricingContext pricingContext,
                          List<OrderObserver> observers,
                          UserRepository userRepository) {
        this.cartService = cartService;
        this.productRepository = productRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.pricingContext = pricingContext;
        this.observers = observers;
        this.userRepository = userRepository;
    }

    @Transactional
    public CheckoutResponseDto checkout(String email,
                                    String customerName,
                                    String shippingAddress,
                                    String paymentMethod)   {
        Map<Long, Integer> cart = cartService.getCart();

        if (cart.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!hasText(customerName) || !hasText(shippingAddress) || !hasText(paymentMethod)) {
            throw new IllegalArgumentException("Please complete all checkout details.");
        }

        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setOrderDate(LocalDateTime.now());
        customerOrder.setStatus("PLACED");
        customerOrder.setUser(user);
        customerOrder.setCustomerName(customerName);
        customerOrder.setShippingAddress(shippingAddress);
        customerOrder.setPaymentMethod(paymentMethod);

        BigDecimal total = BigDecimal.ZERO;
        int itemCount = 0;

        for (Map.Entry<Long, Integer> entry : cart.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

            if (quantity == null || quantity <= 0) {
                throw new IllegalArgumentException("Invalid quantity for product: " + product.getTitle());
            }

            if (product.getStockQuantity() == null || product.getStockQuantity() < quantity) {
                throw new IllegalStateException("Not enough stock for product: " + product.getTitle());
            }

            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);

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

        for (OrderObserver observer : observers) {
            observer.update(
                    "New order placed. Order ID: " + savedOrder.getId()
                            + ", Customer: " + user.getEmail()
                            + ", Total: " + savedOrder.getTotalAmount()
            );
        }

        CheckoutResponseDto response = new CheckoutResponseDto();
        response.setOrderId(savedOrder.getId());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setStatus(savedOrder.getStatus());
        response.setItemCount(itemCount);

        return response;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
