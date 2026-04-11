package com.dylan.clothesstore.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutResponseDto {

    private Long orderId;
    private BigDecimal totalAmount;
    private String status;
    private int itemCount;
}