const express = require('express');
const router = express.Router();
const { getHealthStatus, createHealthStatus, UpdateHealthStatus, DeleteHealthStatus } = require('../Models/healthStatus.js');

// Get health status
router.get('/:hid?', async (req, res) => {
    try {
        const [result] = await getHealthStatus(req.params.hid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create health status
router.post('/', async (req, res) => {
    const { calorie, height, weight, fat, remarks, uid } = req.body;
    try {
        const [result] = await createHealthStatus(calorie, height, weight, fat, remarks, uid);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update health status
router.put('/:uid', async (req, res) => {
    const { calorie, height, weight, fat, remarks } = req.body;
    const id = req.params.uid;
    try {
        const result = await UpdateHealthStatus(req.params.uid, calorie, height, weight, fat, remarks);
        console.log({result,id})
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete health status
router.delete('/:hid', async (req, res) => {
    try {
        const result = await DeleteHealthStatus(req.params.hid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
