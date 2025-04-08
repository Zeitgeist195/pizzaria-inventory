import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
    }
})

    export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { rows } = await pool.query('SELECT * FROM inventory ORDER BY id')
            return res.status(200).json(rows)
        }

        if (req.method === 'POST') {
            const { item_name, quantity, minimum_stock, type } = req.body
            
            if (!item_name || quantity === undefined || minimum_stock === undefined) {
            return res.status(400).json({ error: 'Dados incompletos' })
            }

            const { rows } = await pool.query(
            `INSERT INTO inventory 
                (item_name, quantity, minimum_stock, type) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *`,
            [item_name, quantity, minimum_stock, type]
            )
            return res.status(201).json(rows[0])
        }

        if (req.method === 'PUT') {
            const { id, item_name, quantity, minimum_stock, type } = req.body
            
            if (!id || !item_name || quantity === undefined || minimum_stock === undefined) {
            return res.status(400).json({ error: 'Dados incompletos' })
            }

            const { rows } = await pool.query(
            `UPDATE inventory 
                SET item_name = $1, quantity = $2, minimum_stock = $3, type = $4 
                WHERE id = $5 
                RETURNING *`,
            [item_name, quantity, minimum_stock, type, id]
            )
            
            if (rows.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado' })
            }
            
            return res.status(200).json(rows[0])
        }

        if (req.method === 'DELETE') {
            const { id } = req.query
            
            if (!id) {
            return res.status(400).json({ error: 'ID não fornecido' })
            }

            const { rowCount } = await pool.query(
            'DELETE FROM inventory WHERE id = $1',
            [id]
            )
            
            if (rowCount === 0) {
            return res.status(404).json({ error: 'Item não encontrado' })
            }
            
            return res.status(204).end()
        }

        return res.status(405).json({ error: 'Método não permitido' })

    } catch (err) {
        console.error('Database error:', err)
        return res.status(500).json({
            error: 'Erro interno do servidor',
            details: err.message
        })
    } finally {
        await pool.end()
    }
}