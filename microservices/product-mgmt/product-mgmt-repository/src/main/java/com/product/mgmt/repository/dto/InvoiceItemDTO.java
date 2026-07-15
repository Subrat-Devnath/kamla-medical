package com.product.mgmt.repository.dto;

import com.common.service.dtos.BaseDTO;
import lombok.Data;

import jakarta.persistence.Column;

@Data
public class InvoiceItemDTO extends BaseDTO {

    private String invoiceNumber;

    private String invoiceItemId;

    private String productName;

    private Integer quantity;

    private Double unitListPrice;

    private Double unitSellPrice;

    private Double unitSellDiscount;

    private Double totalSellPrice;

    private Double totalSellDiscount;

}
