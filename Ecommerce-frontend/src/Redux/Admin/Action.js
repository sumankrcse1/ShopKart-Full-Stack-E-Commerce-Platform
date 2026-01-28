import api from '../../config/api';
import * as actionTypes from './ActionType';

// Get Admin Dashboard Stats
export const getAdminStats = () => async (dispatch) => {
    dispatch({ type: actionTypes.GET_ADMIN_STATS_REQUEST });
    try {
        const { data } = await api.get('/api/admin/stats');
        dispatch({ type: actionTypes.GET_ADMIN_STATS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_ADMIN_STATS_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Get All Products (Admin)
export const getAdminProducts = (page = 0, size = 10) => async (dispatch) => {
    dispatch({ type: actionTypes.GET_ADMIN_PRODUCTS_REQUEST });
    try {
        const { data } = await api.get(`/api/admin/products/paginated?page=${page}&size=${size}`);
        dispatch({ type: actionTypes.GET_ADMIN_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_ADMIN_PRODUCTS_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Create Product
export const createProduct = (productData) => async (dispatch) => {
    dispatch({ type: actionTypes.CREATE_PRODUCT_REQUEST });
    try {
        const { data } = await api.post('/api/admin/products', productData);
        dispatch({ type: actionTypes.CREATE_PRODUCT_SUCCESS, payload: data });
        dispatch(getAdminProducts());
    } catch (error) {
        dispatch({ 
            type: actionTypes.CREATE_PRODUCT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Update Product
export const updateProduct = (productId, productData) => async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_PRODUCT_REQUEST });
    try {
        const { data } = await api.put(`/api/admin/products/${productId}`, productData);
        dispatch({ type: actionTypes.UPDATE_PRODUCT_SUCCESS, payload: data });
        dispatch(getAdminProducts());
    } catch (error) {
        dispatch({ 
            type: actionTypes.UPDATE_PRODUCT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Delete Product
export const deleteProduct = (productId) => async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_PRODUCT_REQUEST });
    try {
        await api.delete(`/api/admin/products/${productId}`);
        dispatch({ type: actionTypes.DELETE_PRODUCT_SUCCESS, payload: productId });
        dispatch(getAdminProducts());
    } catch (error) {
        dispatch({ 
            type: actionTypes.DELETE_PRODUCT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Get All Orders (Admin)
export const getAdminOrders = () => async (dispatch) => {
    dispatch({ type: actionTypes.GET_ADMIN_ORDERS_REQUEST });
    try {
        const { data } = await api.get('/api/admin/orders');
        dispatch({ type: actionTypes.GET_ADMIN_ORDERS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_ADMIN_ORDERS_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Update Order Status
export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_ORDER_STATUS_REQUEST });
    try {
        const { data } = await api.put(`/api/admin/orders/${orderId}/status`, { status });
        dispatch({ type: actionTypes.UPDATE_ORDER_STATUS_SUCCESS, payload: data });
        dispatch(getAdminOrders());
    } catch (error) {
        dispatch({ 
            type: actionTypes.UPDATE_ORDER_STATUS_FAILURE, 
            payload: error.response?.data||error.message 
        });
    }
};

// Delete Order
export const deleteOrder = (orderId) => async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_ORDER_REQUEST });
    try {
        await api.delete(`/api/admin/orders/${orderId}`);
        dispatch({ type: actionTypes.DELETE_ORDER_SUCCESS, payload: orderId });
        dispatch(getAdminOrders());
    } catch (error) {
        dispatch({ 
            type: actionTypes.DELETE_ORDER_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Get All Users (Admin)
export const getAdminUsers = () => async (dispatch) => {
    dispatch({ type: actionTypes.GET_ADMIN_USERS_REQUEST });
    try {
        const { data } = await api.get('/api/admin/users');
        dispatch({ type: actionTypes.GET_ADMIN_USERS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_ADMIN_USERS_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Delete User
export const deleteUser = (userId) => async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_USER_REQUEST });
    try {
        await api.delete(`/api/admin/users/${userId}`);
        dispatch({ type: actionTypes.DELETE_USER_SUCCESS, payload: userId });
        dispatch(getAdminUsers());
    } catch (error) {
        dispatch({ 
            type: actionTypes.DELETE_USER_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};

// Get Sales Report
export const getSalesReport = (startDate, endDate) => async (dispatch) => {
    dispatch({ type: actionTypes.GET_SALES_REPORT_REQUEST });
    try {
        const { data } = await api.get('/api/admin/reports/sales', {
            params: { startDate, endDate }
        });
        dispatch({ type: actionTypes.GET_SALES_REPORT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_SALES_REPORT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
};