/**
 * Complex invoice fixture with 10+ line items
 * Used for testing table rendering with many rows
 */

module.exports = {
  companyHeader: {
    companyName: 'Astro Imports',
    address: ['123 Business Street', 'London', 'SW1A 1AA', 'United Kingdom'],
    email: 'info@astroimports.com',
    website: 'www.astroimports.com',
    logoPath: null
  },

  invoiceMetadata: {
    invoiceNumber: 'INV-2024-999',
    poNumber: 'PO-99999',
    customerAccount: 'CUST-999',
    customerOrderNumber: 'ORD-999',
    orderNumber: 'ORD-999',
    despatchNumber: 'DSP-999',
    paymentTerms: '30 days',
    vatNumber: 'GB999999999'
  },

  invoiceTo: {
    name: 'Large Corporation Ltd',
    address: ['789 Enterprise Blvd', 'Manchester', 'M1 1AA', 'United Kingdom']
  },

  deliverTo: {
    name: 'Large Corporation Ltd - Warehouse',
    address: ['321 Distribution Center', 'Birmingham', 'B1 1AA', 'United Kingdom']
  },

  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'Premium Widget Set',
      quantity: 10,
      unit: 'Box',
      unitPrice: 25.50,
      totalPrice: 255.00
    },
    {
      productCode: 'PROD-002',
      description: 'Deluxe Gadget Assembly',
      quantity: 5,
      unit: 'Unit',
      unitPrice: 150.00,
      totalPrice: 750.00
    },
    {
      productCode: 'PROD-003',
      description: 'Standard Component Pack',
      quantity: 20,
      unit: 'Pack',
      unitPrice: 12.75,
      totalPrice: 255.00
    },
    {
      productCode: 'PROD-004',
      description: 'Industrial Tool Kit',
      quantity: 3,
      unit: 'Set',
      unitPrice: 299.99,
      totalPrice: 899.97
    },
    {
      productCode: 'PROD-005',
      description: 'Office Supply Bundle',
      quantity: 15,
      unit: 'Bundle',
      unitPrice: 45.00,
      totalPrice: 675.00
    },
    {
      productCode: 'PROD-006',
      description: 'Safety Equipment Package',
      quantity: 8,
      unit: 'Package',
      unitPrice: 75.50,
      totalPrice: 604.00
    },
    {
      productCode: 'PROD-007',
      description: 'Electronic Component Set',
      quantity: 50,
      unit: 'Unit',
      unitPrice: 8.25,
      totalPrice: 412.50
    },
    {
      productCode: 'PROD-008',
      description: 'Maintenance Kit Pro',
      quantity: 12,
      unit: 'Kit',
      unitPrice: 120.00,
      totalPrice: 1440.00
    },
    {
      productCode: 'PROD-009',
      description: 'Cleaning Supplies Set',
      quantity: 25,
      unit: 'Set',
      unitPrice: 18.99,
      totalPrice: 474.75
    },
    {
      productCode: 'PROD-010',
      description: 'Storage Container Large',
      quantity: 30,
      unit: 'Unit',
      unitPrice: 22.50,
      totalPrice: 675.00
    },
    {
      productCode: 'PROD-011',
      description: 'Protective Gear Bundle',
      quantity: 6,
      unit: 'Bundle',
      unitPrice: 185.00,
      totalPrice: 1110.00
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
