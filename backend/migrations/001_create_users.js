module.exports = {
    up: async (pgm) => {
        await pgm.createTable('users', {
            id: { type: 'serial', primaryKey: true },
            name: { type: 'varchar(100)', notNull: true },
            email: { type: 'varchar(255)', notNull: true, unique: true },
            password_hash: { type: 'varchar(255)', notNull: true },
            role: {
                type: 'varchar(20)',
                notNull: true,
                default: 'guest',
                check: "role IN ('guest', 'admin', 'receptionist')",
            },
            phone: { type: 'varchar(20)' },
            created_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
            updated_at: { type: 'timestamp with time zone', default: pgm.func('NOW()') },
        });

        // Add indexes
        await pgm.createIndex('users', ['email']);
    },
    down: async (pgm) => {
        await pgm.dropTable('users');
    },
};