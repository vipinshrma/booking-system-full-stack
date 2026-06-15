const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const express = require('express')

const router = express.Router();

// Test endpoint: Check DB connection + return a user (if any exists)
router.get('/api/test-db', async (req, res) => {
    try {
        // Query the users table (or any table)
        const result = await pool.query('SELECT * FROM users LIMIT 1');
        res.json({
            success: true,
            message: 'PostgreSQL connected successfully!',
            data: result.rows[0] || 'No users found (table is empty).',
        });
    } catch (err) {
        console.error('❌ Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to connect to PostgreSQL.',
            error: err.message,
        });
    }
});

router.post('/register', async (req, res) => {
    if (!req.body) return res.json({
        success: false,
        message: "please provide the fields"
    })
    const { name = '', email = '', password = '' } = req.body || {};
    if (!name || !email || !password) return res.json({
        success: false,
        message: "all fields are required"
    });
    try {
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists.',
            });
        }

        //hash the password
        const saltsRound = 10;
        const hashPassword = await bcrypt.hash(password, saltsRound);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashPassword, 'guest']
        );
        // 5. Generate a JWT token (for immediate login)
        const token = jwt.sign(
            { userId: result.rows[0].id, role: result.rows[0].role },
            'your_secret_key', // Replace with a strong secret (use .env in production!)
            { expiresIn: '1h' }
        );
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: result.rows[0], // id, name, email, role
        });

    } catch (err) {
        console.error('❌ Registration error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration.',
            error: err.message,
        });
    }

})

module.exports = router;