module.exports = {
    up: async (pgm) => {
        await pgm.createTable('bookings', {
            id: { type: 'serial', primaryKey: true },
            user_id: {
                type: 'integer',
                notNull: true,
                references: 'users(id)',
                onDelete: 'CASCADE',
            },
            hotel_id: {
                type: 'integer',
                notNull: true,
                references: 'hotels(id)',
                onDelete: 'CASCADE',
            },
            check_in_date: { type: 'date', notNull: true },
            check_out_date: { type: 'date', notNull: true },
            total_price: { type: 'numeric(10, 2)', notNull: true },
            status: {
                type: 'varchar(20)',
                notNull: true,
                default: 'upcoming',
                check: "status IN ('upcoming', 'past', 'cancelled')",
            },
            created_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
            updated_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
        });

        // Add indexes for quicker queries
        await pgm.createIndex('bookings', ['user_id']);
        await pgm.createIndex('bookings', ['hotel_id']);
    },
    down: async (pgm) => {
        await pgm.dropTable('bookings');
    },
};
