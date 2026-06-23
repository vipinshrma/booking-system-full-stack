const express = require('express')
const pool = require('../db')
const router = express.Router()

router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let queryText = 'SELECT * FROM hotels'
        let queryParams = [];
        if (search) {
            queryText += ` WHERE LOWER(name) LIKE $1 OR LOWER(location) LIKE $1`;
            queryParams.push(`%${search.toLocaleLowerCase()}%`);
        }
        queryText += ' ORDER BY id ASC';
        const result = await pool.query(queryText, queryParams)
        return res.json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error('❌ Error fetching hotels:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching hotels.',
            error: error.message
        });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [id])
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found.'
            });
        }
        return res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error fetching hotel details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching hotel details.',
            error: error.message
        });
    }
})
module.exports = router;