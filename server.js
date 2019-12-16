const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const config = {
  name: 'scrabble-api',
  port: 3000,
  host: '0.0.0.0',
  SCORE_ADDRESS: process.env.SCORE_ADDRESS || 'localhost',
  SCORE_PORT: process.env.SCORE_PORT || 3001,
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

app.get('/', (req, res) => {
  res.status(200).send('Scrabble Api is running');
});

app.get('/scrabbleScore/:word', async (req, res, err) => {
  const word = req.params.word;
  try {
    const score = await axios.get(
      `http://${config.SCORE_ADDRESS}:${config.SCORE_PORT}/${word}`
    );
    res.json(score.data);
  } catch (err) {
    res.json({ message: 'call to service scrabble hs failed', payload: err });
  }
});

app.listen(config.port, e => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on port ${config.port}`);
});
