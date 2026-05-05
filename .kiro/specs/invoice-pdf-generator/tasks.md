# Implementation Plan: Invoice PDF Generator

## Overview

This implementation plan breaks down the invoice PDF generator into discrete, sequential tasks. The generator will use PDFKit to create pixel-perfect PDF invoices matching the sample.pdf format. Each task builds on previous work, starting with project setup, then data models, core PDF infrastructure, individual section renderers, calculations, integration, and testing.

## Tasks

- [x] 1. Set up project structure and install dependencies
  - Create `src/` directory for source code
  - Install PDFKit dependency: `npm install pdfkit --save`
  - Create main entry point file `src/index.js`
  - Create directory structure: `src/validators/`, `src/renderers/`, `src/calculators/`, `src/utils/`
  - _Requirements: 1.1, 11.1_

- [ ] 2. Implement data models and validation
  - [x] 2.1 Create data model type definitions and validation module
    - Create `src/validators/invoiceValidator.js`
    - Implement `validateInvoiceData()` function to check all required fields
    - Validate data types for all invoice data properties
    - Validate line items array is not empty
    - Validate numeric values are non-negative (prices, quantities)
    - Validate VAT rate is between 0 and 1
    - Throw descriptive ValidationError for missing or invalid fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 2.2 Write unit tests for data validation
    - Test valid invoice data passes validation
    - Test missing required fields throw ValidationError
    - Test invalid data types are rejected
    - Test negative values are rejected
    - Test empty line items array is rejected
    - Test VAT rate out of range is rejected
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 3. Implement calculation module
  - [x] 3.1 Create totals and VAT calculation logic
    - Create `src/calculators/totalsCalculator.js`
    - Implement `calculateTotals(lineItems, vatRate)` function
    - Calculate goods total by summing all line item total prices
    - Calculate VAT amount: goodsTotal * vatRate
    - Calculate final total: goodsTotal + vatAmount
    - Round all currency values to 2 decimal places using `toFixed(2)`
    - Return CalculationResult object with goodsTotal, vatAmount, finalTotal, netAmount
    - _Requirements: 6.1, 6.2, 7.3_

  - [ ]* 3.2 Write unit tests for calculation logic
    - Test VAT calculation accuracy with specific examples
    - Test totals calculation with multiple line items
    - Test rounding to 2 decimal places
    - Test edge cases: zero amounts, very large amounts
    - _Requirements: 6.1, 6.2, 7.3_

- [ ] 4. Set up core PDF generation infrastructure
  - [x] 4.1 Create PDFKit document initialization
    - Create `src/utils/pdfSetup.js`
    - Implement function to create PDFKit document with A4 page size
    - Set margins: top 50, left 50, right 50, bottom 50 points
    - Configure default font to Helvetica
    - _Requirements: 11.1, 11.3_

  - [x] 4.2 Create utility functions for formatting
    - Create `src/utils/formatters.js`
    - Implement currency formatting function (e.g., "123.45" → "£123.45")
    - Implement address line formatting function
    - _Requirements: 6.4, 7.5_

- [ ] 5. Implement section renderers
  - [x] 5.1 Implement company header renderer
    - Create `src/renderers/headerRenderer.js`
    - Implement `renderCompanyHeader(doc, data, yPosition)` function
    - Render company name with Helvetica-Bold, 16pt
    - Render company address lines
    - Render email and website
    - Include logo placeholder area (50x50 points) if logo path provided
    - Return new Y position after rendering
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.3, 10.4_

  - [x] 5.2 Implement "PAID INVOICE" text renderer
    - Add function to `src/renderers/headerRenderer.js`
    - Render "PAID INVOICE" text in top-right corner
    - Use Helvetica-Bold, 14pt
    - Position at Y: 50, right-aligned
    - Only render if paidStatus is true
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 5.3 Implement invoice metadata renderer
    - Create `src/renderers/metadataRenderer.js`
    - Implement `renderInvoiceMetadata(doc, data, yPosition)` function
    - Render two-column layout: labels (left) and values (right)
    - Display all metadata fields: invoice number, PO number, customer account, customer order number, order number, despatch number, payment terms, VAT number
    - Use Helvetica for labels (9pt, gray #666666) and values (9pt, black)
    - Row height: 15 points
    - Return new Y position after rendering
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 10.1, 10.3, 10.4, 10.8_

  - [x] 5.4 Implement customer details renderer
    - Create `src/renderers/customerRenderer.js`
    - Implement `renderCustomerDetails(doc, invoiceTo, deliverTo, yPosition)` function
    - Render two-column layout: "INVOICE TO" (left) and "DELIVER TO" (right)
    - Display customer name and address lines for both sections
    - Use Helvetica-Bold, 10pt for section headers
    - Use Helvetica, 9pt for address details
    - Column width: ~240 points each
    - Return new Y position after rendering
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 10.1, 10.3, 10.4, 10.8_

  - [x] 5.5 Implement line items table renderer
    - Create `src/renderers/tableRenderer.js`
    - Implement `renderLineItemsTable(doc, lineItems, yPosition)` function
    - Render table header row with black background (#000000) and white text (#FFFFFF)
    - Use column headers: Product Code, Description, Qty, Unit, Unit Price(GBP), Total Price(GBP)
    - Set column widths: Product Code (80pt), Description (200pt), Qty (40pt), Unit (50pt), Unit Price (70pt), Total Price (70pt)
    - Use Helvetica-Bold, 9pt for headers, height 20 points
    - Render each line item as a table row with Helvetica, 9pt, height 18 points
    - Apply 1pt light gray (#CCCCCC) borders
    - Return new Y position after rendering
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 10.1, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [x] 5.6 Implement VAT calculation section renderer
    - Create `src/renderers/vatRenderer.js`
    - Implement `renderVATSection(doc, vatData, yPosition)` function
    - Render three-column layout: GBP Rate | Net | VAT
    - Display VAT rate, net amount, and VAT amount
    - Use Helvetica, 9pt
    - Width: ~200 points total
    - Return new Y position after rendering
    - _Requirements: 6.3, 6.4, 10.1, 10.3, 10.8, 10.9_

  - [x] 5.7 Implement totals section renderer
    - Create `src/renderers/totalsRenderer.js`
    - Implement `renderTotalsSection(doc, totals, yPosition)` function
    - Render black background box (#000000)
    - Display goods total, VAT amount, and final total with white text (#FFFFFF)
    - Use Helvetica-Bold, 10pt for labels and 12pt for values
    - Width: ~200 points, height: ~80 points
    - Right-align on page
    - Format all monetary values with two decimal places
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.3, 10.4, 10.8, 10.10_

  - [x] 5.8 Implement payment details renderer
    - Create `src/renderers/paymentRenderer.js`
    - Implement `renderPaymentDetails(doc, paymentMessage, yPosition)` function
    - Render payment message in red text (#FF0000)
    - Use Helvetica-Bold, 10pt
    - Return new Y position after rendering
    - _Requirements: 8.1, 8.2, 10.1, 10.3, 10.4, 10.8, 10.11_

  - [x] 5.9 Implement footer renderer
    - Create `src/renderers/footerRenderer.js`
    - Implement `renderFooter(doc, footer)` function
    - Render footer at page bottom (Y: page height - 30)
    - Display company registration number and VAT number
    - Use Helvetica, 8pt, centered text
    - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.3, 10.4, 10.8, 10.12_

- [x] 6. Checkpoint - Ensure all section renderers are implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement main invoice generator module
  - [x] 7.1 Create main generator orchestration
    - Create `src/invoiceGenerator.js`
    - Implement `generateInvoice(invoiceData, outputPath)` async function
    - Call validateInvoiceData() to validate input
    - Call calculateTotals() to compute financial values
    - Initialize PDFKit document with A4 page size and margins
    - Call section renderers in sequence: header, metadata, customer details, table, VAT, totals, payment, footer
    - Pass Y positions between renderers to maintain layout flow
    - Handle logo loading (if provided) with fallback if file not found
    - Write PDF to output file path using streams
    - Handle file system errors (output path not writable, disk space issues)
    - Overwrite existing file if output path already exists
    - _Requirements: 1.1, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 7.2 Write unit tests for main generator (with mocked PDFKit)
    - Test that each section renderer is called with correct parameters
    - Test that Y-position is updated correctly after each section
    - Test that correct fonts and colors are applied
    - Test error handling for invalid output path
    - Test error handling for missing logo file
    - _Requirements: 1.1, 11.1, 11.2, 11.3, 11.4_

- [ ] 8. Create example usage and test data
  - [x] 8.1 Create example script with sample data
    - Create `examples/generateSampleInvoice.js`
    - Define sample invoice data matching the InvoiceData model
    - Include multiple line items (at least 3)
    - Call generateInvoice() with sample data and output path
    - Add console logging for success/error
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x] 8.2 Create test fixtures for integration tests
    - Create `test/fixtures/` directory
    - Create minimal valid invoice fixture (1 line item)
    - Create complex invoice fixture (10+ line items)
    - Create edge case fixtures (long descriptions, large quantities, high prices)
    - Create invalid data fixtures for error testing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 9. Integration testing and validation
  - [ ]* 9.1 Write end-to-end integration tests
    - Test PDF generation with sample data
    - Verify output file is created
    - Verify file size is reasonable (> 0 bytes)
    - Verify PDF is readable by parsing with pdf-parse library
    - Test error handling for invalid output path
    - Test error handling for missing logo file
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 9.2 Perform visual validation against sample.pdf
    - Generate PDF from known test data
    - Manually compare generated PDF against sample.pdf reference
    - Verify layout matches: header, metadata, customer details, table, totals, footer positions
    - Verify fonts and font sizes match
    - Verify colors match (black backgrounds, red text, white text)
    - Verify spacing and alignment match
    - Document any deviations and adjust renderers as needed
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12, 10.13_

- [x] 10. Final checkpoint and documentation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The design document explicitly states property-based testing is not applicable for this feature
- Testing focuses on unit tests for calculations/validation and integration tests for PDF generation
- Visual validation (task 9.2) is critical for ensuring pixel-perfect layout matching
- PDFKit provides precise control needed for exact layout replication
