package com.product.mgmt.service;

import com.product.mgmt.repository.dto.InvoiceItemDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface InvoiceItemService {

    InvoiceItemDTO addItem(@RequestBody InvoiceItemDTO invoiceItemDTO);

    List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId);
}
