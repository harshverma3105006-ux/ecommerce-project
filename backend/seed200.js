const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Product = require('./models/productModel');

dotenv.config();

connectDB();

const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Amazon', 'Generic', 'Casio', 'Bose', 'Dyson'];
const adjectives = ['Premium', 'Pro', 'Elite', 'Advanced', 'Ultra', 'Smart', 'Classic', 'Modern', 'Compact', 'Essential', 'Pro Max', 'Plus'];

const productTemplates = [
    { noun: 'Smartphone', category: 'Electronics', images: ['/images/iphone.jpg', '/images/s24.jpg'] },
    { noun: 'Laptop', category: 'Electronics', images: ['/images/macbook.jpg'] },
    { noun: 'Headphones', category: 'Electronics', images: ['/images/sony_headphones.jpg', '/images/airpods.jpg', '/images/bose_earbuds.jpg'] },
    { noun: 'Camera', category: 'Electronics', images: ['/images/camera.jpg', '/images/sony_camera.jpg', '/images/gopro.jpg'] },
    { noun: 'Drone', category: 'Electronics', images: ['/images/drone.jpg'] },
    { noun: 'Keyboard', category: 'Electronics', images: ['/images/keyboard.jpg'] },
    { noun: 'Mouse', category: 'Electronics', images: ['/images/mouse.jpg'] },
    { noun: 'Watch', category: 'Accessories', images: ['/images/watch.jpg', '/images/apple_watch.jpg'] },
    { noun: 'Sneakers', category: 'Apparel', images: ['/images/shoes.jpg', '/images/ultraboost.jpg'] },
    { noun: 'Running Shoes', category: 'Sports', images: ['/images/shoes.jpg', '/images/ultraboost.jpg'] },
    { noun: 'Vacuum', category: 'Home & Kitchen', images: ['/images/dyson.jpg'] },
    { noun: 'Speaker', category: 'Electronics', images: ['/images/alexa.jpg'] },
    { noun: 'Water Bottle', category: 'Home & Kitchen', images: ['/images/flask.jpg'] },
    { noun: 'Smart TV', category: 'Electronics', images: ['/images/tv.jpg'] },
    { noun: 'Game Console', category: 'Electronics', images: ['/images/playstation.jpg', '/images/switch.jpg'] },
    { noun: 'Pressure Cooker', category: 'Home & Kitchen', images: ['/images/instantpot.jpg'] }
];

const importData = async () => {
    try {
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('No admin user found. Run seeder.js first to get an admin user.');
            process.exit(1);
        }

        console.log('Generating 200 specific products...');

        const newProducts = [];

        for (let i = 1; i <= 200; i++) {
            const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

            const name = `${brand} ${adj} ${template.noun} ${i}`;
            const price = Math.floor(Math.random() * 49000) + 999;
            const countInStock = Math.floor(Math.random() * 100);
            const rating = (Math.random() * 2 + 3).toFixed(1);
            const numReviews = Math.floor(Math.random() * 500);

            // Pick an image specifically tailored for this exact noun
            const image = template.images[Math.floor(Math.random() * template.images.length)];

            newProducts.push({
                user: adminUser._id,
                name,
                image,
                brand,
                category: template.category,
                description: `This is a high-quality ${name}. Features premium materials, modern design, and excellent reliability. Perfect addition to your collection.`,
                price,
                countInStock,
                rating: Number(rating),
                numReviews
            });
        }

        await Product.insertMany(newProducts);
        console.log('200 Perfectly Matched Products Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
