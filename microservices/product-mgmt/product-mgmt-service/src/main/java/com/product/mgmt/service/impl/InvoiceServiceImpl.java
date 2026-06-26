package com.product.mgmt.service.impl;

import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        return invoiceRepository.createInvoice(invoiceDTO);
    }

    @Override
    public InvoiceDTO getInvoiceById(String invoiceId) {
        return invoiceRepository.getInvoiceById(invoiceId);
    }

    @Override
    public byte[] generatePdf(List<InvoiceItemDTO> invoiceItemDTOs) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        doc.add(new Paragraph("INVOICE"));
        doc.add(new Paragraph("Invoice No: " + invoiceItemDTOs.get(0).getInvoiceNumber()));

        Table table = new Table(5);

        table.addCell("Product");
        table.addCell("Qty");
        table.addCell("Price");
        table.addCell("Discount");
        table.addCell("Total");

        for (InvoiceItemDTO invoiceItemDTO : invoiceItemDTOs) {
            table.addCell(invoiceItemDTO.getProductName());
            table.addCell(String.valueOf(invoiceItemDTO.getQuantity()));
            table.addCell(String.valueOf(invoiceItemDTO.getUnitListPrice()));
            table.addCell(String.valueOf(invoiceItemDTO.getTotalSellDiscount()));
            table.addCell(String.valueOf(invoiceItemDTO.getTotalSellPrice()));
        }

        doc.add(table);

        doc.close();

        return out.toByteArray();
    }
}
