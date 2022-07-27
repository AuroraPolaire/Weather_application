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
  console.log(response);
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

  showIcon(response.data.weather[0].icon);
}

function searchCity(event) {
  event.preventDefault();
  const input = document.querySelector("#city");
  const city = input.value;
  // const cityPlace = document.querySelector("#search_city");
  cityPlace.innerHTML = city;
  const url = `${apiDomain}/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
  console.log(url);
  axios.get(url).then(showWeather);
}

function showIcon(iconCode) {
  console.log("Iconcode", iconCode);
  const wheatherIcon = document.getElementById("weatherIcon");
  wheatherIcon.src = `${apiDomain}/img/w/${iconCode}.png`;
  wheatherIcon.hidden = false;
}

const inputForm = document.querySelector("form");
form.addEventListener("submit", searchCity);

function getPosition(response) {
  console.log(response);
  let lat = response.coords.latitude;
  let long = response.coords.longitude;
  let urlPosition = `${apiDomain}/data/2.5/weather?lat=${lat}&lon=${long}&appid=baa17103f06129d63a6c32b2406b94ba&units=metric`;

  axios.get(urlPosition).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}
let locatorButton = document.querySelector("#locator");
locatorButton.addEventListener("click", getCurrentLocation);

window.addEventListener("load", (event) => {
  navigator.geolocation.getCurrentPosition(getPosition);
});
