const express = require('express');
const router = express.Router();
const { getEnroll, createEnroll, UpdateEnroll, DeleteEnroll } = require('../Models/enroll.js');

// Get enrollment(s)
router.get('/:et_id?', async (req, res) => {
    try {
        const [result] = await getEnroll(req.params.et_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create enrollment
router.post('/', async (req, res) => {
    const { pid, uid, paid_date, expire, renewal } = req.body;
    try {
        const [result] = await createEnroll(pid, uid, paid_date, expire, renewal);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update enrollment
router.put('/:et_id', async (req, res) => {
    const { pid, uid, paid_date, expire, renewal } = req.body;
    try {
        const result = await UpdateEnroll(req.params.et_id, pid, uid, paid_date, expire, renewal);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete enrollment
router.delete('/:et_id', async (req, res) => {
    try {
        const result = await DeleteEnroll(req.params.et_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
