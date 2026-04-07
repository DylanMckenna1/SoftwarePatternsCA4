package com.dylan.clothesstore.repository;

import com.dylan.clothesstore.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByTitle(String title);

    List<Product> findByTitleContainingIgnoreCase(String title);

    List<Product> findByCategory_NameContainingIgnoreCase(String categoryName);

    List<Product> findByManufacturer_NameContainingIgnoreCase(String manufacturerName);

    List<Product> findByTitleContainingIgnoreCase(String title, Sort sort);

    List<Product> findByCategory_NameContainingIgnoreCase(String categoryName, Sort sort);

    List<Product> findByManufacturer_NameContainingIgnoreCase(String manufacturerName, Sort sort);
}