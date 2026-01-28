import axios from 'axios';
import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    LOGOUT,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    VALIDATE_TOKEN_REQUEST,
    VALIDATE_TOKEN_SUCCESS,
    VALIDATE_TOKEN_FAILURE,
    CLEAR_PASSWORD_MESSAGES
} from './ActionType';
import api, { API_BASE_URL } from '../../config/api';

// Helper function to extract error message from various error formats
const getErrorMessage = (error) => {
    console.log('🔍 Full error object:', error);
    console.log('🔍 Error response:', error.response);
    console.log('🔍 Error response data:', error.response?.data);
    
    // Backend returned an error response (4xx, 5xx)
    if (error.response) {
        const { data, status } = error.response;
        
        // Try different possible error message locations
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (data?.detail) return data.detail;
        if (typeof data === 'string') return data;
        
        // Fallback to status-based messages
        if (status === 401) return 'Invalid email or password';
        if (status === 403) return 'Access denied';
        if (status === 404) return 'User not found';
        if (status === 500) return 'Server error. Please try again later';
    }
    
    // Network error (no response from server)
    if (error.request) {
        return 'Network error. Please check your internet connection';
    }
    
    // Something else went wrong
    return error.message || 'An unexpected error occurred';
};

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
    dispatch(registerRequest());
    try {
        console.log('📝 Registering user:', userData.email);
        
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
        const user = response.data;
        
        console.log('✅ Registration response:', user);
        
        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt);
            dispatch(registerSuccess(user));
            
            // Fetch complete user profile
            await dispatch(getUser(user.jwt));
        } else {
            throw new Error('No JWT token received from server');
        }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('❌ Registration error:', errorMessage);
        
        // Clean up on error
        localStorage.removeItem("jwt");
        
        dispatch(registerFailure(errorMessage));
    }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = error => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async dispatch => {
    dispatch(loginRequest());
    try {
        console.log('🔐 Attempting login for:', userData.email);
        
        const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
        const user = response.data;
        
        console.log('✅ Login response:', user);
        
        if (user.jwt) {
            // Store JWT first
            localStorage.setItem("jwt", user.jwt);
            
            // Dispatch login success with the response data
            dispatch(loginSuccess(user));
            
            // Fetch complete user profile - use await to ensure it completes
            await dispatch(getUser(user.jwt));
            
            console.log('✅ Login flow completed successfully');
        } else {
            throw new Error('No JWT token received from server');
        }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('❌ Login error:', errorMessage);
        
        // Clear any stale tokens on error
        localStorage.removeItem("jwt");
        
        dispatch(loginFailure(errorMessage));
    }
};

// Get user from token
const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = user => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = error => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = (token) => {
    return async (dispatch) => {
        dispatch(getUserRequest());
        try {
            console.log('👤 Fetching user profile with token');
            
            const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            const user = response.data;
            console.log('✅ User fetched successfully:', user);
            
            dispatch(getUserSuccess(user));
            return user;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('❌ Error fetching user:', errorMessage);
            
            // If token is invalid (401/403), clear it from localStorage
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('🔒 Invalid token detected, clearing localStorage');
                localStorage.removeItem("jwt");
            }
            
            dispatch(getUserFailure(errorMessage));
            throw error; // Re-throw so caller knows it failed
        }
    };
};

export const logout = () => {
    return async (dispatch) => {
        console.log('👋 Logging out user');
        dispatch({ type: LOGOUT });
        localStorage.clear();
    };
};

const forgotPasswordRequest = () => ({ type: FORGOT_PASSWORD_REQUEST });
const forgotPasswordSuccess = (message) => ({ type: FORGOT_PASSWORD_SUCCESS, payload: message });
const forgotPasswordFailure = (error) => ({ type: FORGOT_PASSWORD_FAILURE, payload: error });

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(forgotPasswordRequest());
    try {
        console.log('📧 Sending password reset email to:', email);
        
        const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
        
        console.log('✅ Password reset email sent');
        dispatch(forgotPasswordSuccess(response.data.message));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('❌ Forgot password error:', errorMessage);
        dispatch(forgotPasswordFailure(errorMessage));
    }
};

const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });
const resetPasswordSuccess = (message) => ({ type: RESET_PASSWORD_SUCCESS, payload: message });
const resetPasswordFailure = (error) => ({ type: RESET_PASSWORD_FAILURE, payload: error });

export const resetPassword = (token, newPassword) => async (dispatch) => {
    dispatch(resetPasswordRequest());
    try {
        console.log('🔑 Resetting password with token');
        
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
            token,
            newPassword
        });
        
        console.log('✅ Password reset successful');
        dispatch(resetPasswordSuccess(response.data.message));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('❌ Reset password error:', errorMessage);
        dispatch(resetPasswordFailure(errorMessage));
    }
};

// Validate Token Actions
const validateTokenRequest = () => ({ type: VALIDATE_TOKEN_REQUEST });
const validateTokenSuccess = (isValid) => ({ type: VALIDATE_TOKEN_SUCCESS, payload: isValid });
const validateTokenFailure = () => ({ type: VALIDATE_TOKEN_FAILURE });

export const validateResetToken = (token) => async (dispatch) => {
    dispatch(validateTokenRequest());
    try {
        console.log('🔍 Validating reset token');
        
        const response = await axios.get(`${API_BASE_URL}/auth/validate-reset-token?token=${token}`);
        
        console.log('✅ Token validation result:', response.data.valid);
        dispatch(validateTokenSuccess(response.data.valid));
    } catch (error) {
        console.error('❌ Token validation failed');
        dispatch(validateTokenFailure());
    }
};

// Clear Messages
export const clearPasswordMessages = () => ({
    type: CLEAR_PASSWORD_MESSAGES
});