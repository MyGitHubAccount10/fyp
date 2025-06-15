const http = require('http');
const fs = require('fs');
const path = require('path');

function createMultipartData(fields, files) {
    const boundary = `----formdata-${Date.now()}`;
    let body = '';

    // Add fields
    for (const [key, value] of Object.entries(fields)) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += `${value}\r\n`;
    }

    // Add files if any
    for (const [key, filePath] of Object.entries(files)) {
        if (filePath && fs.existsSync(filePath)) {
            const fileName = path.basename(filePath);
            const fileData = fs.readFileSync(filePath);
            
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`;
            body += `Content-Type: image/jpeg\r\n\r\n`;
            body += fileData.toString('binary');
            body += '\r\n';
        }
    }

    body += `--${boundary}--\r\n`;

    return {
        body: Buffer.from(body, 'binary'),
        contentType: `multipart/form-data; boundary=${boundary}`
    };
}

async function testProductUpdate() {
    // First get a product to update
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
                    const productId = products[0]._id;
                    console.log('Found product to update:', productId);
                    updateProduct(productId);
                } else {
                    console.log('No products found to update');
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

function updateProduct(productId) {
    const fields = {
        product_name: 'Updated Test Product',
        description: 'This product has been updated via API test',
        product_price: '149.99',
        warehouse_quantity: '30',
        threshold: '8'
    };

    const files = {}; // No file update for this test

    const { body, contentType } = createMultipartData(fields, files);

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: `/api/product/${productId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': contentType,
            'Content-Length': body.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Update Status Code:', res.statusCode);
            console.log('Update Response Headers:', res.headers);
            try {
                const result = JSON.parse(data);
                console.log('Update Response Body:', result);
            } catch (e) {
                console.log('Raw Update Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Update request error:', e);
    });

    req.write(body);
    req.end();
}

testProductUpdate();
