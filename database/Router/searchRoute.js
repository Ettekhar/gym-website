const express = require('express');
const router = express.Router();
const pool = require('../database.js'); // Make sure this is your database connection pool

router.get('/', async (req, res) => {
    try {
        const { memberId, name } = req.query;

        // Construct the SQL query based on the provided parameters
        let query = 'SELECT * FROM members WHERE ';
        const queryParams = [];

        if (memberId) {
            query += 'memberId = ? ';
            queryParams.push(memberId);
        }

        if (name) {
            if (memberId) query += 'AND ';
            query += 'name LIKE ?';
            queryParams.push(`%${name}%`);
        }

        // Execute the SQL query
        const [results] = await pool.query(query, queryParams);

        // Send the results back to the client
        res.json(results);
    } catch (error) {
        console.error('Error searching members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;