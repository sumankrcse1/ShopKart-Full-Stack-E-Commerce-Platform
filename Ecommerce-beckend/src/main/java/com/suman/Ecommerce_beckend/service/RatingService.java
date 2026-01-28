package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.Rating;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.RatingRequest;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RatingService {
    public Rating createRating(RatingRequest req, User user) throws ProductException;

    public List<Rating> getProductsRating(Long productId);
}
