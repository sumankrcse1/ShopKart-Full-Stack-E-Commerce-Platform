package com.suman.Ecommerce_beckend.model;

import jakarta.persistence.Embeddable;

import java.time.LocalDate;

@Embeddable
public class PaymentInformation {
    private String cardholderName;
    private String cardNumber;
    private LocalDate expirationDate;
    private String cvv;

    public PaymentInformation() {
    }

    public PaymentInformation(String cardholderName, String cardNumber, LocalDate expirationDate, String cvv) {
        this.cardholderName = cardholderName;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
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

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}
