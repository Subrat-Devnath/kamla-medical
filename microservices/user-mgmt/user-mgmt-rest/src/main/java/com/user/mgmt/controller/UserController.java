package com.user.mgmt.controller;

import com.common.service.dtos.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.service.dtos.LoginRequest;
import com.user.mgmt.client.dtos.ForgotPasswordOtpRequest;
import com.user.mgmt.client.dtos.ResetPasswordWithOtpRequest;
import com.user.mgmt.client.dtos.UpdatePasswordRequest;
import com.user.mgmt.client.dtos.VerifyOtpRequest;
import com.user.mgmt.client.dtos.UserDTO;
import com.user.mgmt.service.UserService;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register-normal-user")
    public ResponseDTO addUser(@RequestBody UserDTO userDto) {
       return userService.addUser(userDto);
    }

    @GetMapping(value = "/user/{id}")
    public ResponseDTO getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.getUserById(id);
        if (userDTO == null) {
            return new ResponseDTO(false, null, "User not found for id " + id);
        }
        return new ResponseDTO(true, userDTO, null);
    }

    @GetMapping(value = "/{userName}")
    public UserDTO getUserByUserName(@PathVariable String userName) {
        return userService.getUserByUserName(userName);
    }

    @PostMapping(value = "/validate/user")
    public UserDTO validateUserAndGet(@RequestBody LoginRequest uerDetails) {
        return userService.validateUserAndGet(uerDetails);
    }

    @PostMapping(value = "/update-password")
    public ResponseDTO updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest) {
        return userService.updatePassword(updatePasswordRequest);
    }

    @PostMapping(value = "/send-forgot-password-otp")
    public ResponseDTO sendForgotPasswordOtp(@RequestBody ForgotPasswordOtpRequest forgotPasswordOtpRequest) {
        return userService.sendForgotPasswordOtp(forgotPasswordOtpRequest);
    }

    @PostMapping(value = "/verify-otp")
    public ResponseDTO verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        return userService.verifyOtp(verifyOtpRequest);
    }

    @PostMapping(value = "/reset-password-with-otp")
    public ResponseDTO resetPasswordWithOtp(@RequestBody ResetPasswordWithOtpRequest resetPasswordWithOtpRequest) {
        return userService.resetPasswordWithOtp(resetPasswordWithOtpRequest);
    }

}
