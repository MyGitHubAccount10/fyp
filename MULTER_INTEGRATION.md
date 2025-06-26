# Multer Image Upload Integration

This document explains the multer-based image upload system that has been implemented for the CustomiseImagePage.

## Overview

Previously, the CustomiseImagePage was using client-side file handling with `URL.createObjectURL()` to display uploaded images. Now it uses **multer** on the backend to properly handle file uploads, providing better performance, security, and file management.

## Backend Changes

### 1. Multer Configuration (`backend/routes/CustomiseImgRoute.js`)

```javascript
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/images'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
```

### 2. New Multiple Upload Endpoint

- **URL**: `POST /api/customiseImg/upload-multiple`
- **Purpose**: Handle multiple image uploads for the CustomiseImagePage
- **File Limit**: Up to 10 images per request
- **Size Limit**: 5MB per file
- **File Types**: Only image files (checked by MIME type)

### 3. Response Format

```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "filename": "1677123456789.jpg",
      "originalName": "my-image.jpg",
      "url": "/images/1677123456789.jpg",
      "size": 245760
    }
  ]
}
```

## Frontend Changes

### 1. New Upload Function (`frontend/src/CustomiseImagePage.js`)

- Uses `FormData` to send files to backend
- Includes comprehensive error handling
- Shows upload progress feedback
- Validates file types and sizes on client-side
- Properly handles server responses

### 2. Configuration

```javascript
// Backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
```

### 3. Enhanced Error Handling

- Network connectivity issues
- File type validation
- File size limits
- Server error responses
- User-friendly error messages

### 4. Memory Management

- Cleanup of old blob URLs
- Proper disposal when component unmounts
- Prevention of memory leaks

## Key Features

### ✅ **File Validation**
- Client and server-side validation
- Image-only file types
- 5MB size limit per file
- Up to 10 files per upload

### ✅ **Error Handling**
- Comprehensive error messages
- Network failure detection
- File type/size validation
- Server error reporting

### ✅ **User Experience**
- Upload progress indication
- Disabled input during upload
- Clear success/error feedback
- Automatic input clearing

### ✅ **Performance**
- Server-side file storage
- Optimized file serving
- Reduced client memory usage
- Faster subsequent loads

## File Storage

- **Location**: `backend/public/images/`
- **Naming**: Timestamp + original extension
- **Access**: Served statically via Express
- **URL Pattern**: `http://localhost:4000/images/[filename]`

## Testing

Use the provided test script to verify the upload functionality:

```bash
cd backend
node testImageUpload.js
```

## Usage Instructions

1. **Start Backend**: Make sure your backend server is running on port 4000
2. **Upload Images**: Use the file input in CustomiseImagePage
3. **Multiple Selection**: Hold Ctrl/Cmd to select multiple images
4. **Drag & Drop**: Images can be moved, resized, and rotated as before
5. **Download**: Generated images include server-hosted images

## Environment Variables

For production, set the backend URL:

```bash
# In frontend/.env
REACT_APP_BACKEND_URL=https://your-production-backend.com
```

## Security Features

- File type validation (MIME type checking)
- File size limits
- Destination path validation
- Error message sanitization
- CORS configuration

## Troubleshooting

### Common Issues:

1. **"Cannot connect to server"**
   - Ensure backend is running on port 4000
   - Check CORS configuration

2. **"File too large"**
   - Check file size (max 5MB per file)
   - Consider image compression

3. **"Not an image file"**
   - Only PNG, JPG, GIF, WebP are supported
   - Check file extension

4. **Upload appears stuck**
   - Check network connection
   - Verify server is responding
   - Check browser console for errors

---

## Migration Notes

If you have existing designs with blob URLs, they will continue to work. The system handles both:
- Old blob URLs (`blob:http://localhost:3000/...`)
- New server URLs (`http://localhost:4000/images/...`)

The cleanup function ensures no memory leaks from old blob URLs.
