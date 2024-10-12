const express = require('express');
const productRoutes = require('./routes/product');
const suppliesRoutes = require('./routes/supplies');
const salesRoutes = require('./routes/sales');

// Initialize the app
const app = express();
app.use(express.json());

app.use('/products', productRoutes);
app.use('/supplies', suppliesRoutes);
app.use('/sales', salesRoutes);


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
