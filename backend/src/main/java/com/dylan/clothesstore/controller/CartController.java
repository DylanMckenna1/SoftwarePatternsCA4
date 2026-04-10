package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Map<Long, Integer> getCart() {
        return cartService.getCart();
    }

    @PostMapping("/add/{productId}")
    public String addToCart(@PathVariable Long productId) {
        cartService.addToCart(productId);
        return "Product added to cart";
    }

    @PostMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId) {
        cartService.removeFromCart(productId);
        return "Product removed from cart";
    }

    @PostMapping("/clear")
    public String clearCart() {
        cartService.clearCart();
        return "Cart cleared";
    }
}