const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER || "postgres",
    host: process.env.HOST || "localhost",
    password: process.env.PASSWORD || "123456",
    port: process.env.PORT || 5432,
    database: process.env.DATABASE || ""
})
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error("FAILED TO CONNECT TO POSTGRES DB: ", err)
//     } else {
//         console.log("CONNECTED TO POSTGRES DB,TIME: ", res.rows[0].now)
//     }
// })
module.exports = pool;