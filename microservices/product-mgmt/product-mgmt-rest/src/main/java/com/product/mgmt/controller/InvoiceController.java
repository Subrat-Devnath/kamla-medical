package com.product.mgmt.controller;

import com.common.service.dtos.PaginationCriteria;
import com.common.service.enums.Status;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceItemService;
import com.product.mgmt.service.InvoiceService;
import com.product.mgmt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping(path = "/invoice", consumes = MediaType.APPLICATION_JSON_VALUE)
    public InvoiceDTO createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.createInvoice(invoiceDTO);
    }

    @PostMapping(path = "/invoices-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse getInvoicesByOrganization(
            @RequestBody PaginationCriteria paginationCriteria) {
        return invoiceService.getInvoicesByOrganization(paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping(path = "/search-invoices-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse searchInvoiceWithPagination(@RequestParam String customerName,
                                                                  @RequestBody PaginationCriteria paginationCriteria) {
        return invoiceService.searchInvoiceWithPagination(customerName, paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping("/invoice/{invoiceId}/submit")
    public ResponseEntity<byte[]> submitInvoice(@PathVariable String invoiceId) {

        if (invoiceId == null || invoiceId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        byte[] pdf = invoiceService.submitInvoice(invoiceId);

        return ResponseEntity.ok().header("Content-Type", "application/pdf").body(pdf);
    }

}
