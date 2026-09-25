package com.product.mgmt.service.impl;

import com.common.service.enums.Status;
import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceItemService;
import com.product.mgmt.service.InvoiceService;
import com.product.mgmt.service.ProductService;
import com.product.mgmt.service.pdf.InvoicePdfGenerator;
import com.security.config.utils.SecurityUtil;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceItemService invoiceItemService;

    @Autowired
    private ProductService productService;

    @Autowired
    private InvoicePdfGenerator invoicePdfGenerator;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        return invoiceRepository.createInvoice(invoiceDTO);
    }

    @Override
    public InvoiceDTO getInvoiceById(String invoiceId) {
        return invoiceRepository.getInvoiceById(invoiceId);
    }

    @Override
    public DataWithPaginationResponse getInvoicesByOrganization(Integer pageSize, String pageState) {
        return invoiceRepository.getInvoicesByOrganization(SecurityUtil.getPrincipal().getOrgId(), pageSize, pageState);
    }

    @Override
    public DataWithPaginationResponse searchInvoiceWithPagination(String customerName, Integer pageSize, String pageState) {
        return invoiceRepository.searchInvoiceWithPagination(SecurityUtil.getPrincipal().getOrgId(), customerName, pageSize, pageState);
    }

    @Override
    public byte[] submitInvoice(String invoiceId) {

        if (StringUtils.isEmpty(invoiceId)) {
            return null;
        }

        List<InvoiceItemDTO> items = invoiceItemService.getItemsByInvoiceId(invoiceId);

        Map<String, Integer> productNameAndQuantityMap = items.stream().collect(Collectors.toMap(InvoiceItemDTO::getProductName, InvoiceItemDTO::getQuantity));

        productService.updateProductQuantity(productNameAndQuantityMap);

        InvoiceDTO invoice = getInvoiceById(invoiceId);

        double total = items.stream().mapToDouble(InvoiceItemDTO::getTotalSellPrice).sum();

        invoice.setTotalPrice(total);
        invoice.setStatus(Status.COMPLETED);
        createInvoice(invoice);

        return generatePdf(items, invoice);
    }

    @Override
    public byte[] generatePdf(List<InvoiceItemDTO> invoiceItemDTOs, InvoiceDTO invoiceDTO) {
        return invoicePdfGenerator.generate(invoiceItemDTOs, invoiceDTO);
    }
}
