const express = require('express');
const router = express.Router();
const { getAddress, createAddress, UpdateAddress, DeleteAddress } = require('../Models/address.js');

// Get address
router.get('/:id?', async (req, res) => {
    try {
        const result = await getAddress(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create address
router.post('/', async (req, res) => {
    const { id, streetName, state, city, zipcode } = req.body;
    try {
        const [result] = await createAddress(id, streetName, state, city, zipcode);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update address
router.put('/:id', async (req, res) => {
    const { streetName, state, city, zipcode } = req.body;
    try {
        const result = await UpdateAddress(req.params.id, streetName, state, city, zipcode);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete address
router.delete('/:id', async (req, res) => {
    try {
        const result = await DeleteAddress(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
