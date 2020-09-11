const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 9001;

app.use(morgan('dev'));

app.get('/api/stream', (req, res) => {
  let timer;
  let totalTime = 0;
  let streamData = '0';
  timer = setInterval(() => {
    res.write(streamData);
    streamData = parseInt(streamData);
    streamData++;
    streamData = streamData + '';
    totalTime++;
    if (totalTime >= 500) {
      clearInterval(timer);
      res.end();
    }
  }, 10);
});

app.use(function (req, res) {
  res.status(404).send('404 not found');
});

app.listen(PORT).on('listening', () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
