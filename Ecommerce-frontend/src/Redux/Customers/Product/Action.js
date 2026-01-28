import axios from "axios";

import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const findProducts = (reqData) => async (dispatch) => {
  const {
    colors = [],
    sizes = [],
    minPrice = 0,
    maxPrice = 10000,
    minDiscount = 0,
    category,
    stock,
    sort = "price_low",
    pageNumber = 0,
    pageSize = 10,
  } = reqData;

  try {
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });

    const params = new URLSearchParams();

    // IMPORTANT: Only add category if it exists and is not empty
    // This fixes the issue where different categories showed same products
    if (category && category.trim() !== "") {
      params.append("category", category);
      console.log("🎯 Filtering by category:", category);
    } else {
      console.log("🌐 Fetching all products (no category filter)");
    }

    // Append each color as repeated params
    if (Array.isArray(colors) && colors.length > 0) {
      colors.forEach(c => {
        if (c != null && c !== "") params.append("color", c);
      });
    } else if (colors && typeof colors === 'string' && colors.length > 0) {
      colors.split(",").forEach(c => {
        const trimmed = c.trim();
        if (trimmed !== "") params.append("color", trimmed);
      });
    }

    // Append each size as repeated params
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizes.forEach(s => {
        if (s != null && s !== "") params.append("size", s);
      });
    } else if (sizes && typeof sizes === 'string' && sizes.length > 0) {
      sizes.split(",").forEach(s => {
        const trimmed = s.trim();
        if (trimmed !== "") params.append("size", trimmed);
      });
    }

    // Add price range
    params.append("minPrice", String(minPrice));
    params.append("maxPrice", String(maxPrice));
    
    // Add discount
    params.append("minDiscount", String(minDiscount));
    
    // Add stock if present
    if (stock) params.append("stock", stock);
    
    // Add sort
    if (sort) params.append("sort", sort);
    
    // Add pagination
    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));

    const url = `/api/products?${params.toString()}`;
    console.log("=== API REQUEST ===");
    console.log("📡 Requesting URL:", url);
    console.log("==================");

    const { data } = await api.get(url);

    console.log("=== API RESPONSE ===");
    console.log("✅ Products received:", data?.content?.length || 0);
    console.log("📊 Total elements:", data?.totalElements || 0);
    console.log("📄 Current page:", data?.number || 0);
    console.log("===================");
    
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("=== API ERROR ===");
    console.error("❌ Error:", error.message);
    console.error("📋 Response:", error.response?.data);
    console.error("=================");
    
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

    const { data } = await api.get(`/api/products/id/${reqData.productId}`);

    console.log("Product by ID:", data);
    dispatch({
      type: FIND_PRODUCT_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/products/`,
      product.data
    );

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("Created product:", data);
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${product.productId}`,
      product
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  console.log("Delete product action:", productId);
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    let { data } = await api.delete(`/api/admin/products/${productId}/delete`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("Product deleted:", data);
  } catch (error) {
    console.log("Delete error:", error);
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};