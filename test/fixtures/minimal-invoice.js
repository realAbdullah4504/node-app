/**
 * Minimal valid invoice fixture with 1 line item
 * Used for basic integration testing
 */

module.exports = {
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

  vatRate: 0.20,

  paymentMessage: '**Invoice paid many thanks **',

  footer: {
    registrationNumber: 'Company Registration No: 12345678',
    vatNumber: 'VAT No: GB123456789'
  },

  paidStatus: true
};
