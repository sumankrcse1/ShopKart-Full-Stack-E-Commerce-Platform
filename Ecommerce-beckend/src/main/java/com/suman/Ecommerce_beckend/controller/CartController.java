package com.suman.Ecommerce_beckend.controller;

import com.suman.Ecommerce_beckend.exception.CartItemException;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.Cart;
import com.suman.Ecommerce_beckend.model.CartItem;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.AddItemRequest;
import com.suman.Ecommerce_beckend.service.CartService;
import com.suman.Ecommerce_beckend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private CartService cartService;
    private UserService userService;

    public CartController(CartService cartService,UserService userService) {
        this.cartService=cartService;
        this.userService=userService;
    }

    @GetMapping("/")
    public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws UserException {

        User user=userService.findUserProfileByJwt(jwt);

        Cart cart=cartService.findUserCart(user.getId());

        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddItemRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ProductException, CartItemException {

        User user=userService.findUserProfileByJwt(jwt);

        CartItem createdCartItem = cartService.addCartItem(user.getId(), req);

        return new ResponseEntity<>(createdCartItem,HttpStatus.ACCEPTED);

    }
}
