let now = new Date();
const cityPlace = document.querySelector("#search_city");
const apiDomain = "https://api.openweathermap.org";
const api = "baa17103f06129d63a6c32b2406b94ba";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const day = days[now.getDay()];
const number = now.getDate();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const month = months[now.getMonth()];
let hour = now.getHours();

if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
const date = document.querySelector("#date");
date.innerHTML = `${day}, ${number}/${month},  ${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);

  return getDayNameByDate(date);
}

function getDayNameByDate(date) {
  return date.toDateString().split(" ")[0];
}

if (hour <= 18 && hour >= 7) {
  document.getElementById("background").style.backgroundImage =
    "url(https://i.pinimg.com/originals/32/81/09/3281093ab45ded7b7ad91ac591ed0854.jpg)";
} else {
  document.getElementById("background").style.backgroundImage =
    "url(https://ak6.picdn.net/shutterstock/videos/21933226/thumb/1.jpg)";
  document.getElementById("title").style.color = "#000000";
  document.getElementById("search_city").style.color = "#000000";
}

function search($event) {
  $event.preventDefault();
  const search_city = document.querySelector("#search_city");
  search_city.innerHTML = `${city.value}`;
}

const form = document.querySelector("#search-form");
form.addEventListener("submit", search);

const degrees = document.querySelector(".current_degree_val");
const CELCIUS_DEGREE = 29;
const FAR_DEGRE = convertToFar(CELCIUS_DEGREE);
const CELCIUS = "celcius";
const FAHRENHEIT = "fahrenheit";
const fahrenheit = document.querySelector(`.${FAHRENHEIT}`);
const celcius = document.querySelector(`.${CELCIUS}`);

function convertToFar(celsDegree) {
  return Math.round((celsDegree * 9) / 5 + 32);
}

function showDegree($event) {
  $event.preventDefault();
  degrees.innerHTML =
    CELCIUS === $event.currentTarget.className ? CELCIUS_DEGREE : FAR_DEGRE;
}

fahrenheit.addEventListener("click", showDegree);
celcius.addEventListener("click", showDegree);

document.addEventListener("DOMContentLoaded", ($event) => {
  degrees.innerHTML = CELCIUS_DEGREE;
});

function showWeather(response) {
  const cityTemp = document.querySelector(".current_degree_val");
  const mainTempVal = response.data.main.temp;
  cityPlace.innerHTML = response.data.name;
  const degree = Math.round(mainTempVal);
  cityTemp.innerHTML = `${degree}`;
  const plusMinus = document.querySelector("#plusMinus");
  if (mainTempVal > 0) {
    plusMinus.innerHTML = `+`;
  } else {
    plusMinus.innerHTML = `-`;
  }
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weatherDescription").innerHTML =
    response.data.weather[0].description;

  showIcon(response.data.weather[0].icon);

  getForecast({
    lat: response.data.coord.lat,
    long: response.data.coord.lon,
  });
}

function searchCity(event) {
  const input = document.querySelector("#city");
  const city = input.value;
  cityPlace.innerHTML = city;
  const url = `${apiDomain}/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
  axios.get(url).then(showWeather);
}

function showIcon(iconCode) {
  const wheatherIcon = document.getElementById("weatherIcon");
  wheatherIcon.src = `${apiDomain}/img/w/${iconCode}.png`;
  wheatherIcon.hidden = false;
}

const inputForm = document.querySelector("form");
form.addEventListener("submit", searchCity);

function getPosition(response) {
  let lat = response.coords.latitude;
  let long = response.coords.longitude;
  let urlPosition = `${apiDomain}/data/2.5/weather?lat=${lat}&lon=${long}&appid=baa17103f06129d63a6c32b2406b94ba&units=metric`;
  axios.get(urlPosition).then(showWeather);

  getForecast({
    lat: response.coords.latitude,
    long: response.coords.longitude,
  });
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}
const locatorButton = document.querySelector("#locator");
locatorButton.addEventListener("click", getCurrentLocation);

function displayForecast(response) {
  const data = response.data.daily;
  const forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  data.forEach((day, index) => {
    const icon = day?.weather[0].icon;
    const temp = day?.temp.day ?? "-";
    if (index > 0 && index < 7) {
      forecastHTML += ` 
      <div class="col-sm">
        <ul>
          <li>${formatDay(day.dt)}</li>
          <li class="emoji">
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="" width="42" />
          </li>
          <li>
            <b>${Math.round(temp)} &#8451;</b>
          </li>
        </ul>
      </div>
     `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// PROBLEM PART

function getForecast(coordinates) {
  let apiKey = "baa17103f06129d63a6c32b2406b94ba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.long}&exclude={part}&appid=baa17103f06129d63a6c32b2406b94ba&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

window.addEventListener("load", (event) => {
  navigator.geolocation.getCurrentPosition(getPosition);
});
