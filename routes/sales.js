const express = require('express')
const router = express.Router()
const db = require('../db') // Import the database connection

// GET all sales
router.get('/', (req, res) => {
  db.query('SELECT * FROM Sales', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET a sale by ID
router.get('/:id', (req, res) => {
  const saleId = req.params.id;
  db.query('SELECT * FROM Sales WHERE sale_id = ?', [saleId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(result[0]);
  });
});

// POST (create) a new sale
router.post('/', (req, res) => {
  const { product_id, quantity, sale_date } = req.body;

  const findProductQuery = 'SELECT * from products where product_id = ?'

  db.query(findProductQuery, [product_id], (err, results) => {
    let product

    let total_amount = 0
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    product = results[0]
    console.log(product)
    total_amount = product.price * quantity
    const insertSaleQuery = 'INSERT INTO Sales (product_id, quantity, sale_date, total_amount) VALUES (?, ?, ?, ?)'
    db.query(insertSaleQuery,
      [product_id, quantity, sale_date, total_amount], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    const updateStockProductQuery =
      'UPDATE Products SET stock_quantity = ? WHERE product_id = ?'
    const currentStock = product.stock_quantity - quantity
    db.query(
      updateStockProductQuery,
      [currentStock, product_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        res.json({ message: 'Sale recorded' })
      }
    )
  })

});

// PUT (update) an existing sale
router.put('/:id', (req, res) => {
  const saleId = req.params.id;
  const { product_id, quantity, sale_date, total_amount } = req.body;
  db.query('UPDATE Sales SET product_id = ?, quantity = ?, sale_date = ?, total_amount = ? WHERE sale_id = ?',
    [product_id, quantity, sale_date, total_amount, saleId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Sale updated' });
    });
});

// DELETE a sale
router.delete('/:id', (req, res) => {
  const saleId = req.params.id;
  db.query('DELETE FROM Sales WHERE sale_id = ?', [saleId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Sale deleted' });
  });
});


module.exports = router