package com.dylan.clothesstore.repository;

import com.dylan.clothesstore.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}