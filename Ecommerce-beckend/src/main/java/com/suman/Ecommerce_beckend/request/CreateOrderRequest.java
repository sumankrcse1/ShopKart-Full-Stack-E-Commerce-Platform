package com.suman.Ecommerce_beckend.request;

import com.suman.Ecommerce_beckend.user.domain.PaymentMethod;
import com.suman.Ecommerce_beckend.user.domain.PaymentStatus;

public class CreateOrderRequest {
    private String firstName;

    private String lastName;


    private String streetAddress;


    private String city;


    private String state;

    private String zipCode;

    private String mobile;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String paymentId;

    private String cardholderName;

    private String cardNumber;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String firstName, String lastName, String streetAddress, String city, String state, String zipCode, String mobile, PaymentMethod paymentMethod, PaymentStatus status, String paymentId, String cardholderName, String cardNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.mobile = mobile;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentId = paymentId;
        this.cardholderName = cardholderName;
        this.cardNumber = cardNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
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
}
