require('dotenv').config();
const { fetch } = require('undici');
const express = require('express');
const router = express.Router();
const Coordinates = require('../models/coordinates');
const usersModule = require('./users');
const { authenticateToken } = usersModule;

router.get('/', authenticateToken, async (req, res) => {
  try {
    const coordinates = await Coordinates.find();
    res.json(coordinates);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const coordinates = await Coordinates.create(req.body);

    res.status(201).json(coordinates);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/add', authenticateToken, async (req, res) => {
  try {
    // const schemaKeys = Object.keys(Coordinates.schema.paths);
    const newCoordinates = req.query;
    // const newCoordinatesKeys = Object.keys(newCoordinates);
    // const missingKeys = getMissingKeys(newCoordinatesKeys, schemaKeys);
    // missingKeys.forEach((key) => Coordinates.schema.add({ key: String }));
    const coordinates = await Coordinates.create(newCoordinates);
    console.log(coordinates);
    res.status(201).json(coordinates);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/matched', authenticateToken, async (req, res) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;
  const url = `https://api.geoapify.com/v1/mapmatching?apiKey=${API_KEY}`;
  try {
    const coordinates = await Coordinates.find();
    const waypoints = coordinates.map((el) => {
      return {
        location: [el.lon, el.lat],
      };
    });
    const matchedWaypoints = await fetchMatchData(url, waypoints);
    res.status(200).json(matchedWaypoints);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const fetchMatchData = async (url, waypoints) => {
  const body = {
    mode: 'drive',
    waypoints: waypoints,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

module.exports = router;
