package com.suman.Ecommerce_beckend.controller;

import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.Review;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.ReviewRequest;
import com.suman.Ecommerce_beckend.service.ReviewService;
import com.suman.Ecommerce_beckend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
public class ReviewController {
    private ReviewService reviewService;
    private UserService userService;

    public ReviewController(ReviewService reviewService,UserService userService) {
        this.reviewService=reviewService;
        this.userService=userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User user=userService.findUserProfileByJwt(jwt);
        Review review=reviewService.createReview(req, user);
        return new ResponseEntity<Review>(review, HttpStatus.ACCEPTED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductsReview(@PathVariable Long productId){
        List<Review>reviews=reviewService.getAllReview(productId);
        return new ResponseEntity<List<Review>>(reviews,HttpStatus.ACCEPTED);
    }
}
