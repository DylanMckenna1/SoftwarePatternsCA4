package com.dylan.clothesstore.config;

import com.dylan.clothesstore.model.Category;
import com.dylan.clothesstore.model.Manufacturer;
import com.dylan.clothesstore.model.Product;
import com.dylan.clothesstore.model.Role;
import com.dylan.clothesstore.repository.CategoryRepository;
import com.dylan.clothesstore.repository.ManufacturerRepository;
import com.dylan.clothesstore.repository.ProductRepository;
import com.dylan.clothesstore.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(RoleRepository roleRepo,
                               CategoryRepository categoryRepo,
                               ManufacturerRepository manufacturerRepo,
                               ProductRepository productRepo) {

        return args -> {

            Role customer = roleRepo.findByName("CUSTOMER").orElseGet(() -> {
                Role role = new Role();
                role.setName("CUSTOMER");
                return roleRepo.save(role);
            });

            Role admin = roleRepo.findByName("ADMIN").orElseGet(() -> {
                Role role = new Role();
                role.setName("ADMIN");
                return roleRepo.save(role);
            });

            Category hoodies = categoryRepo.findByName("Hoodies").orElseGet(() -> {
                Category category = new Category();
                category.setName("Hoodies");
                return categoryRepo.save(category);
            });

            Category tshirts = categoryRepo.findByName("T-Shirts").orElseGet(() -> {
                Category category = new Category();
                category.setName("T-Shirts");
                return categoryRepo.save(category);
            });

            Manufacturer nike = manufacturerRepo.findByName("Nike").orElseGet(() -> {
                Manufacturer manufacturer = new Manufacturer();
                manufacturer.setName("Nike");
                return manufacturerRepo.save(manufacturer);
            });

            Manufacturer adidas = manufacturerRepo.findByName("Adidas").orElseGet(() -> {
                Manufacturer manufacturer = new Manufacturer();
                manufacturer.setName("Adidas");
                return manufacturerRepo.save(manufacturer);
            });

            productRepo.findByTitle("Nike Hoodie").orElseGet(() -> {
                Product product = new Product();
                product.setTitle("Nike Hoodie");
                product.setDescription("Comfortable Nike hoodie");
                product.setPrice(new BigDecimal("59.99"));
                product.setStockQuantity(10);
                product.setCategory(hoodies);
                product.setManufacturer(nike);
                return productRepo.save(product);
            });

            productRepo.findByTitle("Adidas T-Shirt").orElseGet(() -> {
                Product product = new Product();
                product.setTitle("Adidas T-Shirt");
                product.setDescription("Lightweight Adidas tee");
                product.setPrice(new BigDecimal("29.99"));
                product.setStockQuantity(20);
                product.setCategory(tshirts);
                product.setManufacturer(adidas);
                return productRepo.save(product);
            });
        };
    }
}