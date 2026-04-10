package com.dylan.clothesstore.service.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TenPercentDiscountStrategy implements PricingStrategy {

    @Override
    public BigDecimal calculatePrice(BigDecimal originalPrice) {
        return originalPrice.multiply(BigDecimal.valueOf(0.90));
    }
}