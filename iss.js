/* ----------------------------------------------------------------------- */

const request = require('request');

const fetchMyIP = function(callback) {

  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
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
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
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

const fetchISSFlyOverTimes = (coords, callback) => {

  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).response;

    callback(null, data);

  });

};

/* ----------------------------------------------------------------------- */


const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchCoordsByIP('207.6.119.134', (error, coords) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes({ latitude: 48.4284207, longitude: -123.3656444 }, (error, coords) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }

        callback(null, coords);
      });
    });
  });
};

/* ----------------------------------------------------------------------- */


module.exports = { nextISSTimesForMyLocation };



