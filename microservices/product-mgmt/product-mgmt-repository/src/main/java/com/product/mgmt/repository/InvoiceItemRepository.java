package com.product.mgmt.repository;

import com.product.mgmt.repository.dto.InvoiceItemDTO;

import java.util.List;

public interface InvoiceItemRepository {

    InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO);

    List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId);
}
