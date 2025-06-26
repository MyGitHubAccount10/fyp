const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testImageUpload() {
    try {
        // Create a simple test image (1x1 pixel PNG)
        const testImageData = Buffer.from([
            137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 11, 19, 0, 0, 11, 19, 1, 0, 154, 156, 24, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 0, 3, 0, 1, 146, 204, 88, 29, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
        ]);
        
        const testImagePath = path.join(__dirname, 'test-image.png');
        fs.writeFileSync(testImagePath, testImageData);
        
        // Create FormData and append the test image
        const formData = new FormData();
        formData.append('images', fs.createReadStream(testImagePath), 'test-image.png');
        
        console.log('Testing image upload to multer endpoint...');
        
        // Send the request
        const response = await fetch('http://localhost:4000/api/customiseImg/upload-multiple', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Upload successful!');
            console.log('Response:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ Upload failed!');
            console.log('Error:', result);
        }
        
        // Clean up test file
        fs.unlinkSync(testImagePath);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
console.log('Make sure your backend server is running on port 4000 first!');
console.log('Then run: node testImageUpload.js');

if (require.main === module) {
    testImageUpload();
}

module.exports = testImageUpload;
