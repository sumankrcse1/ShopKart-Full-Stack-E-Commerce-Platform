// Redux/Customers/Cart/Action.js

import { API_BASE_URL } from '../../../config/api';
import {
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  ADD_ITEM_TO_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
} from './ActionType';
import axios from 'axios';

// Add item to cart
export const addItemToCart = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
  
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/cart/add`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
    
    // Refresh cart after adding item
    dispatch(getCart());
  } catch (error) {
    console.error('Error adding item to cart:', error.response?.data || error.message);
    dispatch({
      type: ADD_ITEM_TO_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get cart
export const getCart = () => async (dispatch) => {
  dispatch({ type: GET_CART_REQUEST });
  
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/cart/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    
    console.log('Cart fetched:', data);
    dispatch({ type: GET_CART_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error fetching cart:', error.response?.data || error.message);
    dispatch({
      type: GET_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Remove item from cart
export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  
  try {
    const { data } = await axios.delete(
      `${API_BASE_URL}/api/cart_items/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      }
    );
    
    console.log('Item removed from cart:', data);
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
    
    // Refresh cart after removing item
    dispatch(getCart());
  } catch (error) {
    console.error('Error removing item:', error.response?.data || error.message);
    dispatch({
      type: REMOVE_CART_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update cart item
export const updateCartItem = (cartItemId, reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/cart_items/${cartItemId}`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // console.log('Cart item updated:', data);
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
    
    // Refresh cart after updating item
    dispatch(getCart());
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    dispatch({
      type: UPDATE_CART_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};