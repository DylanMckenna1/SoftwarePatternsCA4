package com.dylan.clothesstore.service.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class NoDiscountStrategy implements PricingStrategy {

    @Override
    public BigDecimal calculatePrice(BigDecimal originalPrice) {
        return originalPrice;
    }
}