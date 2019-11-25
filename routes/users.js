const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/Users");
const Inventory = require("../models/inventory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = router;
const jwtSecret = "mysecret";

//validation for user sign-up
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        name,
        email,
        password
      });
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      let current = await User.findOne({ email });
      console.log(current.id);
      const inventoryField = {};
      inventoryField.user = current.id;
      inventory = new Inventory(inventoryField);
      await inventory.save();
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.cookie('token', token, { httpOnly: false }).sendStatus(200);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    // if user exists
  }
);
