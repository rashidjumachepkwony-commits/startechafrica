const https = require('https');

// Your new secret key
const secretKey = 'sk_test_71051b14347004d312b34dbf9bfc321d41d4efe2';

console.log('🔍 Testing Paystack key...');

const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('📦 Response:', response);
            if (response.status) {
                console.log('✅ SUCCESS! Your key is VALID!');
                console.log('🎉 Paystack is ready to accept payments!');
            } else {
                console.log('❌ ERROR:', response.message);
                console.log('💡 The key might be incomplete or wrong.');
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.write(JSON.stringify({
    email: 'test@example.com',
    amount: 50000,
    currency: 'KES'
}));
req.end();