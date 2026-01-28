package com.suman.Ecommerce_beckend.controller;

import com.suman.Ecommerce_beckend.model.Product;
import com.suman.Ecommerce_beckend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CommonController {
    private ProductService productService;

    public CommonController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> findAllProduct() {

        List<Product> products = productService.findAllProducts();

        return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
    }
}
