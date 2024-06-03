const express = require('express');
const router = express.Router();
const { getAdmin, createAdmin, UpdateAdmin, DeleteAdmin } = require('../Models/admin.js');

// Get admin(s)
router.get('/:username?', async (req, res) => {
    try {
        const [result] = await getAdmin(req.params.username);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create admin
router.post('/', async (req, res) => {
    const { username, pass_key, securekey, Full_name } = req.body;
    try {
        const [result] = await createAdmin(username, pass_key, securekey, Full_name);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update admin
router.put('/:username', async (req, res) => {
    const { pass_key, securekey, Full_name } = req.body;
    try {
        const result = await UpdateAdmin(req.params.username, pass_key, securekey, Full_name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete admin
router.delete('/:username', async (req, res) => {
    try {
        const result = await DeleteAdmin(req.params.username);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
