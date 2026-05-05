/**
 * Custom error class for validation failures
 */
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validate invoice data structure
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 * 
 * @param {Object} data - The invoice data to validate
 * @throws {ValidationError} If data is invalid or missing required fields
 */
function validateInvoiceData(data) {
  // Check if data exists
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invoice data must be an object', 'data');
  }

  // Validate company header (Requirement 1.2)
  validateCompanyHeader(data.companyHeader);

  // Validate invoice metadata (Requirement 1.3)
  validateInvoiceMetadata(data.invoiceMetadata);

  // Validate customer billing details (Requirement 1.4)
  validateCustomerDetails(data.invoiceTo, 'invoiceTo');

  // Validate customer delivery details (Requirement 1.5)
  validateCustomerDetails(data.deliverTo, 'deliverTo');

  // Validate line items (Requirement 1.6)
  validateLineItems(data.lineItems);

  // Validate VAT rate
  validateVATRate(data.vatRate);

  // Validate payment details (Requirement 1.7)
  if (typeof data.paymentMessage !== 'string') {
    throw new ValidationError('Payment message must be a string', 'paymentMessage');
  }

  // Validate footer (Requirement 1.8)
  validateFooter(data.footer);

  // Validate paid status
  if (typeof data.paidStatus !== 'boolean') {
    throw new ValidationError('Paid status must be a boolean', 'paidStatus');
  }
}

/**
 * Validate company header data
 */
function validateCompanyHeader(header) {
  if (!header || typeof header !== 'object') {
    throw new ValidationError('Company header is required', 'companyHeader');
  }

  const requiredFields = ['companyName', 'address', 'email', 'website'];
  for (const field of requiredFields) {
    if (!header[field]) {
      throw new ValidationError(`Company header ${field} is required`, `companyHeader.${field}`);
    }
  }

  if (typeof header.companyName !== 'string') {
    throw new ValidationError('Company name must be a string', 'companyHeader.companyName');
  }

  if (!Array.isArray(header.address) || header.address.length === 0) {
    throw new ValidationError('Company address must be a non-empty array', 'companyHeader.address');
  }

  if (typeof header.email !== 'string') {
    throw new ValidationError('Company email must be a string', 'companyHeader.email');
  }

  if (typeof header.website !== 'string') {
    throw new ValidationError('Company website must be a string', 'companyHeader.website');
  }
}

/**
 * Validate invoice metadata
 */
function validateInvoiceMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    throw new ValidationError('Invoice metadata is required', 'invoiceMetadata');
  }

  const requiredFields = [
    'invoiceNumber', 'poNumber', 'customerAccount', 'customerOrderNumber',
    'orderNumber', 'despatchNumber', 'paymentTerms', 'vatNumber'
  ];

  for (const field of requiredFields) {
    if (typeof metadata[field] !== 'string') {
      throw new ValidationError(`Invoice metadata ${field} must be a string`, `invoiceMetadata.${field}`);
    }
  }
}

/**
 * Validate customer details (invoice to or deliver to)
 */
function validateCustomerDetails(details, fieldName) {
  if (!details || typeof details !== 'object') {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }

  if (typeof details.name !== 'string' || details.name.trim() === '') {
    throw new ValidationError(`${fieldName} name must be a non-empty string`, `${fieldName}.name`);
  }

  if (!Array.isArray(details.address) || details.address.length === 0) {
    throw new ValidationError(`${fieldName} address must be a non-empty array`, `${fieldName}.address`);
  }
}

/**
 * Validate line items array
 */
function validateLineItems(lineItems) {
  if (!Array.isArray(lineItems)) {
    throw new ValidationError('Line items must be an array', 'lineItems');
  }

  if (lineItems.length === 0) {
    throw new ValidationError('Line items array cannot be empty', 'lineItems');
  }

  lineItems.forEach((item, index) => {
    validateLineItem(item, index);
  });
}

/**
 * Validate a single line item
 */
function validateLineItem(item, index) {
  if (!item || typeof item !== 'object') {
    throw new ValidationError(`Line item at index ${index} must be an object`, `lineItems[${index}]`);
  }

  // Validate required string fields
  const stringFields = ['productCode', 'description', 'unit'];
  for (const field of stringFields) {
    if (typeof item[field] !== 'string' || item[field].trim() === '') {
      throw new ValidationError(
        `Line item ${field} must be a non-empty string`,
        `lineItems[${index}].${field}`
      );
    }
  }

  // Validate numeric fields
  const numericFields = ['quantity', 'unitPrice', 'totalPrice'];
  for (const field of numericFields) {
    if (typeof item[field] !== 'number' || isNaN(item[field])) {
      throw new ValidationError(
        `Line item ${field} must be a number`,
        `lineItems[${index}].${field}`
      );
    }

    if (item[field] < 0) {
      throw new ValidationError(
        `Line item ${field} must be non-negative`,
        `lineItems[${index}].${field}`
      );
    }
  }
}

/**
 * Validate VAT rate
 */
function validateVATRate(vatRate) {
  if (typeof vatRate !== 'number' || isNaN(vatRate)) {
    throw new ValidationError('VAT rate must be a number', 'vatRate');
  }

  if (vatRate < 0 || vatRate > 1) {
    throw new ValidationError('VAT rate must be between 0 and 1', 'vatRate');
  }
}

/**
 * Validate footer data
 */
function validateFooter(footer) {
  if (!footer || typeof footer !== 'object') {
    throw new ValidationError('Footer is required', 'footer');
  }

  if (typeof footer.registrationNumber !== 'string') {
    throw new ValidationError('Footer registration number must be a string', 'footer.registrationNumber');
  }

  if (typeof footer.vatNumber !== 'string') {
    throw new ValidationError('Footer VAT number must be a string', 'footer.vatNumber');
  }
}

module.exports = {
  validateInvoiceData,
  ValidationError
};
