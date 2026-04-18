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

            Category jackets = categoryRepo.findByName("Jackets").orElseGet(() -> {
                Category category = new Category();
                category.setName("Jackets");
                return categoryRepo.save(category);
            });

            Category tracksuits = categoryRepo.findByName("Tracksuits").orElseGet(() -> {
                Category category = new Category();
                category.setName("Tracksuits");
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

            Manufacturer puma = manufacturerRepo.findByName("Puma").orElseGet(() -> {
                Manufacturer manufacturer = new Manufacturer();
                manufacturer.setName("Puma");
                return manufacturerRepo.save(manufacturer);
            });

            Manufacturer northFace = manufacturerRepo.findByName("The North Face").orElseGet(() -> {
                Manufacturer manufacturer = new Manufacturer();
                manufacturer.setName("The North Face");
                return manufacturerRepo.save(manufacturer);
            });

       seedProduct(productRepo, "Nike Hoodie", "Comfortable Nike hoodie", "59.99", 10,
        "images/Nike-hoodie.jpg",
        "M", "Black", hoodies, nike);

       seedProduct(productRepo, "Adidas T-Shirt", "Lightweight Adidas tee", "29.99", 20,
        "images/adidas-tshirt.jpg",
        "L", "White", tshirts, adidas);

       seedProduct(productRepo, "Puma Zip Hoodie", "Soft zip-up hoodie for everyday wear", "54.99", 14,
        "images/puma-hoodie.jpg",
        "M", "Grey", hoodies, puma);

       seedProduct(productRepo, "Nike Training T-Shirt", "Breathable training top", "34.99", 18,
        "images/nike-tshirt.jpg",
        "M", "Blue", tshirts, nike);

       seedProduct(productRepo, "Adidas Track Jacket", "Classic track jacket with zip front", "69.99", 12,
        "images/adidas-jacket.jpg",
        "L", "Navy", jackets, adidas);

       seedProduct(productRepo, "The North Face Puffer Jacket", "Warm puffer jacket for colder weather", "119.99", 8,
        "images/north-face-puffer.jpg",
        "L", "Black", jackets, northFace);

       seedProduct(productRepo, "Puma Tracksuit Bottoms", "Slim fit tracksuit bottoms", "44.99", 16, 
        "images/puma-bottoms.jpg",
        "M", "Charcoal", tracksuits, puma);

       seedProduct(productRepo, "Nike Full Tracksuit", "Matching hoodie and jogger set", "89.99", 9,
        "images/nike-tracksuit.jpg",
        "L", "Black", tracksuits, nike);
        };
    }

    private void seedProduct(ProductRepository productRepo,
                             String title,
                             String description,
                             String price,
                             int stockQuantity,
                             String imageUrl,
                             String size,
                             String colour,
                             Category category,
                             Manufacturer manufacturer) {

        productRepo.findByTitle(title).orElseGet(() -> {
            Product product = new Product();
            product.setTitle(title);
            product.setDescription(description);
            product.setPrice(new BigDecimal(price));
            product.setStockQuantity(stockQuantity);
            product.setImageUrl(imageUrl);
            product.setSize(size);
            product.setColour(colour);
            product.setCategory(category);
            product.setManufacturer(manufacturer);
            return productRepo.save(product);
        });
    }
}