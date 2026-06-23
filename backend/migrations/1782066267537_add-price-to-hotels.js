module.exports = {
    up: async (pgm) => {
        await pgm.addColumns('hotels', {
            price_per_night: { type: 'integer', notNull: true, default: 150 }
        });
    },
    down: async (pgm) => {
        await pgm.dropColumns('hotels', ['price_per_night']);
    }
};
