module.exports = {
    up: async (pgm) => {
        await pgm.addColumns('users', {
            is_verified: { type: 'boolean', default: false, notNull: true },
            verification_otp: { type: 'varchar(4)' },
            otp_expires_at: { type: 'timestamp with time zone' },
        });
    },
    down: async (pgm) => {
        await pgm.dropColumns('users', ['is_verified', 'verification_otp', 'otp_expires_at']);
    },
};
