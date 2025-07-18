# Homepage Promo Management System

## Overview
I've created a complete admin system for managing promo images on the homepage slideshow, similar to the AllProductsPage structure. This allows admins to dynamically update the hero section images without editing code.

## Backend Implementation

### 1. Database Model (`backend/models/PromoModel.js`)
- **promo_title**: Title/description of the promo
- **promo_image**: Filename of the uploaded image
- **promo_link**: Destination URL when clicked
- **display_order**: Order in slideshow (lower = first)
- **is_active**: Whether the promo shows on homepage
- **timestamps**: Created/updated dates

### 2. API Controller (`backend/controllers/PromoController.js`)
- `GET /api/promo` - Get all promos (admin)
- `GET /api/promo/active` - Get active promos (homepage)
- `GET /api/promo/:id` - Get single promo
- `POST /api/promo` - Create new promo (with image upload)
- `PATCH /api/promo/:id` - Update promo (optional image update)
- `DELETE /api/promo/:id` - Delete promo (removes image file)

### 3. API Routes (`backend/routes/PromoRoute.js`)
- Configured with multer for image uploads
- File size limit: 10MB
- Accepted formats: jpeg, jpg, png, gif, webp
- Images stored in `backend/public/images/`

### 4. Server Integration (`backend/server.js`)
- Added promo routes: `app.use('/api/promo', promoRoutes)`

## Frontend Implementation

### 1. Admin Management Pages

#### `E_AllPromosPage.js` - Main Management Page
- Lists all promo images in a table
- Search by title
- Filter by status (Active/Inactive)
- Pagination (10 items per page)
- Image preview modal
- Edit/Delete actions
- Summary statistics

#### `EE_AddPromoPage.js` - Add New Promo
- Form to create new promo
- Image upload with preview
- Title, link, display order, status fields
- Form validation
- Image size recommendations

#### `EEE_EditPromoPage.js` - Edit Existing Promo
- Pre-filled form with existing data
- Shows current image
- Optional image replacement
- Form validation
- Maintains state when returning from other pages

### 2. Homepage Integration (`AAHomePage.js`)
- **Dynamic Loading**: Fetches active promos from API
- **Fallback**: Uses hardcoded images if API fails
- **Transformed Data**: Converts API response to slideshow format
- **Compatibility**: Maintains existing slideshow functionality

### 3. Navigation (`AdminHeader.js`)
- Added "Homepage Promos" link to admin navigation
- New promo icon for consistent UI
- Integrated with existing admin dropdown

### 4. Routing (`App.js`)
- `/manage-promos` - Main promo management page
- `/add-promo` - Add new promo page
- `/edit-promo/:id` - Edit existing promo page
- All routes protected with `AdminProtectedRoute`

## Key Features

### Admin Features
1. **CRUD Operations**: Full create, read, update, delete functionality
2. **Image Management**: Upload, preview, and automatic file cleanup
3. **Display Order**: Control slideshow sequence
4. **Status Control**: Enable/disable promos without deletion
5. **Search & Filter**: Find promos quickly
6. **Pagination**: Handle large numbers of promos
7. **Image Modal**: Full-size preview with navigation
8. **State Persistence**: Returns to same page/filters after actions

### User Experience
1. **Dynamic Content**: Homepage loads promos from database
2. **Clickable Links**: Each promo can link to products, pages, etc.
3. **Responsive Design**: Works on all device sizes
4. **Fallback System**: Shows default images if API unavailable
5. **Performance**: Only loads active promos on homepage

## File Structure
```
backend/
├── models/PromoModel.js           (New)
├── controllers/PromoController.js (New)
├── routes/PromoRoute.js          (New)
└── server.js                     (Modified)

frontend/src/
├── AdminSide/
│   ├── E_AllPromosPage.js        (New)
│   ├── EE_AddPromoPage.js        (New)
│   └── EEE_EditPromoPage.js      (New)
├── AAHomePage.js                 (Modified)
├── AdminHeader.js                (Modified)
└── App.js                        (Modified)
```

## Usage Instructions

### For Admins:
1. Navigate to "Homepage Promos" in admin panel
2. Click "Add New Promo" to create slideshow images
3. Fill in title, upload image, set link destination
4. Set display order (0 = first, 1 = second, etc.)
5. Toggle active status to show/hide on homepage
6. Use search and filters to manage large collections
7. Edit existing promos by clicking the edit button
8. Delete unwanted promos (removes image file too)

### For Users:
- Homepage automatically displays active promos
- Click on slideshow images to navigate to linked pages
- Slideshow auto-advances every 5 seconds
- Navigation arrows appear when multiple images exist

## Technical Notes

### Security
- Admin routes protected with authentication
- File upload validation for image types only
- File size limits prevent abuse
- SQL injection protection via Mongoose

### Performance
- Images served directly from backend
- Efficient database queries with sorting
- Pagination reduces load times
- Fallback system ensures homepage always works

### Scalability
- Easy to add more promo fields if needed
- Pagination handles unlimited promos
- Image storage can be moved to cloud services
- API endpoints ready for mobile apps

## Next Steps (Optional Enhancements)
1. **Image Optimization**: Automatic resizing/compression
2. **Cloud Storage**: Move images to AWS S3 or similar
3. **Analytics**: Track promo click-through rates
4. **Scheduling**: Auto-activate/deactivate promos by date
5. **Templates**: Pre-designed promo templates
6. **Drag & Drop**: Reorder promos with drag and drop
7. **Bulk Actions**: Select multiple promos for batch operations
