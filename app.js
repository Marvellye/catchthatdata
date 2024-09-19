const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the client information data
app.post('/client-info', (req, res) => {
  const {
    ip,
    batteryPercentage,
    batteryStatus,
    screenWidth,
    screenHeight,
    deviceType,
    os,
    browser,
    dateTime,
  } = req.body;

  console.log('Client Information Received:');
  console.log(`IP: ${ip}`);
  console.log(`Battery Percentage: ${batteryPercentage}%`);
  console.log(`Battery Status: ${batteryStatus}`);
  console.log(`Screen Size: ${screenWidth}x${screenHeight}`);
  console.log(`Device Type: ${deviceType}`);
  console.log(`OS: ${os}`);
  console.log(`Browser: ${browser}`);
  console.log(`Date/Time: ${dateTime}`);

  res.status(200).json({ message: 'Data received successfully' });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});