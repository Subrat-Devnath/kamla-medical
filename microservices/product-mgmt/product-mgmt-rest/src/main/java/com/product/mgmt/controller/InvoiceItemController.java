package com.product.mgmt.controller;

import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class InvoiceItemController {

    @Autowired
    private InvoiceItemService invoiceItemService;

    @PostMapping(path = "/invoice/items", consumes = MediaType.APPLICATION_JSON_VALUE)
    public InvoiceItemDTO addItem(@RequestBody InvoiceItemDTO invoiceItemDTO) {
        return invoiceItemService.addItem(invoiceItemDTO);
    }

    @GetMapping("/invoice/{invoiceId}/items")
    public List<InvoiceItemDTO> getItemsByInvoiceId(@PathVariable String invoiceId) {
        return invoiceItemService.getItemsByInvoiceId(invoiceId);
    }
}
