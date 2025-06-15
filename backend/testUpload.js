// Simple test using built-in modules
const http = require('http');

async function testAPI() {
    // Test categories endpoint
    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/category',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Status Code:', res.statusCode);
            console.log('Categories:', JSON.parse(data));
        });
    });

    req.on('error', (e) => {
        console.error('Request error:', e);
    });

    req.end();
}

testAPI();
