import * as actionTypes from './ActionType';

const initialState = {
    stats: null,
    products: [],
    orders: [],
    users: [],
    salesReport: null,
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        // Stats
        case actionTypes.GET_ADMIN_STATS_REQUEST:
            return { ...state, isLoading: true, error: null };
        case actionTypes.GET_ADMIN_STATS_SUCCESS:
            return { ...state, isLoading: false, stats: action.payload };
        case actionTypes.GET_ADMIN_STATS_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        // Products
        case actionTypes.GET_ADMIN_PRODUCTS_REQUEST:
        case actionTypes.CREATE_PRODUCT_REQUEST:
        case actionTypes.UPDATE_PRODUCT_REQUEST:
        case actionTypes.DELETE_PRODUCT_REQUEST:
            return { ...state, isLoading: true, error: null };
            
        case actionTypes.GET_ADMIN_PRODUCTS_SUCCESS:
            return { 
                ...state, 
                isLoading: false, 
                products: action.payload.content || action.payload,
                totalPages: action.payload.totalPages || 0,
                currentPage: action.payload.number || 0
            };
            
        case actionTypes.CREATE_PRODUCT_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                products: [...state.products, action.payload]
            };
            
        case actionTypes.UPDATE_PRODUCT_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                products: state.products.map(p => 
                    p.id === action.payload.id ? action.payload : p
                )
            };
            
        case actionTypes.DELETE_PRODUCT_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                products: state.products.filter(p => p.id !== action.payload)
            };
            
        case actionTypes.GET_ADMIN_PRODUCTS_FAILURE:
        case actionTypes.CREATE_PRODUCT_FAILURE:
        case actionTypes.UPDATE_PRODUCT_FAILURE:
        case actionTypes.DELETE_PRODUCT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        // Orders
        case actionTypes.GET_ADMIN_ORDERS_REQUEST:
        case actionTypes.UPDATE_ORDER_STATUS_REQUEST:
        case actionTypes.DELETE_ORDER_REQUEST:
            return { ...state, isLoading: true, error: null };
            
        case actionTypes.GET_ADMIN_ORDERS_SUCCESS:
            return { ...state, isLoading: false, orders: action.payload };
            
        case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                orders: state.orders.map(o => 
                    o.id === action.payload.id ? action.payload : o
                )
            };
            
        case actionTypes.DELETE_ORDER_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                orders: state.orders.filter(o => o.id !== action.payload)
            };
            
        case actionTypes.GET_ADMIN_ORDERS_FAILURE:
        case actionTypes.UPDATE_ORDER_STATUS_FAILURE:
        case actionTypes.DELETE_ORDER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        // Users
        case actionTypes.GET_ADMIN_USERS_REQUEST:
        case actionTypes.DELETE_USER_REQUEST:
            return { ...state, isLoading: true, error: null };
            
        case actionTypes.GET_ADMIN_USERS_SUCCESS:
            return { ...state, isLoading: false, users: action.payload };
            
        case actionTypes.DELETE_USER_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                users: state.users.filter(u => u.id !== action.payload)
            };
            
        case actionTypes.GET_ADMIN_USERS_FAILURE:
        case actionTypes.DELETE_USER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        // Sales Report
        case actionTypes.GET_SALES_REPORT_REQUEST:
            return { ...state, isLoading: true, error: null };
        case actionTypes.GET_SALES_REPORT_SUCCESS:
            return { ...state, isLoading: false, salesReport: action.payload };
        case actionTypes.GET_SALES_REPORT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};

export default adminReducer;