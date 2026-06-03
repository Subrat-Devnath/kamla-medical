package com.product.mgmt.service.utils;

/**
 * Utility class for calculating buy and sell discounts based on prices
 * Returns null or 0 if any required data is missing instead of throwing exceptions
 */
public class DiscountCalculatorUtil {

    /**
     * Calculate buy discount based on list price and buy price
     * Formula: buyDiscount = listPrice - buyPrice
     *
     * @param listPrice the list price of the product
     * @param buyPrice  the buying price of the product
     * @return the calculated buy discount amount, or null if data is missing or invalid
     */
    public static Double calculateBuyDiscount(Double listPrice, Double buyPrice) {
        // Return null if any required data is missing
        if (listPrice == null || buyPrice == null) {
            return null;
        }

        // Return null if prices are negative
        if (listPrice < 0 || buyPrice < 0) {
            return null;
        }

        // Return null if buyPrice is greater than listPrice
        if (buyPrice > listPrice) {
            return null;
        }

        return listPrice - buyPrice;
    }

    /**
     * Calculate sell discount based on list price and sell price
     * Formula: sellDiscount = listPrice - sellPrice
     *
     * @param listPrice the list price of the product
     * @param sellPrice the selling price of the product
     * @return the calculated sell discount amount, or null if data is missing or invalid
     */
    public static Double calculateSellDiscount(Double listPrice, Double sellPrice) {
        // Return null if any required data is missing
        if (listPrice == null || sellPrice == null) {
            return null;
        }

        // Return null if prices are negative
        if (listPrice < 0 || sellPrice < 0) {
            return null;
        }

        // Return null if sellPrice is greater than listPrice
        if (sellPrice > listPrice) {
            return null;
        }

        return listPrice - sellPrice;
    }

    /**
     * Calculate buy discount percentage based on list price and buy price
     * Formula: buyDiscountPercentage = ((listPrice - buyPrice) / listPrice) * 100
     *
     * @param listPrice the list price of the product
     * @param buyPrice  the buying price of the product
     * @return the calculated buy discount percentage, or 0.0 if data is missing or invalid
     */
    public static Double calculateBuyDiscountPercentage(Double listPrice, Double buyPrice) {
        // Return 0.0 if any required data is missing
        if (listPrice == null || buyPrice == null) {
            return 0.0;
        }

        // Return 0.0 if prices are invalid
        if (listPrice <= 0 || buyPrice < 0) {
            return 0.0;
        }

        // Return 0.0 if buyPrice is greater than listPrice
        if (buyPrice > listPrice) {
            return 0.0;
        }

        return Math.round((((double) (listPrice - buyPrice) / listPrice) * 100) * 100.0)
                / 100.0;
    }

    /**
     * Calculate sell discount percentage based on list price and sell price
     * Formula: sellDiscountPercentage = ((listPrice - sellPrice) / listPrice) * 100
     *
     * @param listPrice the list price of the product
     * @param sellPrice the selling price of the product
     * @return the calculated sell discount percentage, or 0.0 if data is missing or invalid
     */
    public static Double calculateSellDiscountPercentage(Double listPrice, Double sellPrice) {
        // Return 0.0 if any required data is missing
        if (listPrice == null || sellPrice == null) {
            return 0.0;
        }

        // Return 0.0 if prices are invalid
        if (listPrice <= 0 || sellPrice < 0) {
            return 0.0;
        }

        // Return 0.0 if sellPrice is greater than listPrice
        if (sellPrice > listPrice) {
            return 0.0;
        }

        return Math.round((((double) (listPrice - sellPrice) / listPrice) * 100) * 100.0)
                / 100.0;
    }

    /**
     * Calculate total list price based on unit list price and quantity
     * Formula: unitListPrice * quantity
     *
     * @param unitListPrice the unit list price of the product
     * @param quantity      the quantity of the product
     * @return the calculated total list price, or 0.0 if data is missing or invalid
     */
    public static Double calculateTotalListPrice(Double unitListPrice, Long quantity) {
        // Return 0.0 if any required data is missing
        if (unitListPrice == null || quantity == null) {
            return 0.0;
        }

        // Return 0.0 if price or quantity is negative
        if (unitListPrice < 0 || quantity < 0) {
            return 0.0;
        }

        return unitListPrice * quantity;
    }

    /**
     * Calculate total sell price based on unit sell price and quantity
     * Formula: unitSellPrice * quantity
     *
     * @param unitSellPrice the unit sell price of the product
     * @param quantity      the quantity of the product
     * @return the calculated total sell price, or 0.0 if data is missing or invalid
     */
    public static Double calculateTotalSellPrice(Double unitSellPrice, Long quantity) {
        // Return 0.0 if any required data is missing
        if (unitSellPrice == null || quantity == null) {
            return 0.0;
        }

        // Return 0.0 if price or quantity is negative
        if (unitSellPrice < 0 || quantity < 0) {
            return 0.0;
        }

        return unitSellPrice * quantity;
    }

    /**
     * Calculate total buy price based on unit buy price and quantity
     * Formula: unitBuyPrice * quantity
     *
     * @param unitBuyPrice the unit buy price of the product
     * @param quantity     the quantity of the product
     * @return the calculated total buy price, or 0.0 if data is missing or invalid
     */
    public static Double calculateTotalBuyPrice(Double unitBuyPrice, Long quantity) {
        // Return 0.0 if any required data is missing
        if (unitBuyPrice == null || quantity == null) {
            return 0.0;
        }

        // Return 0.0 if price or quantity is negative
        if (unitBuyPrice < 0 || quantity < 0) {
            return 0.0;
        }

        return unitBuyPrice * quantity;
    }
}
