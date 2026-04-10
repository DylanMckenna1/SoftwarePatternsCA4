package com.dylan.clothesstore.service.strategy;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PricingContext {

    private final NoDiscountStrategy noDiscountStrategy;
    private final TenPercentDiscountStrategy tenPercentDiscountStrategy;

    public PricingContext(NoDiscountStrategy noDiscountStrategy,
                          TenPercentDiscountStrategy tenPercentDiscountStrategy) {
        this.noDiscountStrategy = noDiscountStrategy;
        this.tenPercentDiscountStrategy = tenPercentDiscountStrategy;
    }

    public BigDecimal calculatePrice(BigDecimal originalPrice, boolean discountApplied) {
        PricingStrategy strategy = discountApplied ? tenPercentDiscountStrategy : noDiscountStrategy;
        return strategy.calculatePrice(originalPrice);
    }
}