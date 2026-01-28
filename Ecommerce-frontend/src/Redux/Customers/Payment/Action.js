import { API_BASE_URL } from '../../../config/api';
import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
} from './ActionType';

import axios from 'axios';

export const createPayment = (reqData) => async (dispatch) => {
  console.log("create payment reqData ", reqData)
  try {
    dispatch({
      type: CREATE_PAYMENT_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${reqData.jwt}`,
      },
    };

    // FIXED: Pass empty object {} as second parameter (body), config as third parameter
    const { data } = await axios.post(
      `${API_BASE_URL}/api/payments/${reqData.orderId}`, 
      {}, 
      config
    );
    
    console.log("payment data", data);
    
    if (data.payment_link_url) {
      window.location.href = data.payment_link_url;
    }
    
    dispatch({
      type: CREATE_PAYMENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    dispatch({
      type: CREATE_PAYMENT_FAILURE,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const updatePayment = (reqData) => {
  return async (dispatch) => {
    console.log("update payment reqData ", reqData)
    dispatch(updatePaymentRequest());
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${reqData.jwt}`,
        },
      };
      
      // Use the correct parameter names that Razorpay sends
      const response = await axios.get(
        `${API_BASE_URL}/api/payments?razorpay_payment_id=${reqData.paymentId}&razorpay_payment_link_id=${reqData.paymentLinkId}&razorpay_payment_link_reference_id=${reqData.orderId}&razorpay_payment_link_status=${reqData.paymentStatus}`, 
        config
      );
      console.log("updated data", response.data);
      dispatch(updatePaymentSuccess(response.data));
    } catch (error) {
      console.error("Payment update error:", error);
      dispatch(updatePaymentFailure(error.message));
    }
  };
};

export const updatePaymentRequest = () => {
  return {
    type: UPDATE_PAYMENT_REQUEST,
  };
};

export const updatePaymentSuccess = (payment) => {
  return {
    type: UPDATE_PAYMENT_SUCCESS,
    payload: payment,
  };
};

export const updatePaymentFailure = (error) => {
  return {
    type: UPDATE_PAYMENT_FAILURE,
    payload: error,
  };
};