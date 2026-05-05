const { formatCurrency, formatAddress } = require('./formatters');

console.log('Testing formatters...\n');

// Test 1: Format whole numbers with two decimal places
console.log('Test 1: Format whole numbers...');
const result1 = formatCurrency(123);
if (result1 === '£123.00') {
  console.log('✓ PASS: formatCurrency(123) = "£123.00"\n');
} else {
  console.log('✗ FAIL:', result1, '\n');
}

// Test 2: Format decimal numbers with two decimal places
console.log('Test 2: Format decimal numbers...');
const result2 = formatCurrency(123.45);
if (result2 === '£123.45') {
  console.log('✓ PASS: formatCurrency(123.45) = "£123.45"\n');
} else {
  console.log('✗ FAIL:', result2, '\n');
}

// Test 3: Round to two decimal places
console.log('Test 3: Round to two decimal places...');
const result3 = formatCurrency(123.456);
if (result3 === '£123.46') {
  console.log('✓ PASS: formatCurrency(123.456) = "£123.46"\n');
} else {
  console.log('✗ FAIL:', result3, '\n');
}

// Test 4: Format zero correctly
console.log('Test 4: Format zero...');
const result4 = formatCurrency(0);
if (result4 === '£0.00') {
  console.log('✓ PASS: formatCurrency(0) = "£0.00"\n');
} else {
  console.log('✗ FAIL:', result4, '\n');
}

// Test 5: Join address lines with newlines
console.log('Test 5: Join address lines...');
const address1 = ['123 Main St', 'London', 'SW1A 1AA'];
const result5 = formatAddress(address1);
if (result5 === '123 Main St\nLondon\nSW1A 1AA') {
  console.log('✓ PASS: Address lines joined correctly\n');
} else {
  console.log('✗ FAIL:', result5, '\n');
}

// Test 6: Filter out empty lines
console.log('Test 6: Filter empty lines...');
const address2 = ['123 Main St', '', 'London'];
const result6 = formatAddress(address2);
if (result6 === '123 Main St\nLondon') {
  console.log('✓ PASS: Empty lines filtered out\n');
} else {
  console.log('✗ FAIL:', result6, '\n');
}

// Test 7: Handle single line address
console.log('Test 7: Single line address...');
const address3 = ['London'];
const result7 = formatAddress(address3);
if (result7 === 'London') {
  console.log('✓ PASS: Single line address handled correctly\n');
} else {
  console.log('✗ FAIL:', result7, '\n');
}

console.log('All formatter tests completed!');
