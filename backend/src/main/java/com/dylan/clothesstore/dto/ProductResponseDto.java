package com.dylan.clothesstore.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponseDto {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal discountedPrice;
    private Integer stockQuantity;
    private String imageUrl;
    private String size;
    private String colour;
    private String categoryName;
    private String manufacturerName;
}