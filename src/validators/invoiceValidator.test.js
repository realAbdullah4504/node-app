const { validateInvoiceData, ValidationError } = require('./invoiceValidator');

// Valid test data
const validInvoiceData = {
  companyHeader: {
    companyName: 'Astro Imports',
    address: ['123 Business St', 'London', 'UK'],
    email: 'info@astroimports.com',
    website: 'www.astroimports.com',
    logoPath: null
  },
  invoiceMetadata: {
    invoiceNumber: 'INV-001',
    poNumber: 'PO-123',
    customerAccount: 'ACC-456',
    customerOrderNumber: 'ORD-789',
    orderNumber: 'ORD-001',
    despatchNumber: 'DSP-001',
    paymentTerms: 'Net 30',
    vatNumber: 'GB123456789'
  },
  invoiceTo: {
    name: 'Customer Name',
    address: ['456 Customer Ave', 'Manchester', 'UK']
  },
  deliverTo: {
    name: 'Delivery Name',
    address: ['789 Delivery Rd', 'Birmingham', 'UK']
  },
  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'Test Product',
      quantity: 2,
      unit: 'pcs',
      unitPrice: 10.50,
      totalPrice: 21.00
    }
  ],
  vatRate: 0.20,
  paymentMessage: 'Invoice paid many thanks',
  footer: {
    registrationNumber: 'REG123456',
    vatNumber: 'GB123456789'
  },
  paidStatus: true
};

// Test 1: Valid data should pass
console.log('Test 1: Valid invoice data...');
try {
  validateInvoiceData(validInvoiceData);
  console.log('✓ PASS: Valid data accepted\n');
} catch (error) {
  console.log('✗ FAIL:', error.message, '\n');
}

// Test 2: Missing company header
console.log('Test 2: Missing company header...');
try {
  const invalidData = { ...validInvoiceData, companyHeader: null };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

// Test 3: Empty line items
console.log('Test 3: Empty line items array...');
try {
  const invalidData = { ...validInvoiceData, lineItems: [] };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

// Test 4: Negative price
console.log('Test 4: Negative unit price...');
try {
  const invalidData = {
    ...validInvoiceData,
    lineItems: [{
      ...validInvoiceData.lineItems[0],
      unitPrice: -10
    }]
  };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

// Test 5: Invalid VAT rate (> 1)
console.log('Test 5: VAT rate greater than 1...');
try {
  const invalidData = { ...validInvoiceData, vatRate: 1.5 };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

// Test 6: Invalid VAT rate (< 0)
console.log('Test 6: VAT rate less than 0...');
try {
  const invalidData = { ...validInvoiceData, vatRate: -0.2 };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

// Test 7: Missing required metadata field
console.log('Test 7: Missing invoice number...');
try {
  const invalidData = {
    ...validInvoiceData,
    invoiceMetadata: {
      ...validInvoiceData.invoiceMetadata,
      invoiceNumber: undefined
    }
  };
  validateInvoiceData(invalidData);
  console.log('✗ FAIL: Should have thrown error\n');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ PASS:', error.message, '\n');
  } else {
    console.log('✗ FAIL: Wrong error type\n');
  }
}

console.log('All tests completed!');
