const express = require('express')
const pool = require('../db')
const authenticationToken = require('../middleware/auth')
const router = express.Router()

router.post('/', authenticationToken, async (req, res) => {
    const { hotel_id, check_in_date, check_out_date, total_price } = req.body || {};
    const userId = req.user.userId;
    if (!hotel_id || !check_in_date || !check_out_date || !total_price) {
        return res.status(400).json({
            success: false,
            message: 'All fields (hotel_id, check_in_date, check_out_date, total_price) are required.'
        });
    }
    try {
        const hotelCheck = await pool.query("SELECT id FROM hotels WHERE id=$1", [hotel_id])
        if (hotelCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'The selected hotel/resort does not exist.'
            });
        }
        const result = await pool.query(
            'INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, hotel_id, check_in_date, check_out_date, total_price, 'upcoming']
        );
        return res.status(201).json({
            success: true,
            message: 'Booking placed successfully!',
            booking: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while placing booking.',
            error: error.message
        });
    }
})

router.get('/', authenticationToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const result = await pool.query('SELECT b.id,b.hotel_id,b.check_in_date,b.check_out_date,b.total_price,b.status , h.name AS hotel_name,h.location AS hotel_location , h.image_url AS hotel_image , h.star_rating AS hotel_rating FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE b.user_id = $1 ORDER BY b.check_in_date ASC', [userId])
        return res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error fetching user bookings:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings.',
            error: error.message
        });
    }
})

router.post('/:id/cancel', authenticationToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId
    try {
        const bookingCheck = await pool.query('SELECT * FROM bookings WHERE id= $1', [id])
        if (bookingCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.'
            });
        }
        const booking = bookingCheck.rows[0];
        if (booking.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not own this booking.'
            });
        }
        if (booking.status !== 'upcoming') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel booking. It is already ${booking.status}.`
            });
        }

        const result = await pool.query('UPDATE bookings SET status=$1,updated_at = NOW() WHERE id =$2 RETURNING *', ['cancelled', id])
        return res.json({
            success: true,
            message: 'Booking cancelled successfully!',
            booking: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error cancelling booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while cancelling booking.',
            error: error.message
        });
    }
})

module.exports = router;
