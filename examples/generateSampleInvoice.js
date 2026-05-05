/**
 * Example script demonstrating invoice PDF generation
 * This script generates a sample invoice with multiple line items
 */

const { generateInvoice } = require('../src/index');
const path = require('path');

// Sample invoice data matching the InvoiceData model
const sampleInvoiceData = {
  companyHeader: {
    companyName: 'Astro Imports',
    address: [
      '123 Business Street',
      'London',
      'SW1A 1AA',
      'United Kingdom'
    ],
    email: 'info@astroimports.com',
    website: 'www.astroimports.com',
    logoPath: './logo.png' // Path to logo image (optional)
  },

  invoiceMetadata: {
    invoiceNumber: 'INV-2024-001',
    poNumber: 'PO-12345',
    customerAccount: 'CUST-789',
    customerOrderNumber: 'ORD-456',
    orderNumber: 'ORD-789',
    despatchNumber: 'DSP-321',
    paymentTerms: '30 days',
    vatNumber: 'GB123456789'
  },

  invoiceTo: {
    name: 'ABC Corporation Ltd',
    address: [
      '456 Client Avenue',
      'Manchester',
      'M1 1AA',
      'United Kingdom'
    ]
  },

  deliverTo: {
    name: 'ABC Corporation Ltd - Warehouse',
    address: [
      '789 Delivery sdasdasdasda',
      'Birmingham',
      'B1 1AA',
      'United Kingdom'
    ]
  },

  lineItems: [
    {
      productCode: 'PROD-001',
      description: 'hello world',
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
      description: 'hello world',
      quantity: 10,
      unit: 'Box',
      unitPrice: 25.50,
      totalPrice: 255.00
    },
    {
      productCode: 'PROD-005',
      description: 'hello world',
      quantity: 10,
      unit: 'Box',
      unitPrice: 25.50,
      totalPrice: 255.00
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

// Output path for the generated PDF
const outputPath = path.join(__dirname, '..', 'sample-invoice-output.pdf');

// Generate the invoice
console.log('Generating sample invoice...');
console.log(`Output path: ${outputPath}`);

generateInvoice(sampleInvoiceData, outputPath)
  .then(() => {
    console.log('✓ Invoice generated successfully!');
    console.log(`✓ PDF saved to: ${outputPath}`);
  })
  .catch((error) => {
    console.error('✗ Error generating invoice:');
    console.error(error.message);
    process.exit(1);
  });
