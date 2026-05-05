/**
 * Test fixtures index
 * Exports all test fixtures for easy importing
 */

const minimalInvoice = require('./minimal-invoice');
const complexInvoice = require('./complex-invoice');
const edgeCasesInvoice = require('./edge-cases-invoice');
const invalidData = require('./invalid-data');

module.exports = {
  minimalInvoice,
  complexInvoice,
  edgeCasesInvoice,
  invalidData
};
