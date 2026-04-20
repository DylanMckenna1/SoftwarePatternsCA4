package com.dylan.clothesstore.service.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TenPercentDiscountStrategy implements PricingStrategy {

    @Override
    public BigDecimal calculatePrice(BigDecimal originalPrice) {
        return originalPrice.multiply(BigDecimal.valueOf(0.90)).setScale(2, RoundingMode.HALF_UP);
    }
}
