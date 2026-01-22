#!/usr/bin/env node

/**
 * Test Mobile App Setup
 * Verifies all dependencies are installed correctly
 */

console.log('🔍 Testing Nano Mobile App Setup...\n');

const tests = [];

// Test 1: Check Node version
try {
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (major >= 18) {
        tests.push({ name: 'Node.js version', status: '✅', detail: nodeVersion });
    } else {
        tests.push({ name: 'Node.js version', status: '❌', detail: `${nodeVersion} (need 18+)` });
    }
} catch (e) {
    tests.push({ name: 'Node.js version', status: '❌', detail: e.message });
}

// Test 2: Check package.json
try {
    const pkg = require('./package.json');
    tests.push({ name: 'package.json', status: '✅', detail: `v${pkg.version}` });
} catch (e) {
    tests.push({ name: 'package.json', status: '❌', detail: 'Not found' });
}

// Test 3: Check dependencies
try {
    require('expo');
    tests.push({ name: 'Expo', status: '✅', detail: 'Installed' });
} catch (e) {
    tests.push({ name: 'Expo', status: '❌', detail: 'Not installed' });
}

try {
    require('react');
    tests.push({ name: 'React', status: '✅', detail: 'Installed' });
} catch (e) {
    tests.push({ name: 'React', status: '❌', detail: 'Not installed' });
}

try {
    require('react-native');
    tests.push({ name: 'React Native', status: '✅', detail: 'Installed' });
} catch (e) {
    tests.push({ name: 'React Native', status: '❌', detail: 'Not installed' });
}

try {
    require('expo-router');
    tests.push({ name: 'Expo Router', status: '✅', detail: 'Installed' });
} catch (e) {
    tests.push({ name: 'Expo Router', status: '❌', detail: 'Not installed' });
}

// Test 4: Check app files
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'app/index.js',
    'app/_layout.js',
    'app.json',
    'babel.config.js'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        tests.push({ name: file, status: '✅', detail: 'Found' });
    } else {
        tests.push({ name: file, status: '❌', detail: 'Missing' });
    }
});

// Print results
console.log('Test Results:\n');
tests.forEach(test => {
    console.log(`${test.status} ${test.name.padEnd(30)} ${test.detail}`);
});

// Summary
const passed = tests.filter(t => t.status === '✅').length;
const failed = tests.filter(t => t.status === '❌').length;

console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`);
console.log('='.repeat(60));

if (failed === 0) {
    console.log('\n✅ All tests passed! You can now run: npm start\n');
    process.exit(0);
} else {
    console.log('\n❌ Some tests failed. Please run: npm install --legacy-peer-deps\n');
    process.exit(1);
}
