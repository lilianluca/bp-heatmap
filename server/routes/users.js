require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token passed' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
};

router
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;

      const foundedUserByEmail = await User.findOne({ email: email });
      if (foundedUserByEmail) {
        return res.status(409).json({ message: 'Email already exists.' });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

router
  .route('/:userId')
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  })
  .delete(async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      res.status(202).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

router.route('/login').post(async (req, res) => {
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
      res.status(200).json('Welcome!');
    } else {
      res.status(401).json({ message: 'Wrong credetials' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.route('/auth').post(async (req, res) => {
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
      console.log(process.env.ACCESS_TOKEN_SECRET);
      const myUser = { name: email };
      const accessToken = jwt.sign(myUser, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ accessToken: accessToken });
    } else {
      res.status(401).json({ message: 'Wrong credetials' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

exports.usersRouter = router;
exports.authenticateToken = authenticateToken;
