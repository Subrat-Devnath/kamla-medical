package com.product.mgmt.service.impl;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.Style;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.service.InvoiceService;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;

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
    public DataWithPaginationResponse getInvoicesByOrganization(Integer pageSize, String pageState) {
        return invoiceRepository.getInvoicesByOrganization(SecurityUtil.getPrincipal().getOrgId(), pageSize, pageState);
    }

    @Override
    public DataWithPaginationResponse searchInvoiceWithPagination(String customerName, Integer pageSize, String pageState) {
        return invoiceRepository.searchInvoiceWithPagination(SecurityUtil.getPrincipal().getOrgId(), customerName, pageSize, pageState);
    }

    @Override
    public byte[] generatePdf(List<InvoiceItemDTO> invoiceItemDTOs, InvoiceDTO invoiceDTO) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        Color blue = new DeviceRgb(25, 118, 210);

        //-------------------------------
        // Header
        //-------------------------------
        Table header = new Table(UnitValue.createPercentArray(new float[]{70, 30})).useAllAvailableWidth();

        Cell left = new Cell().setBorder(Border.NO_BORDER);

        left.add(new Paragraph("KAMLA MEDICAL STORES").setFontSize(24).setBold().setFontColor(ColorConstants.WHITE));

        left.add(new Paragraph("Your Trusted Medical Store").setFontSize(11).setFontColor(ColorConstants.WHITE));

        left.setBackgroundColor(blue);
        left.setPadding(15);

        Cell right = new Cell().setBorder(Border.NO_BORDER).setBackgroundColor(blue).setPadding(15);

        right.add(new Paragraph("INVOICE").setBold().setFontSize(18).setFontColor(ColorConstants.WHITE).setTextAlignment(TextAlignment.RIGHT));

        right.add(new Paragraph(LocalDate.now().toString()).setFontColor(ColorConstants.WHITE).setTextAlignment(TextAlignment.RIGHT));

        header.addCell(left);
        header.addCell(right);

        doc.add(header);

        doc.add(new Paragraph("\n"));

        //-------------------------------
        // Customer Details
        //-------------------------------
        Table customer = new Table(2).useAllAvailableWidth();

        customer.addCell(new Cell().add(new Paragraph("Customer Name")).setBold().setBackgroundColor(ColorConstants.LIGHT_GRAY));

        customer.addCell(invoiceDTO.getCustomerName() == null ? "-" : invoiceDTO.getCustomerName());

        customer.addCell(new Cell().add(new Paragraph("Invoice No")).setBold().setBackgroundColor(ColorConstants.LIGHT_GRAY));

        customer.addCell(invoiceDTO.getInvoiceNumber());

        customer.addCell(new Cell().add(new Paragraph("Address")).setBold().setBackgroundColor(ColorConstants.LIGHT_GRAY));

        customer.addCell(invoiceDTO.getCustomerAddress() == null ? "-" : invoiceDTO.getCustomerAddress());

        doc.add(customer);

        doc.add(new Paragraph("\n"));

        //-------------------------------
        // Product Table
        //-------------------------------
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 1, 2, 2, 2, 2, 2})).useAllAvailableWidth();

        Style headerStyle = new Style().setBackgroundColor(blue).setFontColor(ColorConstants.WHITE).setBold();

        table.addHeaderCell(new Cell().add(new Paragraph("Product")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Qty")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Unit List Price")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Total List Price")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Unit Sell Price")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Total Discount")).addStyle(headerStyle));
        table.addHeaderCell(new Cell().add(new Paragraph("Total Price")).addStyle(headerStyle));

        DecimalFormat df = new DecimalFormat("0.00");

        double grandTotal = 0;

        for (InvoiceItemDTO item : invoiceItemDTOs) {

            table.addCell(item.getProductName() == null ? "" : item.getProductName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell("₹ " + df.format(item.getUnitListPrice()));
            table.addCell("₹ " + df.format(item.getUnitSellPrice() * item.getQuantity()));
            table.addCell("₹ " + df.format(item.getUnitSellPrice()));
            table.addCell("₹ " + df.format(item.getTotalSellDiscount()));
            table.addCell("₹ " + df.format(item.getTotalSellPrice()));

            grandTotal += item.getTotalSellPrice();
        }

        doc.add(table);

        doc.add(new Paragraph("\n"));

        //-------------------------------
        // Total
        //-------------------------------
        Paragraph total = new Paragraph("Grand Total : ₹ " + df.format(grandTotal)).setBold().setFontSize(16).setTextAlignment(TextAlignment.RIGHT).setFontColor(blue);

        doc.add(total);

        doc.add(new Paragraph("\n"));

        //-------------------------------
        // Footer
        //-------------------------------
        doc.add(new LineSeparator(new SolidLine()));

        doc.add(new Paragraph("Thank you for shopping with KAMLA MEDICAL").setBold().setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("Get Well Soon!").setItalic().setTextAlignment(TextAlignment.CENTER));

        doc.close();

        return out.toByteArray();
    }
}
