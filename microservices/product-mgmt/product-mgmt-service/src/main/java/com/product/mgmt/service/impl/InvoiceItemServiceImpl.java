package com.product.mgmt.service.impl;

import com.product.mgmt.repository.InvoiceItemRepository;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceItemServiceImpl implements InvoiceItemService {

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @Override
    public InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO) {
       return invoiceItemRepository.addItem(invoiceItemDTO);
    }

    @Override
    public List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId) {
        return invoiceItemRepository.getItemsByInvoiceId(invoiceId);
    }

}
