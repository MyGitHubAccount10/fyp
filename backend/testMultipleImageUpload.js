const http = require('http');
const fs = require('fs');
const path = require('path');

function createMultipartData(fields, files) {
    const boundary = '----formdata-' + Math.random().toString(36);
    let body = Buffer.alloc(0);

    // Add text fields
    for (const [key, value] of Object.entries(fields)) {
        const fieldData = Buffer.concat([
            Buffer.from(`--${boundary}\r\n`),
            Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`),
            Buffer.from(value + '\r\n')
        ]);
        body = Buffer.concat([body, fieldData]);
    }

    // Add file fields
    for (const [key, filePaths] of Object.entries(files)) {
        // Handle multiple files for the same field
        const pathArray = Array.isArray(filePaths) ? filePaths : [filePaths];
        
        for (const filePath of pathArray) {
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const fileName = path.basename(filePath);
                const fileData = Buffer.concat([
                    Buffer.from(`--${boundary}\r\n`),
                    Buffer.from(`Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`),
                    Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
                    fileBuffer,
                    Buffer.from('\r\n')
                ]);
                body = Buffer.concat([body, fileData]);
            }
        }
    }

    // End boundary
    body = Buffer.concat([body, Buffer.from(`--${boundary}--\r\n`)]);

    return {
        body,
        contentType: `multipart/form-data; boundary=${boundary}`
    };
}

async function testMultipleImageUpload() {
    const categoryId = '68493895d3f3baa0e2aefc6c'; // Skimboards category ID
    const imagePaths = [
        'C:\\fyp\\backend\\public\\images\\1749652094567.jpeg',
        'C:\\fyp\\backend\\public\\images\\1749654974645.jpeg',
        'C:\\fyp\\backend\\public\\images\\1749655498537.jpeg'
    ];

    // Check if images exist
    const existingImages = imagePaths.filter(imagePath => {
        const exists = fs.existsSync(imagePath);
        console.log(`Image ${imagePath}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
        return exists;
    });

    if (existingImages.length === 0) {
        console.log('No test images found');
        return;
    }

    console.log(`Testing with ${existingImages.length} images...`);

    const fields = {
        name: 'Multi-Image Test Product',
        description: 'This is a test product with multiple images',
        price: '149.99',
        stockQuantity: '30',
        lowStockThreshold: '5',
        category: categoryId
    };

    const files = {
        product_images: existingImages // Multiple images with same field name
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

    console.log('Sending request with multiple images...');
    console.log('Fields:', fields);
    console.log('Images:', existingImages.length);

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Response body:', data);
            try {
                const result = JSON.parse(data);
                console.log('\n✅ SUCCESS - Product created with multiple images:');
                console.log('Product ID:', result._id);
                console.log('Main image:', result.product_image);
                console.log('Second image:', result.product_image2 || 'None');
                console.log('Third image:', result.product_image3 || 'None');
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (err) => {
        console.error('Request error:', err.message);
    });

    req.write(body);
    req.end();
}

// Run the test
testMultipleImageUpload().catch(console.error);
