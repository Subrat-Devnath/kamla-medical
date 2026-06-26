package com.product.mgmt.repository;

import com.product.mgmt.repository.dto.InvoiceDTO;

public interface InvoiceRepository {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    InvoiceDTO getInvoiceById(String invoiceId);
}
