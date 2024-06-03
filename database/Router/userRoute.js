const express = require('express');
const router = express.Router();
const { getUser, getUserByDate, createUser, UpdateUser, DeleteUser } = require('../Models/users.js');

// Get user
router.get('/:id?', async (req, res) => {
    try {
        const [result] = await getUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get user using Date
router.get('/:month?/:year?', async (req, res) => {
    const { month, year } = req.params;
    try {
        console.log({month,year});
        const result = await getUserByDate(month, year);
        console.log({result})
        res.json(result);
    } catch (error) {
        console.log('i ran')
        res.status(500).json({ error: error.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    const { userid, username, gender, mobile, email, dob, joining_date } = req.body;
    try {
        const [result] = await createUser(userid, username, gender, mobile, email, dob, joining_date);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { username, gender, mobile, email, dob, joining_date } = req.body;
    try {
        const result = await UpdateUser(req.params.id, username, gender, mobile, email, dob, joining_date);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await DeleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
