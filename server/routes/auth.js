require('dotenv').config();

const express = require('express');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/auth', async (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ message: `User with email ${email} doesn't exists.` });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ accessToken: accessToken });
    } else {
      res.status(401).json({ message: 'Wrong credetials' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
