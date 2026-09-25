package com.product.mgmt.service.pdf;

/**
 * Spells a rupee amount using the Indian numbering system, e.g.
 * {@code 1695.5 -> "One Thousand Six Hundred and Ninety Five Rupees and Fifty Paise Only"}.
 */
final class AmountInWords {

    private static final String[] ONES = {
            "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] TENS = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    private AmountInWords() {
    }

    static String convert(double amount) {

        long rupees = (long) Math.floor(Math.abs(amount));
        long paise = Math.round((Math.abs(amount) - rupees) * 100);

        if (paise == 100) {
            rupees++;
            paise = 0;
        }

        StringBuilder words = new StringBuilder(spell(rupees)).append(" Rupees");

        if (paise > 0) {
            words.append(" and ").append(spell(paise)).append(" Paise");
        }

        return words.append(" Only").toString();
    }

    private static String spell(long number) {

        if (number < 100) {
            return underHundred(number);
        }

        StringBuilder words = new StringBuilder();

        long crore = number / 10_000_000;
        long remainder = number % 10_000_000;

        long lakh = remainder / 100_000;
        remainder %= 100_000;

        long thousand = remainder / 1_000;
        remainder %= 1_000;

        long hundred = remainder / 100;
        remainder %= 100;

        if (crore > 0) {
            words.append(spell(crore)).append(" Crore ");
        }
        if (lakh > 0) {
            words.append(underHundred(lakh)).append(" Lakh ");
        }
        if (thousand > 0) {
            words.append(underHundred(thousand)).append(" Thousand ");
        }
        if (hundred > 0) {
            words.append(underHundred(hundred)).append(" Hundred ");
        }
        if (remainder > 0) {
            words.append("and ").append(underHundred(remainder));
        }

        return words.toString().trim();
    }

    private static String underHundred(long number) {

        if (number < 20) {
            return ONES[(int) number];
        }

        String tens = TENS[(int) (number / 10)];

        return number % 10 == 0 ? tens : tens + " " + ONES[(int) (number % 10)];
    }
}
