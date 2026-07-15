package com.product.mgmt.service;

import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;

import java.util.List;

public interface InvoiceService {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    InvoiceDTO getInvoiceById(String invoiceId);

    DataWithPaginationResponse getInvoicesByOrganization(Integer pageSize, String pageState);

    DataWithPaginationResponse searchInvoiceWithPagination(String customerName, Integer pageSize, String pageState);

    byte[] generatePdf(List<InvoiceItemDTO> invoiceItemDTOs, InvoiceDTO invoiceDTOs);
}
