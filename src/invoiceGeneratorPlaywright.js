const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { validateInvoiceData } = require('./validators/invoiceValidator');
const { calculateTotals } = require('./calculators/totalsCalculator');

function resolveAssetSrc(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') {
    return assetPath;
  }

  const trimmed = assetPath.trim();

  // Keep absolute/remote/data URLs unchanged.
  if (/^(data:|https?:|file:)/i.test(trimmed)) {
    return trimmed;
  }

  // Treat everything else as a local filesystem path.
  const absolutePath = path.isAbsolute(trimmed)
    ? trimmed
    : path.resolve(process.cwd(), trimmed);

  try {
    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    let mimeType = null;

    if (ext === '.png') {
      mimeType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.svg') {
      mimeType = 'image/svg+xml';
    } else if (ext === '.webp') {
      mimeType = 'image/webp';
    }

    if (mimeType) {
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    }
  } catch (e) {
    return pathToFileURL(absolutePath).href;
  }

  return pathToFileURL(absolutePath).href;
}

/**
 * Generate invoice HTML from data
 */
function generateInvoiceHTML(invoiceData, totals) {
  const vatRatePercent = (invoiceData.vatRate * 100).toFixed(2);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      line-height: 1.3;
      color: #000;
    }
    
    .page {
      width: 100%;
      position: relative;
    }
    
    .paid-invoice {
      position: absolute;
      right: 10px;
      font-size: 10pt;
      font-weight: bold;
      color: #000;
      letter-spacing: 1px;
      z-index: 10;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .company-info {
      width: 50%;
      padding: 10px;
      min-height: 120px;
    }
    
    .logo-container {
      margin-bottom: 8px;
    }
    
    .logo-container img {
      max-width: 150px;
      max-height: 60px;
      display: block;
      mix-blend-mode: multiply;
    }
    
    .company-name {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .company-details {
      font-size: 7.5pt;
      line-height: 1.4;
    }
    
    .invoice-meta {
      width: 45%;
      padding: 10px;
      font-size: 7.5pt;
    }
    
    .invoice-meta table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .invoice-meta td {
      padding: 1px 0;
      vertical-align: top;
    }
    
    .invoice-meta td:first-child {
      font-weight: bold;
      width: 55%;
    }
    
    .invoice-meta td:last-child {
      text-align: left;
    }
    
    .customer-section {
      display: flex;
      gap: 30px;
      margin: 15px 0;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 8px 0;
    }
    
    .customer-box {
      flex: 1;
    }
    
    .customer-box h3 {
      font-size: 8pt;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .customer-box p {
      font-size: 7.5pt;
      line-height: 1.4;
    }
    
    .line-items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 7pt;
    }
    
    .line-items-table thead {
      background: #000;
      color: #fff;
    }
    
    .line-items-table th {
      padding: 4px 3px;
      text-align: left;
      font-weight: bold;
      font-size: 7pt;
      border: 1px solid #000;
    }
    
    .line-items-table td {
      padding: 2px 3px;
      border: 1px solid #ccc;
      font-size: 6.5pt;
      vertical-align: top;
    }
    
    .line-items-table .qty,
    .line-items-table .unit-price,
    .line-items-table .total-price {
      text-align: right;
    }
    
    .line-items-table th.qty,
    .line-items-table th.unit-price,
    .line-items-table th.total-price {
      text-align: right;
    }
    
    .bottom-section {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    
    .vat-section {
      width: 45%;
      font-size: 7.5pt;
    }
    
    .vat-section h4 {
      font-size: 7.5pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .vat-table {
      border-collapse: collapse;
      width: 100%;
    }
    
    .vat-table th {
      padding: 3px 5px;
      text-align: left;
      font-size: 7pt;
      font-weight: bold;
      border-bottom: 1px solid #000;
    }
    
    .vat-table td {
      padding: 3px 5px;
      text-align: left;
      font-size: 7pt;
    }
    
    .totals-box {
      background: #000;
      color: #fff;
      padding: 8px 10px;
      width: 180px;
    }
    
    .totals-box table {
      width: 100%;
    }
    
    .totals-box td {
      padding: 2px 0;
      font-size: 8pt;
    }
    
    .totals-box td:first-child {
      font-weight: normal;
    }
    
    .totals-box td:last-child {
      text-align: right;
      font-weight: bold;
    }
    
    .totals-box .total-row td {
      font-size: 9pt;
      font-weight: bold;
      padding-top: 5px;
      border-top: 1px solid #fff;
    }
    
    .payment-details {
      margin: 15px 0;
      font-size: 7.5pt;
    }
    
    .payment-details h4 {
      font-size: 7.5pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .payment-message {
      color: #ff0000;
      font-weight: bold;
      font-size: 11pt;
      margin: 15px 0;
      text-align: center;
    }
    
    .footer {
      display: flex;
      justify-content: center;
      font-size: 7pt;
      margin-top: 30px;
      padding-top: 10px;
    }
    
    .footer span {
      margin: 0 15px;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="page">
    ${invoiceData.paidStatus ? '<div class="paid-invoice">PAID INVOICE</div>' : ''}
    
    <div class="header">
      <div class="company-info">
        ${invoiceData.companyHeader.logoPath ? `
        <div class="logo-container">
          <img src="${invoiceData.companyHeader.logoPath}" alt="${invoiceData.companyHeader.companyName}">
        </div>
        ` : `
        <div class="company-name">${invoiceData.companyHeader.companyName}</div>
        `}
        <div class="company-details">
          ${invoiceData.companyHeader.address.join('<br>')}
          <br>Email: ${invoiceData.companyHeader.email}
          <br>Website: ${invoiceData.companyHeader.website}
        </div>
      </div>
      
      <div class="invoice-meta">
        <table>
          <tr><td>Invoice Number:</td><td>${invoiceData.invoiceMetadata.invoiceNumber}</td></tr>
          <tr><td>Date:</td><td>${invoiceData.invoiceMetadata.date || ''}</td></tr>
          <tr><td>Customer Account:</td><td>${invoiceData.invoiceMetadata.customerAccount}</td></tr>
          <tr><td>Customer Order No:</td><td>${invoiceData.invoiceMetadata.customerOrderNumber}</td></tr>
          <tr><td>Order Number:</td><td>${invoiceData.invoiceMetadata.orderNumber}</td></tr>
          <tr><td>Despatch Number:</td><td>${invoiceData.invoiceMetadata.despatchNumber}</td></tr>
          <tr><td>Payment Terms:</td><td>${invoiceData.invoiceMetadata.paymentTerms}</td></tr>
          <tr><td>VAT Number:</td><td>${invoiceData.invoiceMetadata.vatNumber}</td></tr>
        </table>
      </div>
    </div>
    
    <div class="customer-section">
      <div class="customer-box">
        <h3>INVOICE TO:</h3>
        <p>
          <strong>${invoiceData.invoiceTo.name}</strong><br>
          ${invoiceData.invoiceTo.address.join('<br>')}
        </p>
      </div>
      
      <div class="customer-box">
        <h3>DELIVER TO:</h3>
        <p>
          <strong>${invoiceData.deliverTo.name}</strong><br>
          ${invoiceData.deliverTo.address.join('<br>')}
        </p>
      </div>
    </div>
    
    <table class="line-items-table">
      <thead>
        <tr>
          <th style="width: 12%;">Product Code</th>
          <th style="width: 42%;">Description</th>
          <th class="qty" style="width: 8%;">Qty</th>
          <th style="width: 10%;">Unit</th>
          <th class="unit-price" style="width: 14%;">Unit Price(GBP)</th>
          <th class="total-price" style="width: 14%;">Total Price(GBP)</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceData.lineItems.map(item => `
          <tr>
            <td>${item.productCode}</td>
            <td>${item.description}</td>
            <td class="qty">${item.quantity}</td>
            <td>${item.unit}</td>
            <td class="unit-price">${item.unitPrice.toFixed(2)}</td>
            <td class="total-price">${item.totalPrice.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="bottom-section">
      <div class="vat-section">
        <h4>Pounds Sterling (GBP) For VAT Purposes</h4>
        <table class="vat-table">
          <thead>
            <tr>
              <th>Rate</th>
              <th>Net Amount</th>
              <th>VAT Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${vatRatePercent} %</td>
              <td>${totals.netAmount.toFixed(2)}</td>
              <td>${totals.vatAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="payment-details">
          <h4>Payment Details:</h4>
          <div>Paid Amount: GBP ${totals.finalTotal.toFixed(2)}</div>
          <div>Payment Method: Mastercard (**4492)</div>
        </div>
      </div>
      
      <div class="totals-box">
        <table>
          <tr>
            <td>Goods(GBP)</td>
            <td>${totals.goodsTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Delivery</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>VAT</td>
            <td>${totals.vatAmount.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Total(GBP)</td>
            <td>${totals.finalTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>
    </div>
    
    <div class="payment-message">
      ${invoiceData.paymentMessage}
    </div>
    
    <div class="footer">
      <span>Registered Company: ${invoiceData.footer.registrationNumber}</span>
      <span>VAT Number: ${invoiceData.footer.vatNumber}</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate invoice PDF using Playwright
 */
async function generateInvoice(invoiceData, outputPath) {
  // Validate input data
  validateInvoiceData(invoiceData);

  // Calculate totals
  const totals = calculateTotals(invoiceData.lineItems, invoiceData.vatRate);

  // Normalize local asset paths to data URIs so Playwright can load them when using page.setContent
  if (invoiceData && invoiceData.companyHeader && invoiceData.companyHeader.logoPath) {
    invoiceData.companyHeader.logoPath = resolveAssetSrc(invoiceData.companyHeader.logoPath);
  }

  // Generate HTML
  const html = generateInvoiceHTML(invoiceData, totals);

  // Launch browser and generate PDF
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: 'load' });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });

  await browser.close();
}

module.exports = {
  generateInvoice
};
