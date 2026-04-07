package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        Sort sort = Sort.unsorted();

        if (sortBy != null && !sortBy.isBlank()) {
            Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            sort = Sort.by(sortDirection, sortBy);
        }

        if (title != null && !title.isBlank()) {
            return sort.isSorted()
                    ? productRepository.findByTitleContainingIgnoreCase(title, sort)
                    : productRepository.findByTitleContainingIgnoreCase(title);
        }

        if (category != null && !category.isBlank()) {
            return sort.isSorted()
                    ? productRepository.findByCategory_NameContainingIgnoreCase(category, sort)
                    : productRepository.findByCategory_NameContainingIgnoreCase(category);
        }

        if (manufacturer != null && !manufacturer.isBlank()) {
            return sort.isSorted()
                    ? productRepository.findByManufacturer_NameContainingIgnoreCase(manufacturer, sort)
                    : productRepository.findByManufacturer_NameContainingIgnoreCase(manufacturer);
        }

        return sort.isSorted()
                ? productRepository.findAll(sort)
                : productRepository.findAll();
    }
}