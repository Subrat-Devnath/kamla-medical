package com.common.service.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class ResponseDTO implements Serializable {

	private static final long serialVersionUID = -4112436951057744456L;

	private boolean isSuccess;
	private Object responseObject;
	private String message;

	public ResponseDTO(boolean isSuccess, Object responseObject, String sucessMessage) {
		this.isSuccess = isSuccess;
		this.responseObject = responseObject;
		this.message = sucessMessage;
	}

}
