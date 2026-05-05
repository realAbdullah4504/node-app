const { generateInvoice } = require('./src/index');
const sampleData = require('./examples/generateSampleInvoice.js');

// Use the sample data from the example file
const invoiceData = {
  companyHeader: {
    companyName: 'Abdullah javed',
    address: ['house no', 'Lancashire M7 1SS', 'United Kingdom'],
    email: 'info@astroimports.co.uk',
    website: 'www.astroimports.co.uk',
    logoPath: 'logo.png'
  },
  invoiceMetadata: {
    invoiceNumber: '97404174',
    date: '16/01/2026',
    customerAccount: '30134182',
    customerOrderNumber: 'CC-JG-WEB-116126',
    orderNumber: '2826033',
    despatchNumber: '336517',
    paymentTerms: 'Paid In Full',
    vatNumber: 'GB 160442253'
  },
  invoiceTo: {
    name: 'TECXONE LTD',
    address: ['71-75 Shelton Street', 'Covent Garden', 'London, WC2H 9JQ', 'United Kingdom']
  },
  deliverTo: {
    name: 'Atif Ali',
    address: ['71-75 Shelton Street', 'Covent Garden', 'London, WC2H 9JQ', 'United Kingdom']
  },
  lineItems: [
    { productCode: 'fsjfdsfjsf99999', description: 'Kids Girls K-Pop Demon Hunters Cosplay Costume', quantity: 50, unit: 'EACH', unitPrice: 8.89, totalPrice: 444.50 },
    { productCode: 'VP63295', description: 'Kids Girls K-Pop Demon Hunters Cosplay Costume', quantity: 30, unit: 'EACH', unitPrice: 8.89, totalPrice: 266.70 }
  ],
  vatRate: 0.20,
  paymentMessage: '**Invoice paid many thanks **',
  footer: {
    registrationNumber: 'Astro Imports ( 05813704 )',
    vatNumber: '( GB 160442253 )'
  },
  paidStatus: true
};

generateInvoice(invoiceData, 'invoice-with-logo.pdf')
  .then(() => console.log('✓ PDF generated successfully!'))
  .catch(err => console.error('✗ Error:', err.message));
