package com.product.mgmt.service.impl;

import com.common.service.enums.Status;
import com.product.mgmt.repository.InvoiceItemRepository;
import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceItemService;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class InvoiceItemServiceImpl implements InvoiceItemService {

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO) {
        return invoiceItemRepository.addItem(invoiceItemDTO);
    }

    @Override
    public DataWithPaginationResponse getInvoiceItemsByOrganization(String invoiceNumber, Integer pageSize, String pageState) {
        return invoiceItemRepository.getInvoiceItemsByOrganization(SecurityUtil.getPrincipal().getOrgId(), invoiceNumber, pageSize, pageState);
    }

    @Override
    public List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId) {
        return invoiceItemRepository.getItemsByInvoiceId(invoiceId);
    }

    @Override
    public void deleteInvoiceItem(String invoiceNumber, String invoiceItemId) {

        if (!StringUtils.hasText(invoiceNumber) || !StringUtils.hasText(invoiceItemId)) {
            throw new IllegalArgumentException("Invoice number and invoice item id are required");
        }

        InvoiceDTO invoice = invoiceRepository.getInvoiceById(invoiceNumber);

        if (invoice == null) {
            throw new IllegalArgumentException("Invoice not found");
        }

        if (invoice.getStatus() == Status.COMPLETED) {
            throw new IllegalStateException("This invoice has already been completed and cannot be modified.");
        }

        boolean deleted = invoiceItemRepository.deleteInvoiceItem(invoiceNumber, invoiceItemId);

        if (!deleted) {
            throw new IllegalArgumentException("Invoice item not found");
        }
    }

}
