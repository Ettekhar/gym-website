const express = require('express');
const router = express.Router();
const { getPlan, createPlan, UpdatePlan, DeletePlan } = require('../Models/plan.js');

// Get plan
router.get('/:pid?', async (req, res) => {
    try {
        const [result] = await getPlan(req.params.pid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create plan
router.post('/', async (req, res) => {
    const { pid, planName, description, validity, amount, active } = req.body;
    try {
        const [result] = await createPlan(pid, planName, description, validity, amount, active);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update plan
router.put('/:pid', async (req, res) => {
    const { planName, description, validity, amount, active } = req.body;
    try {
        const result = await UpdatePlan(req.params.pid, planName, description, validity, amount, active);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete plan
router.delete('/:pid', async (req, res) => {
    try {
        const result = await DeletePlan(req.params.pid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
