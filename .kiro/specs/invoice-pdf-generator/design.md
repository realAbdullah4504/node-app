# Design Document: Invoice PDF Generator

## Overview

The Invoice PDF Generator is a Node.js script that generates professional PDF invoices matching the exact format and layout shown in sample.pdf. The system accepts structured invoice data as input and produces pixel-perfect PDF documents with company branding, invoice metadata, customer details, itemized line items, VAT calculations, and payment information.

The design prioritizes exact visual fidelity to the reference sample, requiring precise control over layout, typography, colors, and spacing. The generator will be implemented as a standalone module that can be integrated into larger invoicing systems or used as a command-line tool.

## Architecture

### Technology Stack

**PDF Library: PDFKit**

We've selected PDFKit as the PDF generation library for the following reasons:

- **Low-level control**: PDFKit provides precise control over positioning, fonts, colors, and layout - essential for pixel-perfect replication
- **Mature and stable**: Well-established library with extensive documentation and community support
- **Rich feature set**: Supports tables, images, custom fonts, colors, and complex layouts
- **Stream-based**: Efficient memory usage for generating PDFs
- **Active maintenance**: Regular updates and bug fixes

Alternative libraries considered:
- **jsPDF**: More suited for client-side generation, less precise control over layout
- **pdfmake**: Declarative approach is less flexible for exact pixel-perfect matching

**Runtime**: Node.js (v14+)

**Dependencies**:
- `pdfkit`: ^0.13.0 - Core PDF generation
- `fs`: Built-in - File system operations

### System Architecture

```
┌─────────────────┐
│  Invoice Data   │
│   (JSON Input)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Invoice Generator Module      │
│  ┌───────────────────────────┐  │
│  │  Data Validator           │  │
│  └───────────┬───────────────┘  │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  Layout Engine            │  │
│  │  - Position Calculator    │  │
│  │  - Section Renderer       │  │
│  └───────────┬───────────────┘  │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  PDFKit Document Builder  │  │
│  └───────────┬───────────────┘  │
└──────────────┼───────────────────┘
               ▼
       ┌───────────────┐
       │  PDF File     │
       │  (Output)     │
       └───────────────┘
```

## Components and Interfaces

### 1. Invoice Generator Module

**Purpose**: Main entry point that orchestrates the PDF generation process

**Interface**:
```javascript
/**
 * Generate an invoice PDF from structured data
 * @param {InvoiceData} invoiceData - The invoice data structure
 * @param {string} outputPath - File path for the generated PDF
 * @returns {Promise<void>}
 */
async function generateInvoice(invoiceData, outputPath)
```

### 2. Data Validator

**Purpose**: Validates input data structure and ensures all required fields are present

**Interface**:
```javascript
/**
 * Validate invoice data structure
 * @param {InvoiceData} data - The invoice data to validate
 * @throws {ValidationError} If data is invalid or missing required fields
 */
function validateInvoiceData(data)
```

### 3. Layout Engine

**Purpose**: Calculates positions and dimensions for all invoice sections

**Components**:
- **Position Calculator**: Computes x, y coordinates for each element
- **Section Renderers**: Specialized functions for rendering each invoice section

**Interface**:
```javascript
/**
 * Render company header section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {CompanyHeader} data - Company header data
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderCompanyHeader(doc, data, yPosition)

/**
 * Render invoice metadata section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {InvoiceMetadata} data - Invoice metadata
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderInvoiceMetadata(doc, data, yPosition)

/**
 * Render customer details sections (Invoice To / Deliver To)
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {CustomerDetails} invoiceTo - Billing details
 * @param {CustomerDetails} deliverTo - Delivery details
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderCustomerDetails(doc, invoiceTo, deliverTo, yPosition)

/**
 * Render line items table
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {LineItem[]} lineItems - Array of line items
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderLineItemsTable(doc, lineItems, yPosition)

/**
 * Render VAT calculation section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {VATCalculation} vatData - VAT calculation data
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderVATSection(doc, vatData, yPosition)

/**
 * Render totals section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Totals} totals - Totals data
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderTotalsSection(doc, totals, yPosition)

/**
 * Render payment details section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {string} paymentMessage - Payment message text
 * @param {number} yPosition - Starting Y position
 * @returns {number} - New Y position after rendering
 */
function renderPaymentDetails(doc, paymentMessage, yPosition)

/**
 * Render footer section
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Footer} footer - Footer data
 */
function renderFooter(doc, footer)
```

### 4. Calculation Module

**Purpose**: Performs financial calculations for VAT and totals

**Interface**:
```javascript
/**
 * Calculate invoice totals and VAT
 * @param {LineItem[]} lineItems - Array of line items
 * @param {number} vatRate - VAT rate as decimal (e.g., 0.20 for 20%)
 * @returns {CalculationResult}
 */
function calculateTotals(lineItems, vatRate)
```

## Data Models

### InvoiceData
```javascript
{
  companyHeader: {
    companyName: string,
    address: string[],      // Array of address lines
    email: string,
    website: string,
    logoPath: string | null // Optional path to logo image
  },
  
  invoiceMetadata: {
    invoiceNumber: string,
    poNumber: string,
    customerAccount: string,
    customerOrderNumber: string,
    orderNumber: string,
    despatchNumber: string,
    paymentTerms: string,
    vatNumber: string
  },
  
  invoiceTo: {
    name: string,
    address: string[]       // Array of address lines
  },
  
  deliverTo: {
    name: string,
    address: string[]       // Array of address lines
  },
  
  lineItems: [
    {
      productCode: string,
      description: string,
      quantity: number,
      unit: string,
      unitPrice: number,    // In GBP
      totalPrice: number    // In GBP
    }
  ],
  
  vatRate: number,          // VAT rate as decimal (e.g., 0.20 for 20%)
  
  paymentMessage: string,   // e.g., "**Invoice paid many thanks **"
  
  footer: {
    registrationNumber: string,
    vatNumber: string
  },
  
  paidStatus: boolean       // Whether to show "PAID INVOICE" text
}
```

### CalculationResult
```javascript
{
  goodsTotal: number,       // Sum of all line item totals
  vatAmount: number,        // Calculated VAT amount
  finalTotal: number,       // Goods total + VAT
  netAmount: number         // Same as goodsTotal (for VAT section)
}
```

### ValidationError
```javascript
{
  message: string,
  field: string | null,     // Field that failed validation
  errors: string[]          // Array of validation error messages
}
```

## Layout Specifications

### Page Setup
- **Page Size**: A4 (595.28 x 841.89 points)
- **Margins**: 
  - Top: 50 points
  - Left: 50 points
  - Right: 50 points
  - Bottom: 50 points

### Typography
Based on analysis of sample.pdf:

- **Company Name**: Helvetica-Bold, 16pt
- **Section Headers** (INVOICE TO, DELIVER TO): Helvetica-Bold, 10pt
- **Metadata Labels**: Helvetica, 9pt
- **Metadata Values**: Helvetica, 9pt
- **Table Headers**: Helvetica-Bold, 9pt, white text
- **Table Content**: Helvetica, 9pt
- **Totals Labels**: Helvetica-Bold, 10pt, white text
- **Totals Values**: Helvetica-Bold, 12pt, white text
- **Payment Message**: Helvetica-Bold, 10pt, red (#FF0000)
- **Footer**: Helvetica, 8pt
- **"PAID INVOICE" text**: Helvetica-Bold, 14pt, positioned top-right

### Color Palette
- **Black**: #000000 (table headers, totals box background)
- **White**: #FFFFFF (text on black backgrounds)
- **Red**: #FF0000 (payment message)
- **Gray**: #666666 (metadata labels)
- **Light Gray**: #CCCCCC (table borders)

### Section Positioning

**Company Header** (Y: 50)
- Logo placeholder area: 50x50 points (if logo provided)
- Company name and details: Right-aligned or centered

**"PAID INVOICE" Text** (Y: 50, X: right-aligned)
- Positioned in top-right corner

**Invoice Metadata** (Y: ~120)
- Two-column layout
- Left column: Labels
- Right column: Values
- Row height: 15 points

**Customer Details** (Y: ~220)
- Two-column layout
- Left: "INVOICE TO"
- Right: "DELIVER TO"
- Column width: ~240 points each

**Line Items Table** (Y: ~320)
- Column widths:
  - Product Code: 80 points
  - Description: 200 points
  - Qty: 40 points
  - Unit: 50 points
  - Unit Price: 70 points
  - Total Price: 70 points
- Header row: Black background, white text, height 20 points
- Data rows: Height 18 points, alternating background optional
- Borders: 1pt light gray

**VAT Calculation** (Y: after table + 20)
- Three-column layout
- Columns: GBP Rate | Net | VAT
- Width: ~200 points total

**Totals Section** (Y: after VAT + 10)
- Black background box
- White text
- Width: ~200 points
- Height: ~80 points
- Right-aligned on page

**Payment Details** (Y: after totals + 20)
- Red text
- Centered or left-aligned

**Footer** (Y: page bottom - 30)
- Centered text
- Company registration and VAT number

## Error Handling

### Validation Errors

**Input Validation**:
- Missing required fields → Throw `ValidationError` with specific field name
- Invalid data types → Throw `ValidationError` with type mismatch details
- Empty line items array → Throw `ValidationError`
- Negative prices or quantities → Throw `ValidationError`

**File System Errors**:
- Output path not writable → Throw `Error` with file system details
- Logo file not found (if provided) → Log warning, continue without logo
- Disk space issues → Throw `Error` with disk space message

### Runtime Errors

**PDF Generation Errors**:
- PDFKit initialization failure → Throw `Error` with library details
- Font loading failure → Fall back to default fonts, log warning
- Memory issues with large invoices → Throw `Error` with memory details

**Calculation Errors**:
- Floating point precision issues → Round to 2 decimal places
- VAT rate out of range (< 0 or > 1) → Throw `ValidationError`

### Error Response Format

All errors should include:
```javascript
{
  error: string,           // Error type
  message: string,         // Human-readable message
  details: object | null,  // Additional error context
  timestamp: string        // ISO 8601 timestamp
}
```

### Recovery Strategies

1. **Missing Optional Fields**: Use empty strings or default values
2. **Logo Loading Failure**: Continue without logo, render placeholder text
3. **Font Issues**: Fall back to PDFKit default fonts
4. **Calculation Precision**: Always round currency to 2 decimal places using `toFixed(2)`

## Testing Strategy

### Unit Testing

The testing strategy will focus on unit tests for specific functionality and integration tests for end-to-end PDF generation. Property-based testing is not applicable for this feature because:

1. **Infrastructure/Output Focus**: PDF generation is primarily about producing correctly formatted output files, not pure function behavior
2. **Visual Validation**: Correctness is determined by visual layout matching, which requires snapshot testing or manual inspection
3. **Side Effects**: The primary operation (file writing) is a side effect with no meaningful return value to assert properties on

**Unit Test Coverage**:

1. **Data Validation Tests**:
   - Valid invoice data passes validation
   - Missing required fields throw appropriate errors
   - Invalid data types are rejected
   - Negative values are rejected
   - Empty line items array is rejected

2. **Calculation Tests**:
   - VAT calculation accuracy (specific examples)
   - Totals calculation with multiple line items
   - Rounding to 2 decimal places
   - Edge cases: zero amounts, very large amounts

3. **Formatting Tests**:
   - Currency formatting (e.g., "123.45" → "£123.45")
   - Address line formatting
   - Date formatting (if dates are added)

4. **Section Rendering Tests** (with mocked PDFKit):
   - Each section renderer is called with correct parameters
   - Y-position is updated correctly after each section
   - Correct fonts and colors are applied
   - Text positioning is accurate

### Integration Testing

1. **End-to-End Generation**:
   - Generate PDF with sample data
   - Verify file is created
   - Verify file size is reasonable
   - Verify PDF is readable by standard viewers

2. **Visual Regression Testing**:
   - Generate PDF from known input
   - Compare against reference sample.pdf (manual or automated)
   - Verify layout matches pixel-perfect or near pixel-perfect

3. **Error Handling Tests**:
   - Invalid output path handling
   - Missing logo file handling
   - Disk space error simulation

### Test Data

Create test fixtures with:
- Minimal valid invoice (1 line item)
- Complex invoice (10+ line items)
- Edge cases (very long descriptions, large quantities, high prices)
- Missing optional fields
- Invalid data for error testing

### Testing Tools

- **Test Framework**: Jest or Mocha
- **Assertion Library**: Chai or Jest assertions
- **Mocking**: Sinon or Jest mocks for PDFKit
- **PDF Validation**: pdf-parse for reading generated PDFs
- **Visual Comparison**: Manual inspection or pdf-diff tools

