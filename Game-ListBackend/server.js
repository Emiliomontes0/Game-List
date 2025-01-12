const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');


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
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);


//Steam Store Endpoint
const checkPricesAndNotify = require('./scripts/priceChecker');
//checkPricesAndNotify();
// Run price checker every 30 minutes
cron.schedule('* * * * *', () => {
  console.log('Running scheduled price check...');
  checkPricesAndNotify();
});
//console.log('Server is running, and price checks are scheduled every minute.');



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
