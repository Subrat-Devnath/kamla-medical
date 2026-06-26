package com.product.mgmt.repository.dto;

import com.common.service.dtos.BaseDTO;
import com.common.service.enums.Status;
import lombok.Data;

@Data
public class InvoiceDTO extends BaseDTO {

    private String invoiceNumber;

    private String customerName;

    private String customerAddress;

    private Double totalPrice;

    private Status status; // DRAFT / COMPLETED

    /// --------- Base entity fields ---------
    private boolean isDeleted;

    private Long expiryDate;

    private boolean isExpired;

    private Long createdDate;

    private String createdUserId;

    private String createdUserName;

    private Long updatedDate;

    private String updatedUserId;

    private String updatedUserName;

}
