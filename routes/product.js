const express = require('express')
const router = express.Router()
const db = require('../db') // Import the database connection

// GET all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Products'
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ data: results })
  })
})

// GET a single product by ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Products WHERE product_id = ?'
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ data: results[0] })
  })
})

router.get('/:id/sales', (req, res) => {
  const query = 'SELECT products.name, sum(sales.total_amount) AS jumlah_penjualan FROM Products JOIN sales WHERE sales.product_id = ? GROUP BY products.name'
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ data: results[0] })
  })
})

// POST (create) a new product
router.post('/', (req, res) => {
  const { name, description, price, stock_quantity } = req.body
  const query =
    'INSERT INTO Products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)'
  db.query(query, [name, description, price, stock_quantity], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res
      .status(201)
      .json({ message: 'Product created', productId: result.insertId })
  })
})

// PUT (update) an existing product
router.put('/:id', (req, res) => {
  const { name, description, price, stock_quantity } = req.body
  const query =
    'UPDATE Products SET name = ?, description = ?, price = ?, stock_quantity = ? WHERE product_id = ?'
  db.query(
    query,
    [name, description, price, stock_quantity, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: 'Product updated' })
    }
  )
})

// DELETE a product
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Products WHERE product_id = ?'
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: 'Product deleted' })
  })
})

module.exports = router
