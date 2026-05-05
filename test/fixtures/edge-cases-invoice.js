/**
 * Edge case invoice fixture
 * Tests long descriptions, large quantities, and high prices
 */

module.exports = {
  companyHeader: {
    companyName: 'Edge Case Testing Company Ltd',
    address: ['999 Extreme Testing Boulevard', 'London', 'SW1A 1AA', 'United Kingdom'],
    email: 'edge-cases@testing.com',
    website: 'www.edge-case-testing.com',
    logoPath: null
  },

  invoiceMetadata: {
    invoiceNumber: 'INV-EDGE-001',
    poNumber: 'PO-EDGE-001',
    customerAccount: 'CUST-EDGE-001',
    customerOrderNumber: 'ORD-EDGE-001',
    orderNumber: 'ORD-EDGE-001',
    despatchNumber: 'DSP-EDGE-001',
    paymentTerms: '30 days',
    vatNumber: 'GB999999999'
  },

  invoiceTo: {
    name: 'Very Long Customer Name Corporation International Holdings Ltd',
    address: [
      '123456 Extremely Long Street Name Avenue Boulevard',
      'London',
      'SW1A 1AA',
      'United Kingdom'
    ]
  },

  deliverTo: {
    name: 'Very Long Customer Name Corporation International Holdings Ltd',
    address: [
      '123456 Extremely Long Street Name Avenue Boulevard',
      'London',
      'SW1A 1AA',
      'United Kingdom'
    ]
  },

  lineItems: [
    {
      productCode: 'PROD-LONG-001',
      description: 'This is an extremely long product description that tests how the PDF generator handles text wrapping and overflow in the description column of the line items table',
      quantity: 9999,
      unit: 'Unit',
      unitPrice: 0.01,
      totalPrice: 99.99
    },
    {
      productCode: 'PROD-HIGH-002',
      description: 'High Value Item',
      quantity: 1,
      unit: 'Unit',
      unitPrice: 999999.99,
      totalPrice: 999999.99
    },
    {
      productCode: 'PROD-LARGE-003',
      description: 'Large Quantity Item',
      quantity: 100000,
      unit: 'Unit',
      unitPrice: 1.50,
      totalPrice: 150000.00
    },
    {
      productCode: 'PROD-DECIMAL-004',
      description: 'Decimal Precision Test',
      quantity: 3,
      unit: 'Unit',
      unitPrice: 33.33,
      totalPrice: 99.99
    }
  ],

  vatRate: 0.20,

  paymentMessage: '**Invoice paid many thanks **',

  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB999999999'
  },

  paidStatus: true
};
