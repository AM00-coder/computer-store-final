const express = require('express');
const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ayhamDB')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Enable parsing of large JSON (e.g. Base64 image)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ CORS setup
const cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ✅ API Routes
const users = require("./Routes/user.route");
const products = require("./Routes/product.route");
const cartsRouter = require("./Routes/cart.route");

app.use("/users", users);
app.use("/products", products);
app.use("/cart", cartsRouter);

// ✅ Start server
app.listen(PORT, (err) => {
  if (!err) console.log('🚀 Server running on http://localhost:' + PORT);
  else console.error("❌ Server start error:", err);
});
