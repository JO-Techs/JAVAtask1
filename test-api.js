console.log('🧪 Finance Tracker API Test Guide\n');

console.log('📋 Manual Testing Steps:');
console.log('1. Start MongoDB: mongod (or use Docker/Atlas)');
console.log('2. Start server: npm run dev');
console.log('3. Test endpoints using curl or Postman\n');

console.log('🔗 Sample curl commands:');
console.log('\n# Register user:');
console.log('curl -X POST http://localhost:3000/api/auth/register \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"username":"testuser","email":"test@example.com","password":"password123"}\' ');

console.log('\n# Login (save the token):');
console.log('curl -X POST http://localhost:3000/api/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"test@example.com","password":"password123"}\' ');

console.log('\n# Add transaction (replace YOUR_TOKEN):');
console.log('curl -X POST http://localhost:3000/api/transactions \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
console.log('  -d \'{"date":"2025-01-15","description":"Grocery","amount":1200,"category":"Food","type":"Expense"}\' ');

console.log('\n# Get transactions with pagination:');
console.log('curl -H "Authorization: Bearer YOUR_TOKEN" \\');
console.log('  "http://localhost:3000/api/transactions?page=1&limit=5"');

console.log('\n# Get dashboard summary:');
console.log('curl -H "Authorization: Bearer YOUR_TOKEN" \\');
console.log('  "http://localhost:3000/api/summary"');

console.log('\n# Export CSV:');
console.log('curl -H "Authorization: Bearer YOUR_TOKEN" \\');
console.log('  "http://localhost:3000/api/transactions/export/csv"');

console.log('\n✅ All endpoints are ready for testing!');
console.log('💡 Use Postman, Thunder Client, or curl for easier testing.');