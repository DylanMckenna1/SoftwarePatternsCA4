package com.dylan.clothesstore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;

    private String comment;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private CustomerOrder customerOrder;

    public Rating() {
    }

    public Rating(int score, String comment, CustomerOrder customerOrder) {
        this.score = score;
        this.comment = comment;
        this.customerOrder = customerOrder;
    }

    public Long getId() {
        return id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }
}