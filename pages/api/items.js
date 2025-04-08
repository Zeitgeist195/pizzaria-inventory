import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM inventory ORDER BY id')
      res.status(200).json(rows)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { item_name, quantity, minimum_stock, type } = req.body
    try {
      const { rows } = await pool.query(
        'INSERT INTO inventory (item_name, quantity, minimum_stock, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [item_name, quantity, minimum_stock, type]
      )
      res.status(201).json(rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM inventory WHERE id = $1', [id])
      res.status(204).end()
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PUT') {
    const { id, item_name, quantity, minimum_stock, type } = req.body
    try {
      const { rows } = await pool.query(
        'UPDATE inventory SET item_name = $1, quantity = $2, minimum_stock = $3, type = $4 WHERE id = $5 RETURNING *',
        [item_name, quantity, minimum_stock, type, id]
      )
      res.status(200).json(rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}