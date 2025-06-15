const mongoose = require('mongoose');
const Category = require('./models/CategoryModel');
require('dotenv').config();

const categories = [
    { category_name: 'Skimboards' },
    { category_name: 'T-Shirts' },
    { category_name: 'Jackets' },
    { category_name: 'Board Shorts' },
    { category_name: 'Accessories' }
];

async function seedCategories() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if categories already exist
        const existingCategories = await Category.find({});
        if (existingCategories.length > 0) {
            console.log('Categories already exist:', existingCategories.map(cat => cat.category_name));
            process.exit(0);
        }

        // Insert categories
        const result = await Category.insertMany(categories);
        console.log('Categories seeded successfully:', result.map(cat => cat.category_name));
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
