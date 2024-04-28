require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(error);
});
db.on('open', () => {
  console.log('Connected to Database!');
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});

const port = 3000;
const coordinatesRouter = require('./routes/coordinates');
const usersModule = require('./routes/users');

app.use(express.json());

const { usersRouter } = usersModule;

app.use('/api/coordinates', coordinatesRouter);
app.use('/api/users', usersRouter);
