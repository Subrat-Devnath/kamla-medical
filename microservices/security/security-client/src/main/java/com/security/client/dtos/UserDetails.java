package com.security.client.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class UserDetails implements Serializable {

	private static final long serialVersionUID = 2223602645810234635L;

	private String userName;
	private String password;

}
