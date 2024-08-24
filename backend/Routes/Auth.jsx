const express = require('express');
const User = require('../models/user.jsx');
const Order = require('../models/Orders.jsx');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails.jsx');
const jwtSecret = "HaHa";

// Create a user and store data in MongoDB Atlas
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = { user: { id: user.id } };
            const authToken = jwt.sign(data, jwtSecret);
            success = true;
            res.json({ success, authToken });
        }).catch(err => {
            console.log(err);
            res.json({ error: "Please enter a unique value." });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Authenticate a user
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Try logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try logging in with correct credentials" });
        }

        const data = { user: { id: user.id } };
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get logged in user details
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get location based on latitude and longitude
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat;
        let long = req.body.latlong.long;
        let location = await axios
            .get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`)
            .then(res => {
                let response = res.data.results[0].components;
                let { village, county, state_district, state, postcode } = response;
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode);
            })
            .catch(error => {
                console.error(error);
                return "Error fetching location";
            });
        res.send({ location });
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
});

// Handle order data
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.splice(0, 0, { Order_date: req.body.order_date });

    try {
        let existingOrder = await Order.findOne({ email: req.body.email });
        if (existingOrder === null) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get my order data
router.post('/myOrderData', async (req, res) => {
    try {
        let orderData = await Order.findOne({ email: req.body.email });
        if (!orderData) {
            return res.status(404).json({ msg: "No orders found" });
        }
        res.json({ orderData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
