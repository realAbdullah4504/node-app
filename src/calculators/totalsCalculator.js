/**
 * Calculate invoice totals and VAT
 * Validates: Requirements 6.1, 6.2, 7.3
 * 
 * @param {Array} lineItems - Array of line items with totalPrice property
 * @param {number} vatRate - VAT rate as decimal (e.g., 0.20 for 20%)
 * @returns {Object} CalculationResult with goodsTotal, vatAmount, finalTotal, netAmount
 */
function calculateTotals(lineItems, vatRate) {
  // Calculate goods total by summing all line item total prices (Requirement 6.1)
  const goodsTotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate VAT amount (Requirement 6.2)
  const vatAmount = goodsTotal * vatRate;

  // Calculate final total (Requirement 7.3)
  const finalTotal = goodsTotal + vatAmount;

  // Round all currency values to 2 decimal places (Requirement 7.5)
  return {
    goodsTotal: parseFloat(goodsTotal.toFixed(2)),
    vatAmount: parseFloat(vatAmount.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
    netAmount: parseFloat(goodsTotal.toFixed(2)) // netAmount is same as goodsTotal
  };
}

module.exports = {
  calculateTotals
};
