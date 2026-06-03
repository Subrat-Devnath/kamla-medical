package com.user.mgmt.client.dtos;

public class ResetPasswordWithOtpRequest {
    private String emailId;
    private String otp;
    private String newPassword;

    public ResetPasswordWithOtpRequest() {
    }

    public ResetPasswordWithOtpRequest(String emailId, String otp, String newPassword) {
        this.emailId = emailId;
        this.otp = otp;
        this.newPassword = newPassword;
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

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

