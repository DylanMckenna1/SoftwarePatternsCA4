package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.ProductResponseDto;
import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.repository.ProductRepository;
import com.dylan.clothesstore.service.strategy.PricingContext;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final PricingContext pricingContext;

    public ProductController(ProductRepository productRepository, PricingContext pricingContext) {
        this.productRepository = productRepository;
        this.pricingContext = pricingContext;
    }

    @GetMapping
    public List<ProductResponseDto> getAllProducts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction,
            @RequestParam(defaultValue = "false") boolean discount
    ) {
        Sort sort = Sort.unsorted();

        if (sortBy != null && !sortBy.isBlank()) {
            Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            sort = Sort.by(sortDirection, sortBy);
        }

        List<Product> products;

        if (title != null && !title.isBlank()) {
            products = sort.isSorted()
                    ? productRepository.findByTitleContainingIgnoreCase(title, sort)
                    : productRepository.findByTitleContainingIgnoreCase(title);
        } else if (category != null && !category.isBlank()) {
            products = sort.isSorted()
                    ? productRepository.findByCategory_NameContainingIgnoreCase(category, sort)
                    : productRepository.findByCategory_NameContainingIgnoreCase(category);
        } else if (manufacturer != null && !manufacturer.isBlank()) {
            products = sort.isSorted()
                    ? productRepository.findByManufacturer_NameContainingIgnoreCase(manufacturer, sort)
                    : productRepository.findByManufacturer_NameContainingIgnoreCase(manufacturer);
        } else {
            products = sort.isSorted()
                    ? productRepository.findAll(sort)
                    : productRepository.findAll();
        }

        return products.stream()
                .map(product -> mapToDto(product, discount))
                .toList();
    }

    private ProductResponseDto mapToDto(Product product, boolean discount) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountedPrice(pricingContext.calculatePrice(product.getPrice(), discount));
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setSize(product.getSize());
        dto.setColour(product.getColour());
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setManufacturerName(product.getManufacturer() != null ? product.getManufacturer().getName() : null);
        return dto;
    }
}