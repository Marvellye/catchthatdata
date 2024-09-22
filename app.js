const express = require('express');
const cors = require('cors'); // Import CORS
const path = require('path');
const fs = require('fs-extra'); // For handling JSON files

const app = express();

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// File path for the database
const dbFilePath = path.join(__dirname, 'db.json');

// Initialize db.json if it doesn't exist
if (!fs.existsSync(dbFilePath)) {
  fs.writeJsonSync(dbFilePath, []); // Start with an empty array
}

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the client information data
app.post('/client-info', async (req, res) => {
  try {
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

    // Prepare data to save
    const clientData = {
      ip,
      batteryPercentage,
      batteryStatus,
      screenWidth,
      screenHeight,
      deviceType,
      os,
      browser,
      dateTime,
    };

    // Read current database content
    const currentData = await fs.readJson(dbFilePath);

    // Append new data to the array
    currentData.push(clientData);

    // Save updated data back to db.json
    await fs.writeJson(dbFilePath, currentData);

    console.log('Client Information Received and Saved:', clientData);

    // Respond to the client
    res.status(200).json({ message: 'Data received and saved successfully' });
  } catch (error) {
    console.error('Error saving client data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

// Route to view the contents of db.json
app.get('/view-db', async (req, res) => {
  try {
    const data = await fs.readJson(dbFilePath); // Read the JSON file
    res.json(data); // Send the JSON data as a response
  } catch (error) {
    console.error('Error reading db.json:', error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});

// Route to Grab IP
app.get('/ip', (req, res) => {
    // Get client IP address
    const ipList = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const mainIp = ipList.split(',')[0].trim();

    // Check for format query parameter
    const format = req.query.format;

    if (format === 'json') {
        res.json({ ip: mainIp });
    } else {
        res.send(mainIp);
    }
});

// Serve the client.js file for external use
app.use('/api.js', express.static(path.join(__dirname, 'public', 'api.js')));

// Start the server
app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
