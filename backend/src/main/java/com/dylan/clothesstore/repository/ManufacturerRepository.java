package com.dylan.clothesstore.repository;

import com.dylan.clothesstore.model.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {
}