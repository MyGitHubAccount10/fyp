const mongoose = require('mongoose');
const Status = require('./models/StatusModel');
require('dotenv').config();

const statuses = [
    { status_name: 'Order Placed' },
    { status_name: 'Processing' },
    { status_name: 'In Transit' },
    { status_name: 'Delivered' },
    { status_name: 'Cancelled' },
    { status_name: 'Rejected' },
    { status_name: 'Returned to Sender' },
    { status_name: 'Attempted Delivery' }
];

async function seedStatuses() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if statuses already exist
        const existingStatuses = await Status.find({});
        if (existingStatuses.length > 0) {
            console.log('Statuses already exist:', existingStatuses.map(status => status.status_name));
            
            // Check if Cancelled status exists, if not add it
            const cancelledExists = existingStatuses.find(status => status.status_name === 'Cancelled');
            if (!cancelledExists) {
                console.log('Adding missing Cancelled status...');
                await Status.create({ status_name: 'Cancelled' });
                console.log('Cancelled status added successfully!');
            }
            
            // Check if Rejected status exists, if not add it
            const rejectedExists = existingStatuses.find(status => status.status_name === 'Rejected');
            if (!rejectedExists) {
                console.log('Adding missing Rejected status...');
                await Status.create({ status_name: 'Rejected' });
                console.log('Rejected status added successfully!');
            }
            
            process.exit(0);
        }

        // Insert all statuses if none exist
        const result = await Status.insertMany(statuses);
        console.log('Statuses seeded successfully:', result.map(status => status.status_name));
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding statuses:', error);
        process.exit(1);
    }
}

seedStatuses();
