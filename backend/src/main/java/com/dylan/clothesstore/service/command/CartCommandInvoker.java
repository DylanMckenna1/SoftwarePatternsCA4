package com.dylan.clothesstore.service.command;

import org.springframework.stereotype.Service;

@Service
public class CartCommandInvoker {

    public void executeCommand(CartCommand command) {
        command.execute();
    }
}