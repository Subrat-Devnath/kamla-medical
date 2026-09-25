package com.product.mgmt.service.pdf;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

/**
 * Renders a customer invoice as a printable A4 PDF.
 *
 * <p>Amounts are written as plain numbers prefixed with "Rs." rather than the
 * Rupee sign: the standard PDF fonts use WinAnsi encoding, which has no glyph
 * for U+20B9, so a literal "₹" silently disappears from the output.
 */
@Component
public class InvoicePdfGenerator {

    private static final String STORE_NAME = "KAMLA MEDICAL STORES";
    private static final String STORE_TAGLINE = "Your Trusted Medical Store";
    private static final String CURRENCY = "Rs.";

    private static final Color INK = new DeviceRgb(17, 24, 39);
    private static final Color HEADER_BG = new DeviceRgb(15, 32, 62);
    private static final Color BRAND = new DeviceRgb(8, 145, 178);
    private static final Color MUTED = new DeviceRgb(107, 114, 128);
    private static final Color RULE = new DeviceRgb(226, 232, 240);
    private static final Color ZEBRA = new DeviceRgb(248, 250, 252);
    private static final Color TINT = new DeviceRgb(236, 254, 255);

    private static final DateTimeFormatter DATE_TIME =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private static final DecimalFormat AMOUNT = new DecimalFormat("#,##0.00");

    public byte[] generate(List<InvoiceItemDTO> invoiceItemDTOs, InvoiceDTO invoiceDTO) {

        List<InvoiceItemDTO> items =
                invoiceItemDTOs == null ? Collections.emptyList() : invoiceItemDTOs;

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        // immediateFlush = false keeps every page in memory so the footer can be
        // stamped with "Page x of y" once the total page count is known.
        try (PdfDocument pdf = new PdfDocument(new PdfWriter(out));
             Document doc = new Document(pdf, PageSize.A4, false)) {

            doc.setMargins(28, 36, 52, 36);
            doc.setFontColor(INK);
            doc.setFontSize(9.5f);

            addLetterHead(doc, invoiceDTO);
            addPartyDetails(doc, invoiceDTO, items.size());

            Totals totals = addItemsTable(doc, items);

            addSummary(doc, totals);
            addFooter(doc);
            addPageNumbers(doc, pdf);
        }

        return out.toByteArray();
    }

    // ------------------------------------------------------------------
    // Letter head: store identity on the left, invoice identity on the right
    // ------------------------------------------------------------------
    private void addLetterHead(Document doc, InvoiceDTO invoice) {

        Table band = new Table(UnitValue.createPercentArray(new float[]{58, 42}))
                .useAllAvailableWidth();

        Cell store = borderless()
                .setBackgroundColor(HEADER_BG)
                .setPadding(16);

        store.add(new Paragraph(STORE_NAME)
                .setFontSize(19)
                .setBold()
                .setCharacterSpacing(0.4f)
                .setFontColor(ColorConstants.WHITE)
                .setMarginBottom(2));

        store.add(new Paragraph(STORE_TAGLINE)
                .setFontSize(9)
                .setFontColor(new DeviceRgb(148, 197, 220))
                .setMargin(0));

        Cell meta = borderless()
                .setBackgroundColor(HEADER_BG)
                .setPadding(16)
                .setTextAlignment(TextAlignment.RIGHT);

        meta.add(new Paragraph("INVOICE")
                .setFontSize(16)
                .setBold()
                .setCharacterSpacing(2.2f)
                .setFontColor(ColorConstants.WHITE)
                .setMarginBottom(3));

        meta.add(new Paragraph(nullSafe(invoice.getInvoiceNumber(), "-"))
                .setFontSize(9)
                .setFontColor(new DeviceRgb(148, 197, 220))
                .setMargin(0));

        band.addCell(store);
        band.addCell(meta);

        doc.add(band);

        doc.add(new LineSeparator(new SolidLine(3f))
                .setStrokeColor(BRAND)
                .setMarginTop(0)
                .setMarginBottom(18));
    }

    // ------------------------------------------------------------------
    // Customer block beside the invoice facts
    // ------------------------------------------------------------------
    private void addPartyDetails(Document doc, InvoiceDTO invoice, int itemCount) {

        Table details = new Table(UnitValue.createPercentArray(new float[]{54, 46}))
                .useAllAvailableWidth()
                .setMarginBottom(16);

        Cell billedTo = softBox();
        billedTo.add(caption("BILLED TO"));
        billedTo.add(new Paragraph(nullSafe(invoice.getCustomerName(), "-"))
                .setFontSize(12)
                .setBold()
                .setMarginBottom(3));
        billedTo.add(new Paragraph(nullSafe(invoice.getCustomerAddress(), "Address not provided"))
                .setFontSize(9)
                .setFontColor(MUTED)
                .setMargin(0));

        Cell facts = softBox();
        facts.add(caption("INVOICE DETAILS"));

        Table factRows = new Table(UnitValue.createPercentArray(new float[]{42, 58}))
                .useAllAvailableWidth();

        factRow(factRows, "Invoice No", nullSafe(invoice.getInvoiceNumber(), "-"));
        factRow(factRows, "Date", formatDate(invoice.getCreatedDate()));
        factRow(factRows, "Status", invoice.getStatus() == null ? "-" : invoice.getStatus().name());
        factRow(factRows, "Items", String.valueOf(itemCount));

        if (invoice.getCreatedUserName() != null && !invoice.getCreatedUserName().isBlank()) {
            factRow(factRows, "Billed by", invoice.getCreatedUserName().trim());
        }

        facts.add(factRows);

        details.addCell(billedTo);
        details.addCell(facts);

        doc.add(details);
    }

    // ------------------------------------------------------------------
    // Line items
    // ------------------------------------------------------------------
    private Totals addItemsTable(Document doc, List<InvoiceItemDTO> items) {

        doc.add(new Paragraph("All amounts in Indian Rupees (" + CURRENCY + ")")
                .setFontSize(8)
                .setFontColor(MUTED)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginBottom(4));

        Table table = new Table(
                UnitValue.createPercentArray(new float[]{5, 38, 7, 12, 12, 12, 14}))
                .useAllAvailableWidth();

        headerCell(table, "#", TextAlignment.CENTER);
        headerCell(table, "Item", TextAlignment.LEFT);
        headerCell(table, "Qty", TextAlignment.CENTER);
        headerCell(table, "MRP", TextAlignment.RIGHT);
        headerCell(table, "Rate", TextAlignment.RIGHT);
        headerCell(table, "Discount", TextAlignment.RIGHT);
        headerCell(table, "Amount", TextAlignment.RIGHT);

        Totals totals = new Totals();

        if (items.isEmpty()) {
            table.addCell(new Cell(1, 7)
                    .add(new Paragraph("No items on this invoice.")
                            .setFontColor(MUTED)
                            .setTextAlignment(TextAlignment.CENTER))
                    .setBorder(Border.NO_BORDER)
                    .setBorderBottom(new SolidBorder(RULE, 0.5f))
                    .setPaddingTop(14)
                    .setPaddingBottom(14));
        }

        int row = 0;

        for (InvoiceItemDTO item : items) {

            int quantity = zero(item.getQuantity());
            double rate = zero(item.getUnitSellPrice());
            double discount = zero(item.getTotalSellDiscount());
            double amount = zero(item.getTotalSellPrice());

            totals.subtotal += rate * quantity;
            totals.discount += discount;
            totals.grandTotal += amount;

            boolean shaded = row % 2 == 1;

            bodyCell(table, String.valueOf(row + 1), TextAlignment.CENTER, shaded, false);
            bodyCell(table, nullSafe(item.getProductName(), "-"), TextAlignment.LEFT, shaded, false);
            bodyCell(table, String.valueOf(quantity), TextAlignment.CENTER, shaded, false);
            bodyCell(table, AMOUNT.format(zero(item.getUnitListPrice())), TextAlignment.RIGHT, shaded, false);
            bodyCell(table, AMOUNT.format(rate), TextAlignment.RIGHT, shaded, false);
            bodyCell(table, discount > 0 ? "- " + AMOUNT.format(discount) : "-", TextAlignment.RIGHT, shaded, false);
            bodyCell(table, AMOUNT.format(amount), TextAlignment.RIGHT, shaded, true);

            row++;
        }

        doc.add(table);

        return totals;
    }

    // ------------------------------------------------------------------
    // Amount in words beside the totals ladder
    // ------------------------------------------------------------------
    private void addSummary(Document doc, Totals totals) {

        Table summary = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
                .useAllAvailableWidth()
                .setMarginTop(14);

        Cell words = borderless().setPaddingRight(16);
        words.add(caption("AMOUNT IN WORDS"));
        words.add(new Paragraph(AmountInWords.convert(totals.grandTotal))
                .setFontSize(9.5f)
                .setBold()
                .setMarginBottom(10));

        if (totals.discount > 0) {
            words.add(new Paragraph("You saved " + CURRENCY + " " + AMOUNT.format(totals.discount)
                    + " on this bill.")
                    .setFontSize(9)
                    .setFontColor(BRAND)
                    .setMargin(0));
        }

        Cell ladder = borderless();

        Table rows = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
                .useAllAvailableWidth();

        totalRow(rows, "Subtotal", AMOUNT.format(totals.subtotal), false);
        totalRow(rows, "Discount", totals.discount > 0
                ? "- " + AMOUNT.format(totals.discount)
                : AMOUNT.format(0), false);
        totalRow(rows, "Grand Total (" + CURRENCY + ")", AMOUNT.format(totals.grandTotal), true);

        ladder.add(rows);

        summary.addCell(words);
        summary.addCell(ladder);

        doc.add(summary);
    }

    private void addFooter(Document doc) {

        doc.add(new LineSeparator(new SolidLine(0.5f))
                .setStrokeColor(RULE)
                .setMarginTop(22)
                .setMarginBottom(8));

        doc.add(new Paragraph("Thank you for shopping with " + STORE_NAME)
                .setFontSize(10)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(2));

        doc.add(new Paragraph("Get well soon!")
                .setFontSize(9)
                .setItalic()
                .setFontColor(BRAND)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(6));

        doc.add(new Paragraph("This is a computer generated invoice. "
                + "Medicines once sold are not returnable without a valid prescription.")
                .setFontSize(7.5f)
                .setFontColor(MUTED)
                .setTextAlignment(TextAlignment.CENTER)
                .setMargin(0));
    }

    private void addPageNumbers(Document doc, PdfDocument pdf) {

        int pageCount = pdf.getNumberOfPages();
        float x = PageSize.A4.getWidth() / 2;

        for (int page = 1; page <= pageCount; page++) {

            doc.showTextAligned(
                    new Paragraph("Page " + page + " of " + pageCount)
                            .setFontSize(7.5f)
                            .setFontColor(MUTED),
                    x, 24, page, TextAlignment.CENTER, VerticalAlignment.BOTTOM, 0);
        }
    }

    // ------------------------------------------------------------------
    // Building blocks
    // ------------------------------------------------------------------
    private static Cell borderless() {
        return new Cell().setBorder(Border.NO_BORDER);
    }

    private static Cell softBox() {
        return new Cell()
                .setBorder(new SolidBorder(RULE, 0.5f))
                .setBackgroundColor(ZEBRA)
                .setPadding(12);
    }

    private static Paragraph caption(String text) {
        return new Paragraph(text)
                .setFontSize(7.5f)
                .setBold()
                .setCharacterSpacing(1.1f)
                .setFontColor(MUTED)
                .setMarginBottom(5);
    }

    private static void factRow(Table table, String label, String value) {

        table.addCell(borderless()
                .add(new Paragraph(label).setFontSize(9).setFontColor(MUTED).setMargin(0))
                .setPaddingBottom(3));

        table.addCell(borderless()
                .add(new Paragraph(value).setFontSize(9).setBold().setMargin(0))
                .setTextAlignment(TextAlignment.RIGHT)
                .setPaddingBottom(3));
    }

    private static void headerCell(Table table, String label, TextAlignment alignment) {

        table.addHeaderCell(new Cell()
                .add(new Paragraph(label)
                        .setFontSize(8.5f)
                        .setBold()
                        .setCharacterSpacing(0.5f)
                        .setFontColor(ColorConstants.WHITE)
                        .setMargin(0))
                .setBackgroundColor(HEADER_BG)
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(alignment)
                .setPaddingTop(8)
                .setPaddingBottom(8)
                .setPaddingLeft(6)
                .setPaddingRight(6));
    }

    private static void bodyCell(Table table, String text, TextAlignment alignment,
                                boolean shaded, boolean emphasised) {

        Paragraph paragraph = new Paragraph(text).setFontSize(9).setMargin(0);

        if (emphasised) {
            paragraph.setBold();
        }

        Cell cell = new Cell()
                .add(paragraph)
                // keeps a wrapped item name from being split across a page break
                .setKeepTogether(true)
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(RULE, 0.5f))
                .setTextAlignment(alignment)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setPaddingTop(7)
                .setPaddingBottom(7)
                .setPaddingLeft(6)
                .setPaddingRight(6);

        if (shaded) {
            cell.setBackgroundColor(ZEBRA);
        }

        table.addCell(cell);
    }

    private static void totalRow(Table table, String label, String value, boolean highlight) {

        Cell labelCell = borderless()
                .add(new Paragraph(label)
                        .setFontSize(highlight ? 11 : 9.5f)
                        .setFontColor(highlight ? INK : MUTED)
                        .setMargin(0))
                .setPaddingTop(highlight ? 9 : 5)
                .setPaddingBottom(highlight ? 9 : 5)
                .setPaddingLeft(10);

        Cell valueCell = borderless()
                .add(new Paragraph(value)
                        .setFontSize(highlight ? 13 : 9.5f)
                        .setBold()
                        .setMargin(0))
                .setTextAlignment(TextAlignment.RIGHT)
                .setPaddingTop(highlight ? 9 : 5)
                .setPaddingBottom(highlight ? 9 : 5)
                .setPaddingRight(10);

        if (highlight) {
            labelCell.setBackgroundColor(TINT).setBorderTop(new SolidBorder(BRAND, 1.2f));
            valueCell.setBackgroundColor(TINT).setBorderTop(new SolidBorder(BRAND, 1.2f));
        } else {
            labelCell.setBorderBottom(new SolidBorder(RULE, 0.5f));
            valueCell.setBorderBottom(new SolidBorder(RULE, 0.5f));
        }

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private static String formatDate(Long epochMillis) {

        LocalDateTime dateTime = epochMillis == null
                ? LocalDateTime.now()
                : LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneId.systemDefault());

        return DATE_TIME.format(dateTime);
    }

    private static String nullSafe(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private static double zero(Double value) {
        return value == null ? 0d : value;
    }

    private static int zero(Integer value) {
        return value == null ? 0 : value;
    }

    private static final class Totals {
        private double subtotal;
        private double discount;
        private double grandTotal;
    }
}
