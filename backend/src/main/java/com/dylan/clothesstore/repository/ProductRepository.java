package com.dylan.clothesstore.repository;

import com.dylan.clothesstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}