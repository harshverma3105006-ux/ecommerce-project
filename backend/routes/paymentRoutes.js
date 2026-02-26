const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

router.post('/create-order', async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send('Some error occured');
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/config', (req, res) => {
    res.send(process.env.RAZORPAY_KEY_ID || 'sb');
});

module.exports = router;
