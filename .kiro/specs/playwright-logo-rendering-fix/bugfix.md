# Bugfix Requirements Document

## Introduction

The invoice PDF generator using Playwright fails to render the company logo image in the generated PDF. When a relative path like 'logo.png' is provided in the invoiceData.companyHeader.logoPath field, the image appears as "image not found" in the PDF output. This occurs because Playwright's PDF generation requires absolute file paths or data URIs to properly embed images, but the current implementation only passes through the relative path directly to the HTML img src attribute.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN invoiceData.companyHeader.logoPath contains a relative file path (e.g., 'logo.png') THEN the generated PDF displays "image not found" or a broken image icon instead of the logo

1.2 WHEN the HTML is generated with a relative path in the img src attribute THEN Playwright cannot resolve the image file during PDF generation

### Expected Behavior (Correct)

2.1 WHEN invoiceData.companyHeader.logoPath contains a relative file path (e.g., 'logo.png') THEN the system SHALL convert it to an absolute file path or data URI and the logo SHALL render correctly in the generated PDF

2.2 WHEN the HTML is generated with the logo image THEN Playwright SHALL successfully embed the image in the PDF output

### Unchanged Behavior (Regression Prevention)

3.1 WHEN invoiceData.companyHeader.logoPath is not provided or is null/undefined THEN the system SHALL CONTINUE TO display the company name text instead of a logo

3.2 WHEN invoiceData.companyHeader.logoPath already contains an absolute file path or data URI THEN the system SHALL CONTINUE TO use it without modification

3.3 WHEN generating the PDF with all other invoice elements (metadata, line items, totals, customer info) THEN the system SHALL CONTINUE TO render them correctly as before
