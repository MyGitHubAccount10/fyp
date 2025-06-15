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

    // Add files
    for (const [key, filePath] of Object.entries(files)) {
        const fileName = path.basename(filePath);
        const fileData = fs.readFileSync(filePath);
        
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`;
        body += `Content-Type: image/jpeg\r\n\r\n`;
        body += fileData.toString('binary');
        body += '\r\n';
    }

    body += `--${boundary}--\r\n`;

    return {
        body: Buffer.from(body, 'binary'),
        contentType: `multipart/form-data; boundary=${boundary}`
    };
}

async function testProductUpload() {
    const categoryId = '68493895d3f3baa0e2aefc6c'; // Skimboards category ID from previous output
    const imagePath = 'C:\\fyp\\backend\\public\\images\\1749652094567.jpeg';

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
        console.log('Test image not found:', imagePath);
        return;
    }

    const fields = {
        name: 'Test Product Upload',
        description: 'This is a test product description',
        price: '99.99',
        stockQuantity: '25',
        lowStockThreshold: '5',
        category: categoryId
    };

    const files = {
        product_image: imagePath
    };

    const { body, contentType } = createMultipartData(fields, files);

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/product',
        method: 'POST',
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
            console.log('Status Code:', res.statusCode);
            console.log('Response Headers:', res.headers);
            try {
                const result = JSON.parse(data);
                console.log('Response Body:', result);
            } catch (e) {
                console.log('Raw Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Request error:', e);
    });

    req.write(body);
    req.end();
}

testProductUpload();
