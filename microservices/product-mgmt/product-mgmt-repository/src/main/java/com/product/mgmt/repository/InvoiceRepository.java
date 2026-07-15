package com.product.mgmt.repository;

import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;

public interface InvoiceRepository {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    DataWithPaginationResponse getInvoicesByOrganization(String organizationId, Integer pageSize, String pageState);

    DataWithPaginationResponse searchInvoiceWithPagination(String organizationId, String productNameOrFormula, Integer pageSize, String pageState);

    InvoiceDTO getInvoiceById(String invoiceId);
}
