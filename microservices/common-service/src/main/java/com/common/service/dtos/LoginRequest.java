package com.common.service.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class LoginRequest implements Serializable {

	private static final long serialVersionUID = 2223602645810234635L;

	private String userName;
	private String password;

}
