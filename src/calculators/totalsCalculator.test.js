const { calculateTotals } = require('./totalsCalculator');

console.log('Testing totals calculator...\n');

// Test 1: Basic calculation with single line item
console.log('Test 1: Single line item calculation...');
const lineItems1 = [
  { totalPrice: 100.00 }
];
const result1 = calculateTotals(lineItems1, 0.20);
if (result1.goodsTotal === 100.00 && result1.vatAmount === 20.00 && result1.finalTotal === 120.00) {
  console.log('✓ PASS: goodsTotal=100.00, vatAmount=20.00, finalTotal=120.00\n');
} else {
  console.log('✗ FAIL:', result1, '\n');
}

// Test 2: Multiple line items
console.log('Test 2: Multiple line items...');
const lineItems2 = [
  { totalPrice: 50.00 },
  { totalPrice: 30.50 },
  { totalPrice: 19.50 }
];
const result2 = calculateTotals(lineItems2, 0.20);
const expectedGoods = 100.00;
const expectedVat = 20.00;
const expectedTotal = 120.00;
if (result2.goodsTotal === expectedGoods && result2.vatAmount === expectedVat && result2.finalTotal === expectedTotal) {
  console.log('✓ PASS: goodsTotal=100.00, vatAmount=20.00, finalTotal=120.00\n');
} else {
  console.log('✗ FAIL:', result2, '\n');
}

// Test 3: Rounding to 2 decimal places
console.log('Test 3: Rounding to 2 decimal places...');
const lineItems3 = [
  { totalPrice: 10.556 }
];
const result3 = calculateTotals(lineItems3, 0.20);
// 10.556 rounds to 10.56, VAT = 2.11, total = 12.67
if (result3.goodsTotal === 10.56 && result3.vatAmount === 2.11 && result3.finalTotal === 12.67) {
  console.log('✓ PASS: Correctly rounded to 2 decimal places\n');
} else {
  console.log('✗ FAIL:', result3, '\n');
}

// Test 4: Zero VAT rate
console.log('Test 4: Zero VAT rate...');
const lineItems4 = [
  { totalPrice: 100.00 }
];
const result4 = calculateTotals(lineItems4, 0);
if (result4.goodsTotal === 100.00 && result4.vatAmount === 0.00 && result4.finalTotal === 100.00) {
  console.log('✓ PASS: Zero VAT handled correctly\n');
} else {
  console.log('✗ FAIL:', result4, '\n');
}

// Test 5: netAmount equals goodsTotal
console.log('Test 5: netAmount equals goodsTotal...');
const lineItems5 = [
  { totalPrice: 75.25 }
];
const result5 = calculateTotals(lineItems5, 0.20);
if (result5.netAmount === result5.goodsTotal && result5.netAmount === 75.25) {
  console.log('✓ PASS: netAmount equals goodsTotal\n');
} else {
  console.log('✗ FAIL:', result5, '\n');
}

// Test 6: Large amounts
console.log('Test 6: Large amounts...');
const lineItems6 = [
  { totalPrice: 9999.99 }
];
const result6 = calculateTotals(lineItems6, 0.20);
if (result6.goodsTotal === 9999.99 && result6.vatAmount === 2000.00 && result6.finalTotal === 11999.99) {
  console.log('✓ PASS: Large amounts handled correctly\n');
} else {
  console.log('✗ FAIL:', result6, '\n');
}

console.log('All calculator tests completed!');
