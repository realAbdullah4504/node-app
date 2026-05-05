# Requirements Document

## Introduction

This document specifies the requirements for an invoice PDF generator script that replicates the format shown in the sample.pdf reference document. The system will accept invoice data as input and generate professional PDF invoices matching the Astro Imports invoice layout, including company header, invoice metadata, customer details, line items, VAT calculations, and payment information.

## Glossary

- **Invoice_Generator**: The script that generates PDF invoices from input data
- **PDF_Document**: The output PDF file containing the formatted invoice
- **Line_Item**: A single product entry in the invoice with code, description, quantity, unit, unit price, and total price
- **VAT**: Value Added Tax - a consumption tax applied to goods and services
- **Invoice_Data**: The input data structure containing all information needed to generate an invoice
- **Company_Header**: The top section of the invoice containing logo area and company details
- **Invoice_Metadata**: Invoice-specific information including invoice number, PO number, customer account, etc.
- **Customer_Details**: Information about the invoice recipient and delivery address
- **Totals_Section**: The section displaying goods total, VAT, and final total amounts

## Requirements

### Requirement 1: Accept Invoice Data Input

**User Story:** As a developer, I want to provide invoice data to the script, so that I can generate customized invoices with different values

#### Acceptance Criteria

1. THE Invoice_Generator SHALL accept Invoice_Data as input parameters
2. THE Invoice_Data SHALL include company header information (company name, address, email, website)
3. THE Invoice_Data SHALL include invoice metadata (invoice number, PO number, customer account, customer order number, order number, despatch number, payment terms, VAT number)
4. THE Invoice_Data SHALL include customer billing details (name, address)
5. THE Invoice_Data SHALL include customer delivery details (name, address)
6. THE Invoice_Data SHALL include a collection of Line_Items
7. THE Invoice_Data SHALL include payment details information
8. THE Invoice_Data SHALL include company registration and VAT number for footer

### Requirement 2: Generate Company Header Section

**User Story:** As a user, I want the invoice to display company branding and contact information, so that recipients know who issued the invoice

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render a company header section at the top of the PDF_Document
2. THE Invoice_Generator SHALL include a logo placeholder area in the company header
3. THE Invoice_Generator SHALL display company address in the company header
4. THE Invoice_Generator SHALL display company email in the company header
5. THE Invoice_Generator SHALL display company website in the company header

### Requirement 3: Generate Invoice Metadata Section

**User Story:** As a user, I want the invoice to display all relevant invoice identifiers and terms, so that the invoice can be properly tracked and referenced

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render an Invoice_Metadata section below the company header
2. THE Invoice_Generator SHALL display the invoice number
3. THE Invoice_Generator SHALL display the PO number
4. THE Invoice_Generator SHALL display the customer account number
5. THE Invoice_Generator SHALL display the customer order number
6. THE Invoice_Generator SHALL display the order number
7. THE Invoice_Generator SHALL display the despatch number
8. THE Invoice_Generator SHALL display the payment terms
9. THE Invoice_Generator SHALL display the VAT number

### Requirement 4: Generate Customer Details Sections

**User Story:** As a user, I want the invoice to clearly show billing and delivery addresses, so that the invoice reaches the correct recipient and goods are delivered to the right location

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render an "INVOICE TO" section with customer billing details
2. THE Invoice_Generator SHALL render a "DELIVER TO" section with customer delivery details
3. THE Invoice_Generator SHALL display customer name in both sections
4. THE Invoice_Generator SHALL display complete address information in both sections

### Requirement 5: Generate Line Items Table

**User Story:** As a user, I want the invoice to display all purchased items in a structured table, so that the invoice clearly itemizes what was sold

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render a line items table with column headers
2. THE Invoice_Generator SHALL include a "Product Code" column
3. THE Invoice_Generator SHALL include a "Description" column
4. THE Invoice_Generator SHALL include a "Qty" column
5. THE Invoice_Generator SHALL include a "Unit" column
6. THE Invoice_Generator SHALL include a "Unit Price(GBP)" column
7. THE Invoice_Generator SHALL include a "Total Price(GBP)" column
8. WHEN Invoice_Data contains multiple Line_Items, THE Invoice_Generator SHALL render each Line_Item as a table row
9. THE Invoice_Generator SHALL display all Line_Item fields in their respective columns

### Requirement 6: Calculate and Display VAT

**User Story:** As a user, I want the invoice to automatically calculate VAT amounts, so that tax calculations are accurate and transparent

#### Acceptance Criteria

1. THE Invoice_Generator SHALL calculate the net amount by summing all Line_Item total prices
2. THE Invoice_Generator SHALL calculate the VAT amount based on the applicable VAT rate
3. THE Invoice_Generator SHALL render a VAT calculation section showing GBP rate, net amount, and VAT amount
4. THE Invoice_Generator SHALL display amounts with proper currency formatting

### Requirement 7: Generate Totals Section

**User Story:** As a user, I want the invoice to display clear totals, so that the amount due is immediately visible

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render a Totals_Section
2. THE Totals_Section SHALL display the goods total in GBP
3. THE Totals_Section SHALL display the VAT amount
4. THE Totals_Section SHALL display the final total in GBP (goods + VAT)
5. THE Invoice_Generator SHALL format all monetary values with two decimal places

### Requirement 8: Generate Payment Details Section

**User Story:** As a user, I want the invoice to include payment information, so that customers know how to pay

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render a payment details section
2. THE Invoice_Generator SHALL display payment instructions from Invoice_Data

### Requirement 9: Generate Footer Section

**User Story:** As a user, I want the invoice to include company registration details in the footer, so that the invoice meets legal requirements

#### Acceptance Criteria

1. THE Invoice_Generator SHALL render a footer section at the bottom of the PDF_Document
2. THE Invoice_Generator SHALL display company registration number in the footer
3. THE Invoice_Generator SHALL display VAT number in the footer

### Requirement 10: Match Exact Format and Layout from Sample

**User Story:** As a user, I want the generated invoice to exactly replicate the sample.pdf format, so that all invoices maintain consistent professional branding and layout

#### Acceptance Criteria

1. THE Invoice_Generator SHALL position all sections to match the sample.pdf layout exactly (header, metadata, customer details, line items table, totals, footer)
2. THE Invoice_Generator SHALL render "PAID INVOICE" text in the top right corner of the PDF_Document
3. THE Invoice_Generator SHALL use the same fonts and font sizes as shown in sample.pdf
4. THE Invoice_Generator SHALL apply bold styling to section headers and labels matching sample.pdf
5. THE Invoice_Generator SHALL render the line items table header row with a black background and white text
6. THE Invoice_Generator SHALL use identical column widths for the line items table as shown in sample.pdf
7. THE Invoice_Generator SHALL apply the same borders, lines, and visual separators as shown in sample.pdf
8. THE Invoice_Generator SHALL maintain identical spacing and alignment between all sections as shown in sample.pdf
9. THE Invoice_Generator SHALL render the VAT calculation section with the same layout as sample.pdf
10. THE Invoice_Generator SHALL render the totals section with a black box background matching sample.pdf
11. THE Invoice_Generator SHALL display the payment confirmation message "**Invoice paid many thanks **" in red text
12. THE Invoice_Generator SHALL match the footer layout exactly as shown in sample.pdf
13. THE Invoice_Generator SHALL achieve pixel-perfect or near pixel-perfect visual fidelity to sample.pdf

### Requirement 11: Output PDF File

**User Story:** As a developer, I want the script to save the generated invoice as a PDF file, so that I can distribute or store the invoice

#### Acceptance Criteria

1. WHEN invoice generation is complete, THE Invoice_Generator SHALL save the PDF_Document to the file system
2. THE Invoice_Generator SHALL accept an output file path parameter
3. THE PDF_Document SHALL be readable by standard PDF viewers
4. IF the output file path already exists, THE Invoice_Generator SHALL overwrite the existing file
