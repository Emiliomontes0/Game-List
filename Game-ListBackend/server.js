const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api/wishlist', wishlistRoutes);

//Steam Store Endpoint
const checkPricesAndNotify = require('./scripts/priceChecker');
checkPricesAndNotify();
// Run price checker every 30 minutes
setInterval(() => {
  console.log('Running scheduled price check...');
  checkPricesAndNotify();
}, 1 * 60 * 1000); // 30 minutes



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
