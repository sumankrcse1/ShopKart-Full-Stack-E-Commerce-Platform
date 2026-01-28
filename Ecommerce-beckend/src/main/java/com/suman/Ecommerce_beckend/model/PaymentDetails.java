package com.suman.Ecommerce_beckend.model;

import java.time.LocalDate;

public class PaymentDetails {
    private String paymentMethod;
    private String status;
    private String paymentId;
    private String cardholderName;
    private String cardNumber;
    private String razorpayPaymentLinkId;
    private String razorpayPaymentLinkReferenceId;
    private String razorpayPaymentLinkStatus;  // Changed from LocalDate to String
    private String razorpayPaymentId;

    private String razorpayPaymentLinkUrl;  // new field



    public PaymentDetails() {
        // Initialize with default values
        this.status = "PENDING";
    }

    public PaymentDetails(String paymentMethod, String status, String paymentId,
                          String razorpayPaymentLinkId, String razorpayPaymentLinkReferenceId,
                          String razorpayPaymentLinkStatus, String razorpayPaymentId) {
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentId = paymentId;
        this.razorpayPaymentLinkId = razorpayPaymentLinkId;
        this.razorpayPaymentLinkReferenceId = razorpayPaymentLinkReferenceId;
        this.razorpayPaymentLinkStatus = razorpayPaymentLinkStatus;
        this.razorpayPaymentId = razorpayPaymentId;
    }
    public String getRazorpayPaymentLinkUrl() {
        return razorpayPaymentLinkUrl;
    }

    public void setRazorpayPaymentLinkUrl(String razorpayPaymentLinkUrl) {
        this.razorpayPaymentLinkUrl = razorpayPaymentLinkUrl;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getRazorpayPaymentLinkId() {
        return razorpayPaymentLinkId;
    }

    public void setRazorpayPaymentLinkId(String razorpayPaymentLinkId) {
        this.razorpayPaymentLinkId = razorpayPaymentLinkId;
    }

    public String getRazorpayPaymentLinkReferenceId() {
        return razorpayPaymentLinkReferenceId;
    }

    public void setRazorpayPaymentLinkReferenceId(String razorpayPaymentLinkReferenceId) {
        this.razorpayPaymentLinkReferenceId = razorpayPaymentLinkReferenceId;
    }

    public String getRazorpayPaymentLinkStatus() {
        return razorpayPaymentLinkStatus;
    }

    public void setRazorpayPaymentLinkStatus(String razorpayPaymentLinkStatus) {
        this.razorpayPaymentLinkStatus = razorpayPaymentLinkStatus;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    @Override
    public String toString() {
        return "PaymentDetails{" +
                "paymentMethod='" + paymentMethod + '\'' +
                ", status='" + status + '\'' +
                ", paymentId='" + paymentId + '\'' +
                ", razorpayPaymentLinkId='" + razorpayPaymentLinkId + '\'' +
                ", razorpayPaymentLinkReferenceId='" + razorpayPaymentLinkReferenceId + '\'' +
                ", razorpayPaymentLinkStatus='" + razorpayPaymentLinkStatus + '\'' +
                ", razorpayPaymentId='" + razorpayPaymentId + '\'' +
                '}';
    }
}