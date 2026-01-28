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
} from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    forgotPasswordMessage: null,
    forgotPasswordError: null,
    resetPasswordMessage: null,
    resetPasswordError: null,
    isTokenValid: null,
    isValidatingToken: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
            return { ...state, isLoading: true, error: null };
            
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            // ✅ FIXED: Extract JWT from user object and set both user and jwt
            return { 
                ...state, 
                isLoading: false, 
                error: null, 
                jwt: action.payload.jwt,
                user: action.payload  // Store the full user object
            };
            
        case GET_USER_SUCCESS:
            return { ...state, isLoading: false, error: null, user: action.payload };
            
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
            
        case LOGOUT:
            localStorage.removeItem("jwt");
            return { ...initialState };
            
        case FORGOT_PASSWORD_REQUEST:
            return { 
                ...state, 
                isLoading: true, 
                forgotPasswordMessage: null, 
                forgotPasswordError: null 
            };
            
        case FORGOT_PASSWORD_SUCCESS:
            return { 
                ...state, 
                isLoading: false, 
                forgotPasswordMessage: action.payload,
                forgotPasswordError: null
            };
            
        case FORGOT_PASSWORD_FAILURE:
            return { 
                ...state, 
                isLoading: false, 
                forgotPasswordError: action.payload,
                forgotPasswordMessage: null
            };
            
        case RESET_PASSWORD_REQUEST:
            return { 
                ...state, 
                isLoading: true, 
                resetPasswordMessage: null, 
                resetPasswordError: null 
            };
            
        case RESET_PASSWORD_SUCCESS:
            return { 
                ...state, 
                isLoading: false, 
                resetPasswordMessage: action.payload,
                resetPasswordError: null
            };
            
        case RESET_PASSWORD_FAILURE:
            return { 
                ...state, 
                isLoading: false, 
                resetPasswordError: action.payload,
                resetPasswordMessage: null
            };
            
        case VALIDATE_TOKEN_REQUEST:
            return { 
                ...state, 
                isValidatingToken: true, 
                isTokenValid: null 
            };
            
        case VALIDATE_TOKEN_SUCCESS:
            return { 
                ...state, 
                isValidatingToken: false, 
                isTokenValid: action.payload 
            };
            
        case VALIDATE_TOKEN_FAILURE:
            return { 
                ...state, 
                isValidatingToken: false, 
                isTokenValid: false 
            };
            
        // NEW: Clear Messages
        case CLEAR_PASSWORD_MESSAGES:
            return {
                ...state,
                forgotPasswordMessage: null,
                forgotPasswordError: null,
                resetPasswordMessage: null,
                resetPasswordError: null
            };
            
        default:
            return state;
    }
};

export default authReducer;