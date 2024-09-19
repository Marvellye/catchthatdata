// Get client IP (via API)
const getIp = async () => {
  const response = await fetch('https://api.ipify.org/?format=json');
  const data = await response.json();
  return data.ip;
};

// Get battery information
const getBatteryInfo = async () => {
  if (navigator.getBattery) {
    return navigator.getBattery().then((battery) => {
      return {
        batteryPercentage: battery.level * 100,
        batteryStatus: battery.charging ? 'Charging' : 'Discharging',
      };
    });
  } else {
    return {
      batteryPercentage: 'Unknown',
      batteryStatus: 'Unknown',
    };
  }
};

// Get device screen size
const getScreenSize = () => {
  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
  };
};

// Get device type, OS, and browser from UserAgent
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  return {
    device: /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop',
    os: navigator.platform,
    browser: navigator.userAgent,
  };
};

// Get client date/time
const getClientDateTime = () => {
  return new Date();
};

// Send data to server
const sendData = async () => {
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
    dateTime: dateTime.toLocaleString(),
  };

  console.log('Sending the following data to the server:', data);

  fetch('https://catchthatdata.onrender.com/client-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server response:', data);
    })
    .catch((error) => {
      console.error('Error while sending data:', error);
    });
};

sendData();
