package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.Product;
import com.suman.Ecommerce_beckend.request.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.sql.SQLException;
import java.util.List;

public interface ProductService {

    // only for admin
    public Product createProduct(CreateProductRequest req) throws ProductException, SQLException;

    public String deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId,Product product)throws ProductException;

    public List<Product> findAllProducts();

    // for user and admin both

    public Product findProductById(Long id) throws ProductException;

    public List<Product> findProductByCategory(String Category);

    public Page<Product> getAllProduct(String category,List<String> colors,List<String> sizes,Integer minPrice,Integer maxPrice,
                                       Integer minDiscount,String sort,String stock,
                                       Integer pageNumber,Integer pageSize);


}
