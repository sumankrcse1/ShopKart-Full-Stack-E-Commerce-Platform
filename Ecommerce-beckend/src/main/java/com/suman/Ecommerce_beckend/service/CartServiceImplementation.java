package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.CartItemException;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.Cart;
import com.suman.Ecommerce_beckend.model.CartItem;
import com.suman.Ecommerce_beckend.model.Product;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.CartRepository;
import com.suman.Ecommerce_beckend.request.AddItemRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImplementation implements CartService{

    private CartRepository cartRepository;
    private CartItemService cartItemService;
    private ProductService productService;

    public CartServiceImplementation(CartRepository cartRepository, CartItemService cartItemService, ProductService productService) {
        this.cartRepository = cartRepository;
        this.cartItemService = cartItemService;
        this.productService = productService;
    }

    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        Cart createdCart = cartRepository.save(cart);
        return createdCart;
    }

    @Transactional
    @Override
    public CartItem addCartItem(Long userId, AddItemRequest req) throws ProductException, CartItemException, UserException {

        Cart cart = cartRepository.findByUserId(userId);
        Product product = productService.findProductById(req.getProductId());

        CartItem existingItem = cartItemService.isCartItemExist(cart, product, req.getSize(), userId);

        if (existingItem != null) {
            // Set default quantity to 1 if null
            Integer quantityToAdd = req.getQuantity() != null ? req.getQuantity() : 1;

            existingItem.setQuantity(existingItem.getQuantity() + quantityToAdd);
            existingItem.setPrice(existingItem.getQuantity() * product.getPrice());
            existingItem.setDiscountedPrice(existingItem.getQuantity() * product.getDiscountPrice());

            return cartItemService.updateCartItem(userId, existingItem.getId(), existingItem);
        }

        // Set default quantity to 1 if null
        Integer quantity = req.getQuantity() != null ? req.getQuantity() : 1;

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setCart(cart);
        cartItem.setQuantity(quantity);
        cartItem.setUserId(userId);
        cartItem.setSize(req.getSize());
        cartItem.setPrice(quantity * product.getPrice());
        cartItem.setDiscountedPrice(quantity * product.getDiscountPrice());

        CartItem created = cartItemService.createCartItem(cartItem);
        cart.getCartItems().add(created);

        return created;
    }

    @Transactional
    @Override
    public Cart findUserCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);
        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for(CartItem cartsItem : cart.getCartItems()) {
            totalPrice += cartsItem.getPrice();
            totalDiscountedPrice += cartsItem.getDiscountedPrice();
            totalItem += cartsItem.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setDiscount(totalPrice - totalDiscountedPrice);
        cart.setTotalItem(totalItem);

        return cartRepository.save(cart);
    }
}