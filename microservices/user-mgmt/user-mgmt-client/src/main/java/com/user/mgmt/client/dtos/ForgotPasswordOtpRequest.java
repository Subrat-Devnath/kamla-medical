package com.user.mgmt.client.dtos;

public class ForgotPasswordOtpRequest {
    private String emailId;

    public ForgotPasswordOtpRequest() {
    }

    public ForgotPasswordOtpRequest(String emailId) {
        this.emailId = emailId;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }
}

