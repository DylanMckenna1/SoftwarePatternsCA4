package com.dylan.clothesstore;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class ClothesstoreApplicationTests {

	@Test
	void applicationMainMethodIsPresent() {
		assertDoesNotThrow(() -> ClothesstoreApplication.class.getDeclaredMethod("main", String[].class));
	}

}
