const { Pool } = require('pg');
const itemsPool = new Pool ({
    
     port: 5432,
    connectionString: process.env.DBConnLink,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = itemsPool;