(async function () {
    // Function to get client IP (via an external API)
    const getIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org/?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error getting IP:', error);
        return null;
      }
    };
  
    // Function to get battery information
    const getBatteryInfo = async () => {
      if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return {
          batteryPercentage: battery.level * 100,
          batteryStatus: battery.charging ? 'Charging' : 'Discharging',
        };
      }
      return { batteryPercentage: null, batteryStatus: null };
    };
  
    // Function to get screen size
    const getScreenSize = () => ({
      screenWidth: screen.width,
      screenHeight: screen.height,
    });
  
    // Function to detect device type, OS, and browser
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      let deviceType = 'Unknown Device';
      let os = 'Unknown OS';
      let browser = 'Unknown Browser';
  
      // Detect device type
      if (/mobile|android|touch|webos|hpwos/i.test(userAgent)) {
        deviceType = 'Mobile';
      } else if (/tablet|ipad/i.test(userAgent)) {
        deviceType = 'Tablet';
      } else {
        deviceType = 'Desktop';
      }
  
      // Detect OS
      if (userAgent.indexOf('windows') > -1) os = 'Windows';
      else if (userAgent.indexOf('mac') > -1) os = 'MacOS';
      else if (userAgent.indexOf('linux') > -1) os = 'Linux';
      else if (userAgent.indexOf('android') > -1) os = 'Android';
      else if (userAgent.indexOf('iphone') > -1) os = 'iOS';
  
      // Detect browser
      if (userAgent.indexOf('chrome') > -1) browser = 'Chrome';
      else if (userAgent.indexOf('safari') > -1) browser = 'Safari';
      else if (userAgent.indexOf('firefox') > -1) browser = 'Firefox';
      else if (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1)
        browser = 'Internet Explorer';
  
      return { deviceType, os, browser };
    };
  
    // Get client date/time
    const getClientDateTime = () => new Date().toLocaleString();
  
    // Function to send the data to the developer's backend
    const sendDataToBackend = async (endpoint) => {
      const ip = await getIp();
      const batteryInfo = await getBatteryInfo();
      const screenSize = getScreenSize();
      const deviceInfo = getDeviceInfo();
      const dateTime = getClientDateTime();
  
      const data = {
        ip,
        batteryPercentage: batteryInfo.batteryPercentage,
        batteryStatus: batteryInfo.batteryStatus,
        screenWidth: screenSize.screenWidth,
        screenHeight: screenSize.screenHeight,
        deviceType: deviceInfo.deviceType,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        dateTime,
      };
  
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        console.log('Client data sent successfully:', data);
      } catch (error) {
        console.error('Error sending client data:', error);
      }
    };
  
    // Expose the script as a global function
    window.clientInfoTracker = function (config) {
      if (!config || !config.endpoint) {
        console.error('Endpoint URL is required.');
        return;
      }
  
      // Send client data to the provided endpoint
      sendDataToBackend(config.endpoint);
    };
  })();
  