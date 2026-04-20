package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.ProductRequestDto;
import com.dylan.clothesstore.dto.ProductResponseDto;
import com.dylan.clothesstore.dto.RestockRequestDto;
import com.dylan.clothesstore.model.Category;
import com.dylan.clothesstore.model.Manufacturer;
import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.repository.CategoryRepository;
import com.dylan.clothesstore.repository.ManufacturerRepository;
import com.dylan.clothesstore.repository.ProductRepository;
import com.dylan.clothesstore.service.strategy.PricingContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final PricingContext pricingContext;

    public AdminProductController(ProductRepository productRepository,
                                  CategoryRepository categoryRepository,
                                  ManufacturerRepository manufacturerRepository,
                                  PricingContext pricingContext) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.pricingContext = pricingContext;
    }

    @GetMapping
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(product -> mapToDto(product, false))
                .toList();
    }

    @PostMapping
    public ProductResponseDto createProduct(@RequestBody ProductRequestDto request) {
        validateProductRequest(request);
        Product product = new Product();
        applyRequestToProduct(product, request);
        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct, false);
    }

    @PutMapping("/{id}")
    public ProductResponseDto updateProduct(@PathVariable Long id, @RequestBody ProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        validateProductRequest(request);
        applyRequestToProduct(product, request);
        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct, false);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        productRepository.delete(product);
        return "Product deleted successfully";
    }

    @PostMapping("/{id}/restock")
    public ProductResponseDto restockProduct(@PathVariable Long id, @RequestBody RestockRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Restock quantity must be greater than zero");
        }

        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        product.setStockQuantity(currentStock + request.getQuantity());

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct, false);
    }

    private void validateProductRequest(ProductRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Product details are required");
        }

        if (!hasText(request.getTitle())) {
            throw new IllegalArgumentException("Product title is required");
        }

        if (!hasText(request.getDescription())) {
            throw new IllegalArgumentException("Product description is required");
        }

        if (request.getPrice() == null || request.getPrice().signum() <= 0) {
            throw new IllegalArgumentException("Product price must be greater than zero");
        }

        if (request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }

        if (!hasText(request.getImageUrl())) {
            throw new IllegalArgumentException("Product image URL is required");
        }

        if (!hasText(request.getSize())) {
            throw new IllegalArgumentException("Product size is required");
        }

        if (!hasText(request.getColour())) {
            throw new IllegalArgumentException("Product colour is required");
        }

        if (!hasText(request.getCategoryName())) {
            throw new IllegalArgumentException("Product category is required");
        }

        if (!hasText(request.getManufacturerName())) {
            throw new IllegalArgumentException("Product manufacturer is required");
        }
    }

    private void applyRequestToProduct(Product product, ProductRequestDto request) {
        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setName(request.getCategoryName());
                    return categoryRepository.save(newCategory);
                });

        Manufacturer manufacturer = manufacturerRepository.findByName(request.getManufacturerName())
                .orElseGet(() -> {
                    Manufacturer newManufacturer = new Manufacturer();
                    newManufacturer.setName(request.getManufacturerName());
                    return manufacturerRepository.save(newManufacturer);
                });

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setSize(request.getSize());
        product.setColour(request.getColour());
        product.setCategory(category);
        product.setManufacturer(manufacturer);
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

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
