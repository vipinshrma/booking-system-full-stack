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
    if (!user.is_verified) {
        return res.status(403).json({
            success: false,
            isVerified: false,
            message: 'Please verify your email address before logging in.',
            email: user.email
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
    try {
        // fetch user from db
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }
        const user = result.rows[0]
        if (user.is_verified) {
            return res.status(200).json({
                success: true,
                message: 'Account is already verified.'
            });
        }
        if (user.verification_otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' })
        }
        const now = new Date()
        const expireTime = new Date(user.otp_expires_at)
        if (now > expireTime) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new one.'
            });
        }
        await pool.query('UPDATE users SET is_verified= true, verification_otp=NULL,otp_expires_at=NULL,updated_at=NOW() WHERE id=$1', [user.id])

        // 6. Generate active login JWT token

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Account verified successfully!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_verified: true
            }
        });

    } catch (err) {
        console.error('❌ OTP verification error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error during OTP verification.',
            error: err.message
        });
    }
});

// Resend Email Verification OTP
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email address is required.'
        });
    }

    try {
        // 1. Fetch user from DB
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }

        const user = result.rows[0];

        // 2. If already verified, do not resend
        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'This account is already verified.'
            });
        }

        // 3. Generate a new 4-digit OTP and 15-minute expiry
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // 4. Print the OTP to the terminal (for testing/development)
        console.log(`\n📨 [TEST/DEV] Verification OTP for ${email}: ${otp} (Resent)\n`);

        // 5. Update user record with new OTP
        await pool.query(
            'UPDATE users SET verification_otp = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3',
            [otp, otpExpiresAt, user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Verification code resent successfully! Please check your email.',
            devOtp: otp // Return for testing ease
        });

    } catch (error) {
        console.error('❌ Resend OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during OTP resend.',
            error: error.message
        });
    }
});

// Request Password Reset OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email address is required.'
        });
    }

    try {
        // 1. Fetch user from DB
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }

        const user = result.rows[0];

        // 2. Generate a 4-digit reset OTP and 15-minute expiry
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // 3. Print the OTP to the terminal (mock email sending)
        console.log(`\n🔑 [TEST/DEV] Password Reset OTP for ${email}: ${otp}\n`);

        // 4. Update the user record with the reset OTP and expiry
        await pool.query(
            'UPDATE users SET verification_otp = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3',
            [otp, otpExpiresAt, user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset code sent successfully! Please check your email.',
            devOtp: otp // Returned for easy testing
        });

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during forgot password request.',
            error: error.message
        });
    }
});

// Reset Password endpoint (Secure with OTP Verification)
router.post('/reset-password', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Please provide the fields"
        });
    }
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'All fields (email, otp, password, confirmPassword) are required.'
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

        const user = userExist.rows[0];

        // 2. Verify OTP matches
        if (user.verification_otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password reset code.'
            });
        }

        // 3. Verify OTP expiration
        const now = new Date();
        if (new Date(user.otp_expires_at) < now) {
            return res.status(400).json({
                success: false,
                message: 'Password reset code has expired. Please request a new one.'
            });
        }

        // 4. Hash the new password using the predefined saltsRound (10)
        const hashedPassword = await bcrypt.hash(password, saltsRound);

        // 5. Update password in the database and clear the OTP fields
        const updatedUser = await pool.query(
            'UPDATE users SET password_hash = $1, verification_otp = NULL, otp_expires_at = NULL, updated_at = NOW() WHERE email = $2 RETURNING id, name, email, role',
            [hashedPassword, email]
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully! You can now log in with your new password.',
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error('❌ Password reset error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during password reset.',
            error: error.message
        });
    }
});




module.exports = router;