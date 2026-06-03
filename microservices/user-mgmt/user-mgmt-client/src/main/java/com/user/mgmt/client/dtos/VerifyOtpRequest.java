package com.user.mgmt.client.dtos;

public class VerifyOtpRequest {
    private String emailId;
    private String otp;

    public VerifyOtpRequest() {
    }

    public VerifyOtpRequest(String emailId, String otp) {
        this.emailId = emailId;
        this.otp = otp;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}

