const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const express = require('express');
const authenticationToken = require('../middleware/auth');

const router = express.Router();
const saltsRound = 10;

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

        // 1. Hash the password
        const saltsRound = 10;
        const hashPassword = await bcrypt.hash(password, saltsRound);

        // 2. Generate a 4-digit OTP and 15-minute expiry
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // 3. Print the OTP to the terminal (for testing/development)
        console.log(`\n📨 [TEST/DEV] Verification OTP for ${email}: ${otp}\n`);

        // 4. Insert user into DB with OTP details
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, role, verification_otp, otp_expires_at, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, is_verified',
            [name, email, hashPassword, 'guest', otp, otpExpiresAt, false]
        );

        // 5. Generate a temporary token (optional, but useful)
        const token = jwt.sign(
            { userId: result.rows[0].id, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully! Please check your email for the verification code.',
            token,
            user: result.rows[0],
            devOtp: otp // We return the OTP in response so you can test it easily via Postman/cURL
        });

    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration.',
            error: err.message,
        });
    }
});


router.post('/login', async (req, res) => {
    if (!req.body) return res.json({
        success: false,
        message: "please provide the fields"
    })
    const { email, password } = req.body;
    // const decryptPassword = bcrypt.
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
        });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
        });
    }
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET, // Use an environment variable in production!
        { expiresIn: '1h' }
    );
    res.json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
})

// Reset Password endpoint
router.post('/reset-password', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Please provide the fields"
        });
    }
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match.'
        });
    }

    try {
        // 1. Verify if user exists
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }

        // 2. Hash the new password using the predefined saltsRound (10)
        const hashedPassword = await bcrypt.hash(password, saltsRound);

        // 3. Update password in the database
        const updatedUser = await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2 RETURNING id, name, email, role',
            [hashedPassword, email]
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully!',
            user: updatedUser.rows[0]
        });

    } catch (err) {
        console.error('❌ Password reset error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error during password reset.',
            error: err.message
        });
    }
});

// Get Current User Profile
router.get('/me', authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        // Fetch user from database
        const result = await pool.query(
            'SELECT id, name, email, role, phone, created_at, updated_at FROM users WHERE id = $1',
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        return res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Error fetching user profile:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error.',
            error: err.message
        });
    }
});

// Verify Email OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and OTP code are required.'
        });
    }
});

module.exports = router;