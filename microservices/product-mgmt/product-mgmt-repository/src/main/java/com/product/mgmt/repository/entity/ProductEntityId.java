package com.product.mgmt.repository.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class ProductEntityId implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "organization_id", nullable = false, length = 255)
	private String organizationId;

	@Column(name = "product_name", nullable = false, length = 255)
	private String productName;

}
