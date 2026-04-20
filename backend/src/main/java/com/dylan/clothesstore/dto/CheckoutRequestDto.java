package com.dylan.clothesstore.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

public class CheckoutRequestDto {

    private String email;
    private String customerName;
    private String shippingAddress;
    private String paymentMethod;

    public CheckoutRequestDto() {
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public CheckoutRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
