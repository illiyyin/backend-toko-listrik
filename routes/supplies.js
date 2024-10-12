const express = require('express')
const router = express.Router()
const db = require('../db') // Import the database connection

// GET all supplies
router.get('/', (req, res) => {
	db.query('SELECT * FROM supplies', (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message })
		}
		res.json({ data: results })
	})
})

// GET a supply by ID
router.get('/:id', (req, res) => {
	const supplyId = req.params.id
	db.query(
		'SELECT * FROM supplies WHERE supply_id = ?',
		[supplyId],
		(err, result) => {
			if (err) {
				return res.status(500).json({ error: err.message })
			}
			if (result.length === 0) {
				return res.status(404).json({ error: 'Supply not found' })
			}
			res.json({ data: result[0] })
		}
	)
})

// POST (create) a new supply record
router.post('/:id', (req, res) => {
	const { supply_date, quantity_supplied } = req.body
	const product_id = req.params.id

  // insert new data to supplies table
	const insertToSuppliesQuery =
		'INSERT INTO supplies (product_id, supply_date, quantity_supplied) VALUES (?, ?, ?)'
	db.query(
		insertToSuppliesQuery,
		[product_id, supply_date, quantity_supplied],
    (err, result) => {
      
			if (err) {
				return res.status(500).json({ error: err.message })
      }
      
      // get current product stock
			const findCurrentProductStockQuery =
				'SELECT * FROM Products WHERE product_id = ?'
      db.query(findCurrentProductStockQuery, [product_id], (err, results) => {
        
				if (err) {
					return res.status(500).json({ error: err.message })
        }
        
				if (results.length === 0) {
					return res.status(404).json({ message: 'Product not found' })
        }
        
        // update stock with the current stock + new data from supplies
				const updateStockProductQuery =
					'UPDATE Products SET stock_quantity = ? WHERE product_id = ?'
        const totalCurrentStock = results[0].stock_quantity + quantity_supplied
        
				db.query(
					updateStockProductQuery,
					[totalCurrentStock, product_id],
          (err) => {
            
						if (err) {
							return res.status(500).json({ error: err.message })
						}
					}
				)
      })
      
			res
				.status(201)
				.json({ message: 'Supply recorded', supplyId: result.insertId })
		}
	)
})

// PUT (update) an existing supply record
router.put('/:id', (req, res) => {
	const supplyId = req.params.id
	const { product_id, supply_date, quantity_supplied } = req.body
	db.query(
		'UPDATE supplies SET product_id = ?, supply_date = ?, quantity_supplied = ? WHERE supply_id = ?',
		[product_id, supply_date, quantity_supplied, supplyId],
		(err, result) => {
			if (err) {
				return res.status(500).json({ error: err.message })
			}
		}
	)
})

module.exports = router
