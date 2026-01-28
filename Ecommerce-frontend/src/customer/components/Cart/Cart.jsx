import React from "react";
import CartItem from "./CartItem";
import { Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCart } from "../../../Redux/Customers/Cart/Action";
import { ShoppingBag, Tag, Truck, Shield, ArrowRight } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const jwt = localStorage.getItem("jwt");
  const { cart } = useSelector(store => store);
  // console.log("cart ", cart)

  useEffect(() => {
    if (!jwt) {
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: '/cart',
            message: 'Please sign in to view your cart' 
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [jwt, navigate]);

  useEffect(() => {
    dispatch(getCart(jwt));
  }, [jwt,cart.updateCartItem,cart.deleteCartItem]);

  const savingsPercentage = cart.cart?.totalPrice 
    ? Math.round((cart.cart.discount / cart.cart.totalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {cart.cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {cart.cart?.totalItem} {cart.cart?.totalItem === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4 mb-8 lg:mb-0">
              {cart.cartItems.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="transform transition-all duration-300 hover:scale-[1.01] animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CartItem item={item} showButton={true} />
                </div>
              ))}
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">On all orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Best Prices</p>
                    <p className="text-xs text-gray-500">Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Gradient Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h2 className="text-xl font-bold mb-1">Order Summary</h2>
                    <p className="text-blue-100 text-sm">Review your purchase</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Savings Banner */}
                    {cart.cart?.discount > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                              <Tag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-green-900">You're saving</p>
                              <p className="text-xs text-green-700">{savingsPercentage}% off</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-green-600">₹{cart.cart.discount}</p>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Price ({cart.cart?.totalItem} {cart.cart?.totalItem === 1 ? 'item' : 'items'})
                        </span>
                        <span className="font-semibold">₹{cart.cart.totalPrice}</span>
                      </div>

                      <div className="flex justify-between items-center text-green-600">
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Discount
                        </span>
                        <span className="font-semibold">-₹{cart.cart?.discount}</span>
                      </div>

                      <div className="flex justify-between items-center text-gray-700">
                        <span className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Delivery Charges
                        </span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            ₹{cart.cart?.totalDiscountedPrice}
                          </p>
                          {cart.cart?.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through">₹{cart.cart?.totalPrice}</p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate("/checkout?step=2")}
                        variant="contained"
                        className="group relative"
                        sx={{ 
                          padding: "1rem 2rem",
                          width: "100%",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          borderRadius: "12px",
                          textTransform: "none",
                          boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
                          transition: "all 0.3s ease",
                          '&:hover': {
                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 15px 30px -5px rgba(102, 126, 234, 0.5)",
                          }
                        }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>

                      <p className="text-xs text-center text-gray-500 mt-4">
                        🔒 Secure checkout • SSL encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ 
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
                borderRadius: "12px",
                fontWeight: "bold"
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default Cart;