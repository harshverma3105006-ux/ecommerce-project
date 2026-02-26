const mongoose = require('mongoose');
const Review = require('./models/reviewModel'); // exact path check karo

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const reviews = [
  {
    user: "John Doe",
    comment: "Great product!",
    rating: 5,
    approved: true
  },
  {
    user: "Jane Smith",
    comment: "Average quality",
    rating: 3
  },
  {
    user: "Alice",
    comment: "Excellent, highly recommend",
    rating: 5,
    visible: true
  }
];

const seedDB = async () => {
  try {
    await Review.deleteMany({}); // purane delete
    await Review.insertMany(reviews);
    console.log("Reviews Added Successfully!");
    mongoose.connection.close();
  } catch(err) {
    console.log("Error seeding reviews:", err.message);
    mongoose.connection.close();
  }
};

seedDB();