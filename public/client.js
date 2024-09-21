const getIp = async () => {
  return new Promise((resolve, reject) => {
    try {
      const rtc = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      });
      rtc.createDataChannel('');

      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
          if (ipMatch) {
            resolve(ipMatch[1]);
            rtc.close(); // Close the connection once we have the IP
          }
        }
      };

      rtc.createOffer().then((offer) => {
        rtc.setLocalDescription(offer);
      }).catch(reject);
    } catch (error) {
      reject('Failed to get IP');
    }
  });
};


const getBatteryInfo = async () => {
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      return {
        batteryPercentage: battery.level * 100,
        batteryStatus: battery.charging ? 'Charging' : 'Discharging',
      };
    } catch (error) {
      console.warn('Battery API error:', error);
      return { batteryPercentage: 'Unknown', batteryStatus: 'Unknown' };
    }
  } else {
    return { batteryPercentage: 'Unknown', batteryStatus: 'Unknown' };
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
