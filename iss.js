// It will contain most of the logic for fetching the data from each API endpoint.

/* ----------------------------------------------------------------------- */

const request = require('request');

const fetchMyIP = function(callback) {

  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) {
      callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
    
  });

};

/* ----------------------------------------------------------------------- */

const fetchCoordsByIP = (ip, callback) => {

  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    const data = {};
    data['latitude'] = parsedBody.latitude;
    data['longitude'] = parsedBody.longitude;
    
    callback(null, data);

  });
  
};

/* ----------------------------------------------------------------------- */





/* ----------------------------------------------------------------------- */

module.exports = { fetchMyIP, fetchCoordsByIP };



