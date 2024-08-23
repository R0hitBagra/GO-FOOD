const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb://Rohit:Ro%40101102@cluster0-shard-00-00.vqk9v.mongodb.net:27017,cluster0-shard-00-01.vqk9v.mongodb.net:27017,cluster0-shard-00-02.vqk9v.mongodb.net:27017/gofoodmern?ssl=true&replicaSet=atlas-limw3m-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const connectToMongoDB = async () => {
  try {
    // Connect to MongoDB using async/await
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully");

    // Fetch data from 'food_items' collection
    const foodCollection = mongoose.connection.db.collection("food_items");
    const foodData = await foodCollection.find({}).toArray();

    // Fetch data from 'Categories' collection
    const categoryCollection = mongoose.connection.db.collection("foodCategory");
    const categoryData = await categoryCollection.find({}).toArray();

    // Return the fetched data
    return { foodData, categoryData };

  } catch (err) {
    console.error("Error connecting to MongoDB or fetching data:", err);
    throw err;
  }
};

module.exports = connectToMongoDB;
