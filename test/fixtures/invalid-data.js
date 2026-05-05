/**
 * Invalid data fixtures for error testing
 * Each export represents a different validation error scenario
 */

// Missing required field: companyHeader
const missingCompanyHeader = {
  invoiceMetadata: {
    invoiceNumber: 'INV-001',
    poNumber: 'PO-001',
    customerAccount: 'CUST-001',
    customerOrderNumber: 'ORD-001',
    orderNumber: 'ORD-001',
    despatchNumber: 'DSP-001',
    paymentTerms: '30 days',
    vatNumber: 'GB123456789'
  },
  invoiceTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  deliverTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'Test Product',
      quantity: 1,
      unit: 'Unit',
      unitPrice: 100.00,
      totalPrice: 100.00
    }
  ],
  vatRate: 0.20,
  paymentMessage: '**Invoice paid many thanks **',
  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB123456789'
  },
  paidStatus: true
};

// Empty line items array
const emptyLineItems = {
  companyHeader: {
    companyName: 'Test Company',
    address: ['123 Test St', 'London', 'SW1A 1AA', 'UK'],
    email: 'test@example.com',
    website: 'www.example.com',
    logoPath: null
  },
  invoiceMetadata: {
    invoiceNumber: 'INV-001',
    poNumber: 'PO-001',
    customerAccount: 'CUST-001',
    customerOrderNumber: 'ORD-001',
    orderNumber: 'ORD-001',
    despatchNumber: 'DSP-001',
    paymentTerms: '30 days',
    vatNumber: 'GB123456789'
  },
  invoiceTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  deliverTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  lineItems: [],
  vatRate: 0.20,
  paymentMessage: '**Invoice paid many thanks **',
  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB123456789'
  },
  paidStatus: true
};

// Negative price
const negativePrice = {
  companyHeader: {
    companyName: 'Test Company',
    address: ['123 Test St', 'London', 'SW1A 1AA', 'UK'],
    email: 'test@example.com',
    website: 'www.example.com',
    logoPath: null
  },
  invoiceMetadata: {
    invoiceNumber: 'INV-001',
    poNumber: 'PO-001',
    customerAccount: 'CUST-001',
    customerOrderNumber: 'ORD-001',
    orderNumber: 'ORD-001',
    despatchNumber: 'DSP-001',
    paymentTerms: '30 days',
    vatNumber: 'GB123456789'
  },
  invoiceTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  deliverTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'Test Product',
      quantity: 1,
      unit: 'Unit',
      unitPrice: -100.00,
      totalPrice: -100.00
    }
  ],
  vatRate: 0.20,
  paymentMessage: '**Invoice paid many thanks **',
  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB123456789'
  },
  paidStatus: true
};

// Invalid VAT rate (out of range)
const invalidVatRate = {
  companyHeader: {
    companyName: 'Test Company',
    address: ['123 Test St', 'London', 'SW1A 1AA', 'UK'],
    email: 'test@example.com',
    website: 'www.example.com',
    logoPath: null
  },
  invoiceMetadata: {
    invoiceNumber: 'INV-001',
    poNumber: 'PO-001',
    customerAccount: 'CUST-001',
    customerOrderNumber: 'ORD-001',
    orderNumber: 'ORD-001',
    despatchNumber: 'DSP-001',
    paymentTerms: '30 days',
    vatNumber: 'GB123456789'
  },
  invoiceTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  deliverTo: {
    name: 'Test Customer',
    address: ['456 Customer St', 'London', 'E1 1AA', 'UK']
  },
  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'Test Product',
      quantity: 1,
      unit: 'Unit',
      unitPrice: 100.00,
      totalPrice: 100.00
    }
  ],
  vatRate: 1.5,
  paymentMessage: '**Invoice paid many thanks **',
  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB123456789'
  },
  paidStatus: true
};

module.exports = {
  missingCompanyHeader,
  emptyLineItems,
  negativePrice,
  invalidVatRate
};
