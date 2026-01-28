package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.CartItemException;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.Cart;
import com.suman.Ecommerce_beckend.model.CartItem;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.AddItemRequest;

public interface CartService {
    public Cart createCart(User user);

    public CartItem addCartItem(Long userId, AddItemRequest req) throws ProductException, CartItemException, UserException;

    public Cart findUserCart(Long userId);
}
