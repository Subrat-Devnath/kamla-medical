package com.product.mgmt.repository;

import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceItemDTO;

import java.util.List;

public interface InvoiceItemRepository {

    InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO);

    DataWithPaginationResponse getInvoiceItemsByOrganization(String organizationId, String invoiceNumber, Integer pageSize, String pageState);

    List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId);
}
