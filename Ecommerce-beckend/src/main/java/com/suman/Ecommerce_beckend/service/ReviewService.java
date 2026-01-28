package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.Review;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.ReviewRequest;

import java.util.List;

public interface ReviewService {
    public Review createReview(ReviewRequest req, User user) throws ProductException;

    public List<Review> getAllReview(Long productId);
}
