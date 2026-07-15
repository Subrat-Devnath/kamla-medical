package com.product.mgmt.repository.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class ProductEntityId implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "organization_id", nullable = false, length = 36)
	private String organizationId;

	@Column(name = "user_id", nullable = false, length = 36)
	private String userId;

	@Column(name = "product_name", nullable = false, length = 255)
	private String productName;

}
