package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.CheckoutRequestDto;
import com.dylan.clothesstore.dto.CheckoutResponseDto;
import com.dylan.clothesstore.service.facade.CheckoutFacade;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutFacade checkoutFacade;

    public CheckoutController(CheckoutFacade checkoutFacade) {
        this.checkoutFacade = checkoutFacade;
    }

    @PostMapping
    public CheckoutResponseDto checkout(@RequestBody CheckoutRequestDto request) {
        return checkoutFacade.checkout(
                request.getEmail(),
                request.getCustomerName(),
                request.getShippingAddress(),
                request.getPaymentMethod()
        );
    }
}
