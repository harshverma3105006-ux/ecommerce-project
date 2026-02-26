const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

dotenv.config();

connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    },
];

const products = [
    {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: '/images/airpods.jpg',
        description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.',
        brand: 'Apple',
        category: 'Electronics',
        price: 8999,
        countInStock: 20,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'Sony Playstation 5',
        image: '/images/playstation.jpg',
        description: 'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
        brand: 'Sony',
        category: 'Electronics',
        price: 49999,
        countInStock: 5,
        rating: 5,
        numReviews: 5,
    },
    {
        name: 'Cannon EOS 80D DSLR Camera',
        image: '/images/camera.jpg',
        description: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
        brand: 'Cannon',
        category: 'Electronics',
        price: 65999,
        countInStock: 0, // Out of stock example
        rating: 3.5,
        numReviews: 8,
    },
    {
        name: 'Macbook Pro 16-inch M3 Max',
        image: '/images/macbook.jpg',
        description: 'The most advanced Mac ever with M3 Max chip for ultimate performance and battery life.',
        brand: 'Apple',
        category: 'Electronics',
        price: 249999,
        countInStock: 8,
        rating: 4.9,
        numReviews: 45,
    },
    {
        name: 'iPhone 15 Pro Max',
        image: '/images/iphone.jpg',
        description: 'Titanium design with the fastest A17 Pro chip and improved camera system.',
        brand: 'Apple',
        category: 'Electronics',
        price: 159900,
        countInStock: 15,
        rating: 4.8,
        numReviews: 120,
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        image: '/images/s24.jpg',
        description: 'AI-powered flagship smartphone with integrated S-Pen and titanium chassis.',
        brand: 'Samsung',
        category: 'Electronics',
        price: 129999,
        countInStock: 25,
        rating: 4.7,
        numReviews: 88,
    },
    {
        name: 'Sony WH-1000XM5',
        image: '/images/sony_headphones.jpg',
        description: 'Industry-leading noise cancellation with supreme audio quality.',
        brand: 'Sony',
        category: 'Electronics',
        price: 29990,
        countInStock: 12,
        rating: 4.6,
        numReviews: 54,
    },
    {
        name: 'Logitech MX Master 3S',
        image: '/images/mouse.jpg',
        description: 'Ergonomic wireless mouse with ultra-fast scrolling and precise tracking.',
        brand: 'Logitech',
        category: 'Electronics',
        price: 8999,
        countInStock: 50,
        rating: 4.8,
        numReviews: 210,
    },
    {
        name: 'Keychron K2 Mechanical Keyboard',
        image: '/images/keyboard.jpg',
        description: 'Wireless mechanical keyboard with tactile switches for satisfying typing.',
        brand: 'Keychron',
        category: 'Electronics',
        price: 7500,
        countInStock: 30,
        rating: 4.5,
        numReviews: 67,
    },
    {
        name: 'Nintendo Switch OLED',
        image: '/images/switch.jpg',
        description: 'Hybrid console with vibrant 7-inch OLED screen and improved kickstand.',
        brand: 'Nintendo',
        category: 'Electronics',
        price: 32000,
        countInStock: 10,
        rating: 4.8,
        numReviews: 315,
    },
    {
        name: 'DJI Mini 3 Pro Drone',
        image: '/images/drone.jpg',
        description: 'Ultralight mini drone with true vertical shooting and obstacle avoidance.',
        brand: 'DJI',
        category: 'Electronics',
        price: 76990,
        countInStock: 7,
        rating: 4.9,
        numReviews: 42,
    },
    {
        name: 'Nike Air Force 1',
        image: '/images/shoes.jpg',
        description: 'Classic streetwear sneakers with timeless design and comfort.',
        brand: 'Nike',
        category: 'Apparel',
        price: 8500,
        countInStock: 45,
        rating: 4.7,
        numReviews: 430,
    },
    {
        name: 'Adidas Ultraboost 22',
        image: '/images/ultraboost.jpg',
        description: 'Premium running shoes offering incredible energy return and cushioning.',
        brand: 'Adidas',
        category: 'Apparel',
        price: 14000,
        countInStock: 22,
        rating: 4.6,
        numReviews: 125,
    },
    {
        name: 'LG C3 65" OLED TV',
        image: '/images/tv.jpg',
        description: 'Stunning 4K OLED TV with deep blacks and vibrant contrast.',
        brand: 'LG',
        category: 'Electronics',
        price: 154990,
        countInStock: 4,
        rating: 4.8,
        numReviews: 33,
    },
    {
        name: 'Amazon Echo Dot (5th Gen)',
        image: '/images/alexa.jpg',
        description: 'Smart speaker with Alexa and improved audio quality.',
        brand: 'Amazon',
        category: 'Electronics',
        price: 4500,
        countInStock: 100,
        rating: 4.4,
        numReviews: 560,
    },
    {
        name: 'GoPro HERO11 Black',
        image: '/images/gopro.jpg',
        description: 'Rugged action camera capturing stunning 5.3K video.',
        brand: 'GoPro',
        category: 'Electronics',
        price: 44990,
        countInStock: 18,
        rating: 4.7,
        numReviews: 89,
    },
    {
        name: 'Casio G-Shock Series',
        image: '/images/watch.jpg',
        description: 'Tough, shock-resistant tactical watch ready for any adventure.',
        brand: 'Casio',
        category: 'Accessories',
        price: 8500,
        countInStock: 60,
        rating: 4.8,
        numReviews: 200,
    },
    {
        name: 'Bose QuietComfort Earbuds II',
        image: '/images/bose_earbuds.jpg',
        description: 'Next-gen wireless earbuds with world-class noise cancellation.',
        brand: 'Bose',
        category: 'Electronics',
        price: 24000,
        countInStock: 25,
        rating: 4.5,
        numReviews: 112,
    },
    {
        name: 'Hydro Flask Water Bottle 32oz',
        image: '/images/flask.jpg',
        description: 'Insulated steel water bottle keeping drinks cold for 24 hours.',
        brand: 'Hydro Flask',
        category: 'Home & Kitchen',
        price: 3200,
        countInStock: 80,
        rating: 4.9,
        numReviews: 1500,
    },
    {
        name: 'Dyson V15 Detect Vacuum',
        image: '/images/dyson.jpg',
        description: 'Powerful cordless vacuum with laser dust detection technology.',
        brand: 'Dyson',
        category: 'Home Appliances',
        price: 55990,
        countInStock: 8,
        rating: 4.7,
        numReviews: 76,
    },
    {
        name: 'Instant Pot Duo 7-in-1',
        image: '/images/instantpot.jpg',
        description: 'Versatile electric pressure cooker to prepare meals up to 70% faster.',
        brand: 'Instant Pot',
        category: 'Home Appliances',
        price: 8999,
        countInStock: 35,
        rating: 4.8,
        numReviews: 240,
    },
    {
        name: 'Sony A7 IV Mirrorless Camera',
        image: '/images/sony_camera.jpg',
        description: 'Advanced full-frame mirrorless camera for photography and videography.',
        brand: 'Sony',
        category: 'Electronics',
        price: 214990,
        countInStock: 3,
        rating: 4.9,
        numReviews: 55,
    },
    {
        name: 'Apple Watch Series 9',
        image: '/images/apple_watch.jpg',
        description: 'Smartwatch with advanced health sensors and brighter display.',
        brand: 'Apple',
        category: 'Accessories',
        price: 41900,
        countInStock: 28,
        rating: 4.7,
        numReviews: 95,
    }
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
