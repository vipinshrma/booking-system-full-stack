module.exports = {
    up: async (pgm) => {
        // Create hotels table
        await pgm.createTable('hotels', {
            id: { type: 'serial', primaryKey: true },
            name: { type: 'varchar(100)', notNull: true },
            description: { type: 'text' },
            location: { type: 'varchar(255)', notNull: true },
            star_rating: {
                type: 'smallint',
                check: "star_rating BETWEEN 1 AND 5",
            },
            image_url: { type: 'varchar(255)' },
            created_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
            updated_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
        });
    },

    down: async (pgm) => {
        await pgm.dropTable('hotels');
    },
};