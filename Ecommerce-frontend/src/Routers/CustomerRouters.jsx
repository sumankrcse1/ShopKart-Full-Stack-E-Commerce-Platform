import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import Homepage from "../customer/pages/HomePage/HomePage";
import About from "../customer/pages/About";
import Contact from "../customer/pages/Contact";
import PrivacyPolicy from "../customer/pages/PrivacyPolicy";
import TermsCondition from "../customer/pages/TermsCondition";

import Navigation from "../customer/components/Navigation/Navigation";
import Footer from "../customer/components/Footer/Footer";

import Product from "../customer/components/Product/Product";
import ProductDetails from "../customer/components/ProductDetails/ProductDetails";

import Cart from "../customer/components/Cart/Cart";
import Checkout from "../customer/components/Checkout/Checkout";

import Order from "../customer/components/Order/Order";
import OrderDetails from "../customer/components/Order/OrderDetails";
import RateProduct from "../customer/components/ReviewProduct/RateProduct";
import PaymentSuccess from "../customer/components/Payment/PaymentSuccess";

import ForgotPasswordForm from "../customer/Auth/ForgotPasswordForm";
import ResetPasswordForm from "../customer/Auth/ResetPasswordForm";

import SearchResults from "../customer/components/Search/SearchResults";
import AuthModal from "../customer/Auth/AuthModel";
import LoginForm from "../customer/Auth/LoginForm";
import RegisterForm from "../customer/Auth/RegisterForm";

import OAuth2RedirectHandler from "../customer/Auth/OAuth2RedirectHandler";

const CustomerRoutes = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "*";

  return (
    <div>
      {showNavigation && <Navigation />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* NEW: Password reset routes */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordForm />} />*/}
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-condition" element={<TermsCondition />} />

        <Route path="/:levelOne/:levelTwo/:levelThree" element={<Product />} />
        <Route path="/product/:productId" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/account/order" element={<Order />} />
        <Route path="/account/order/:orderId" element={<OrderDetails />} />
        <Route path="/account/rate/:productId" element={<RateProduct />} />

        <Route path="/payment/:orderId" element={<PaymentSuccess />} />
        
        <Route path="/search" element={<SearchResults />} />

        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      </Routes>
      <Footer />
    </div>
  );
};

export default CustomerRoutes;