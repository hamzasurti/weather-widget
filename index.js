// creates a promise that makes the first reqquest
const promise = new Promise( function (resolve, reject) {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://weathersync.herokuapp.com/ip', true);

  request.onload = function() {
    // if 200 status code, resolves promise and passes necessary JSOn data
    if (request.status >= 200 && request.status < 400) {
      const locationData = JSON.parse(request.responseText);
      resolve(locationData);
    } else {
      throw 'reached endpoint but there was a problem';
    }
  };

// errors if there was a problem with request
  request.onerror = function() {
    throw 'There was a connection error of some sort';
  };

  request.send();
});

// second request
promise.then(function(result){
  const latitude = result.location.latitude;
  const longitude = result.location.longitude;

  const request = new XMLHttpRequest();
  request.open('GET', `https://weathersync.herokuapp.com/weather/${latitude},${longitude}`, true);

  request.onload = function() {
    // if 200 status code, resolves promise and passes necessary JSOn data
    if (request.status >= 200 && request.status < 400) {
      const weatherData = JSON.parse(request.responseText);

      cityName(weatherData);
      temp(weatherData);
      img(weatherData);
      description(weatherData);

    } else {
      throw 'reached second server but there was a problem';
    }
  };

  request.onerror = function() {
    throw 'There was a connection error of some sort at second server';
  };

  request.send();
})

function cityName(weatherData) {
  // updates city name
  let name = document.getElementById('city-name');
  name.innerHTML = weatherData.name;
}

function temp(weatherData) {
  // updates temperature based on location
  let temperature = document.getElementById('temperature');
  // convert from kelvin to farenheight or celcius
  let tempKelvin = weatherData.main.temp;
  if (weatherData.sys.country === 'US') {
    temperature.innerHTML = `${Math.round(tempKelvin*(9/5)-459.67)}&deg;F`;
  } else {
    temperature.innerHTML = `${Math.round(tempKelvin- 273.15)}&deg;C`;
  }
}

function img(weatherData) {
  // updates image with png from open weather map
  let image = document.getElementById('image');
  image.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
}

function description(weatherData) {
  // changes weather description
  let weather = document.getElementById('weather');
  weather.innerHTML = weatherData.weather[0].description;
}
