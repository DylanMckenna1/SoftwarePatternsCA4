package com.dylan.clothesstore.service.strategy;

import java.math.BigDecimal;

public interface PricingStrategy {
    BigDecimal calculatePrice(BigDecimal originalPrice);
}