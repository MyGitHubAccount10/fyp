const http = require('http');

async function testProductDelete() {
    // First get a product to delete
    const getOptions = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/product',
        method: 'GET'
    };

    const getReq = http.request(getOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const products = JSON.parse(data);
                if (products.length > 0) {
                    // Find the test product we created
                    const testProduct = products.find(p => p.product_name.includes('Test'));
                    if (testProduct) {
                        console.log('Found test product to delete:', testProduct._id, testProduct.product_name);
                        deleteProduct(testProduct._id);
                    } else {
                        console.log('No test products found to delete');
                        console.log('Available products:', products.map(p => ({id: p._id, name: p.product_name})));
                    }
                } else {
                    console.log('No products found to delete');
                }
            } catch (e) {
                console.error('Error parsing products:', e);
            }
        });
    });

    getReq.on('error', (e) => {
        console.error('Error getting products:', e);
    });

    getReq.end();
}

function deleteProduct(productId) {
    const options = {
        hostname: 'localhost',
        port: 4000,
        path: `/api/product/${productId}`,
        method: 'DELETE'
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Delete Status Code:', res.statusCode);
            console.log('Delete Response Headers:', res.headers);
            try {
                const result = JSON.parse(data);
                console.log('Delete Response Body:', result);
            } catch (e) {
                console.log('Raw Delete Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Delete request error:', e);
    });

    req.end();
}

testProductDelete();