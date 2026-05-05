/**
 * Format a number as GBP currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "£123.45")
 */
function formatCurrency(amount) {
  return `£${amount.toFixed(2)}`;
}

/**
 * Format address lines into a single string
 * @param {string[]} addressLines - Array of address lines
 * @returns {string} Formatted address with line breaks
 */
function formatAddress(addressLines) {
  return addressLines.filter(line => line).join('\n');
}

module.exports = {
  formatCurrency,
  formatAddress
};
