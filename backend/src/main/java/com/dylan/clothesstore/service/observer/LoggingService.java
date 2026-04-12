package com.dylan.clothesstore.service.observer;

import org.springframework.stereotype.Component;

@Component
public class LoggingService implements OrderObserver {

    @Override
    public void update(String message) {
        System.out.println("Log: " + message);
    }
}