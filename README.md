# CatchThatData v1 - Documentation
#100daysofMiva day 10 - 🥲

Hello nerds and devs😎💯 Today i worked on a simplified api with JavaScript in Nodejs environment that catches almost all available information possible from the client's device. Let's have a walk...
## Overview
**CatchThatData** is a Simple CDN API that helps developers or ethical hackers retrieve essential information from a user’s device, such as IP address, battery life, screen dimensions, and more. This project consists of a webpage that presents how to use the API and provides a CDN script that developers can include in their web projects to access device data. 

### Project Features:
- **Client Data Collection**: Collects various pieces of information such as IP address, battery life, device type, screen resolution, and more.
- **Educational Use**: The tool is built for learning purposes, providing insight into how web technologies can retrieve user data.
- **Interactive UI**: Displays collected data in a card-based layout and provides an installation guide for developers.

---

## Code Structure Breakdown

### HTML Layout
The layout consists of two main sections:
1. **App (Main Section)**: This section contains the title, description, and a button to retrieve installation code.
2. **App2 (Code Section)**: This hidden section shows the CDN script installation instructions for developers.
   
```html
<main class="container">
   <!-- App Section: Main information and CDN API usage guide -->
   <div id="app" class="card mx-auto my-5 p-4" style="max-width: 600px;">
      <!-- Title and Version -->
      <div class="card-title d-inline-flex">
         <h3>CatchThatData</h3>
         <badge class="badge">v1</badge>
      </div>
      <!-- Introduction and description -->
      <p>This is a Simple CDN that can help devs (or Hackers) get your device information...</p>
      <!-- Data Collection Section -->
      <div id="response" class="data-box">
         Loading...
      </div>
      <!-- Keywords (features) -->
      <div class="keywords d-flex flex-wrap gap-2 mb-3">
         <div class="keyword">IP address</div>
         <div class="keyword">battery life</div>
         <div class="keyword">status</div>
         <div class="keyword">width</div>
         <div class="keyword">height</div>
         <div class="keyword">type</div>
         <div class="keyword">timezone</div>
         <div class="keyword">location</div>
      </div>
      <!-- Button to get installation code -->
      <button class="btn get w-100" onclick="getVideo()">Get Install Code</button>
   </div>

   <!-- App2 Section: CDN Script Installation Guide -->
   <div id="app2" class="card mx-auto my-5 p-4" style="max-width: 600px; display: none;">
      <h3>CatchThatData</h3>
      <p>This is for educational purposes only!</p>
      <div class="install code mt-3">
         <code>
         &lt;!-- Include the remote script --&gt; <br/>
         &lt;script src="https://api.marvelly.com.ng/catchthatdata/app.min.js"&gt;&lt;/script&gt;<br/>
         &lt;!-- Initialize the client data collection --&gt;<br/>
         &lt;script&gt;<br/>
         window.clientInfoTracker({<br/>
            endpoint: 'https://example.com/client-data',<br/>
         });<br/>
         &lt;/script&gt;
         </code>
      </div>
      <button class="btn get w-100" onclick="getVideoo()">‹ Go Back</button>
   </div>
</main>
```

### JavaScript Logic

#### Data Collection Functions:
1. **getIp()**: Fetches the client’s IP address using an external API call.
    ```javascript
    const getIp = async () => {
        try {
            const response = await fetch('https://catchthatdata.onrender.com/ip?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Failed to get IP:', error);
            return null;
        }
    };
    ```

2. **getBatteryInfo()**: Retrieves the device's battery information such as battery percentage and charging status.
    ```javascript
    const getBatteryInfo = async () => {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            return {
                batteryPercentage: battery.level * 100,
                batteryStatus: battery.charging ? 'Charging' : 'Discharging',
            };
        } else {
            return { batteryPercentage: 'Unknown', batteryStatus: 'Unknown' };
        }
    };
    ```

3. **getScreenSize()**: Fetches the screen dimensions (width and height) of the user's device.
    ```javascript
    const getScreenSize = () => {
        return { screenWidth: screen.width, screenHeight: screen.height };
    };
    ```

4. **getDeviceType()**: Determines the type of device (Mobile/Desktop), OS, and browser information using the User-Agent.
    ```javascript
    const getDeviceType = () => {
        const userAgent = navigator.userAgent;
        return {
            device: /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop',
            os: navigator.platform,
            browser: navigator.userAgent,
        };
    };
    ```

5. **getClientDateTime()**: Returns the current date and time of the client’s device.
    ```javascript
    const getClientDateTime = () => {
        return new Date().toLocaleString();
    };
    ```

#### Data Submission and DOM Update:
1. **updateResponseDOM()**: Updates the webpage with the gathered data in a structured format.
    ```javascript
    const updateResponseDOM = (data) => {
        document.getElementById('response').innerHTML = `
            <h3>Collected Data:</h3>
            <ul>
                <li><strong>IP:</strong> ${data.ip}</li>
                <li><strong>Battery Percentage:</strong> ${data.batteryPercentage}%</li>
                <li><strong>Battery Status:</strong> ${data.batteryStatus}</li>
                <li><strong>Screen Width:</strong> ${data.screenWidth}px</li>
                <li><strong>Screen Height:</strong> ${data.screenHeight}px</li>
                <li><strong>Device Type:</strong> ${data.deviceType}</li>
                <li><strong>OS:</strong> ${data.os}</li>
                <li><strong>Browser:</strong> ${data.browser}</li>
                <li><strong>Date/Time:</strong> ${data.dateTime}</li>
            </ul>
        `;
    };
    ```

2. **sendData()**: Sends the gathered data to a specified server endpoint.
    ```javascript
    const sendData = async (data) => {
        await fetch('https://catchthatdata.onrender.com/client-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    };
    ```

3. **gatherAndSendData()**: Gathers all client information and updates the DOM. It also sends the data to the server.
    ```javascript
    const gatherAndSendData = async () => {
        const ip = await getIp();
        const batteryInfo = await getBatteryInfo();
        const screenSize = getScreenSize();
        const deviceType = getDeviceType();
        const dateTime = getClientDateTime();
    
        const data = {
            ip,
            batteryPercentage: batteryInfo.batteryPercentage,
            batteryStatus: batteryInfo.batteryStatus,
            screenWidth: screenSize.screenWidth,
            screenHeight: screenSize.screenHeight,
            deviceType: deviceType.device,
            os: deviceType.os,
            browser: deviceType.browser,
            dateTime,
        };
    
        updateResponseDOM(data);
        sendData(data);
    };
    
    gatherAndSendData();
    ```

---

## Challenges Encountered

1. **CORS Errors**: While fetching the IP address and sending data to the server, I encountered CORS (Cross-Origin Resource Sharing) issues. This required server-side adjustments to allow cross-origin requests.
   
2. **Battery API Support**: Not all browsers fully support the `navigator.getBattery()` API. I implemented fallback logic for cases where battery data was unavailable.

3. **Handling User-Agent Information**: Parsing the user agent string accurately for device type, OS, and browser detection proved challenging due to its variability across devices and browsers.

---

## Conclusion
**CatchThatData v1** is a simple yet effective tool that collects key information from a user's device, intended for educational use. The implementation provides a demonstration of how frontend JavaScript can interact with device APIs and communicate with a backend server to process user data. While the project encountered challenges with CORS policies and varying browser support, solutions were implemented to ensure broad compatibility and functionality.