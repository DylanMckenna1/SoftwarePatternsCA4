package com.dylan.clothesstore.config;

import com.dylan.clothesstore.model.*;
import com.dylan.clothesstore.repository.*;
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

            // Roles
            Role customer = new Role();
            customer.setName("CUSTOMER");
            roleRepo.save(customer);

            Role admin = new Role();
            admin.setName("ADMIN");
            roleRepo.save(admin);

            // Categories
            Category hoodies = new Category();
            hoodies.setName("Hoodies");
            categoryRepo.save(hoodies);

            Category tshirts = new Category();
            tshirts.setName("T-Shirts");
            categoryRepo.save(tshirts);

            // Manufacturer
            Manufacturer nike = new Manufacturer();
            nike.setName("Nike");
            manufacturerRepo.save(nike);

            Manufacturer adidas = new Manufacturer();
            adidas.setName("Adidas");
            manufacturerRepo.save(adidas);

            // Products
            Product p1 = new Product();
            p1.setTitle("Nike Hoodie");
            p1.setDescription("Comfortable Nike hoodie");
            p1.setPrice(new BigDecimal("59.99"));
            p1.setStockQuantity(10);
            p1.setCategory(hoodies);
            p1.setManufacturer(nike);
            productRepo.save(p1);

            Product p2 = new Product();
            p2.setTitle("Adidas T-Shirt");
            p2.setDescription("Lightweight Adidas tee");
            p2.setPrice(new BigDecimal("29.99"));
            p2.setStockQuantity(20);
            p2.setCategory(tshirts);
            p2.setManufacturer(adidas);
            productRepo.save(p2);
        };
    }
}