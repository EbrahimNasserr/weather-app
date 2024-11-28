var hamburger = document.querySelector('.hamburger');
var navLinks = document.querySelector('.nav-links');
var closeBtn = document.querySelector('.close-btn');
var searchCity = document.querySelector("#searchCity");
var searchCityValue = ""
var daysBtn = Array.from(document.querySelectorAll(".days-btn"))
var WeatherData = []
var daysValue = 3;
var defaultCity = "cairo";
var userLocation = null;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
});

for (var i = 0; i < daysBtn.length; i++) {
    daysBtn[i].addEventListener("click", function (e) {
        daysBtn.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        daysValue = Number(e.target.value);
        console.log(daysValue);
        if (searchCityValue) {
            fetchWeatherData(searchCityValue);
        } else {
            fetchWeatherData(searchCity.value);
        }
    });
}

async function fetchWeatherData(city) {
    try {
        var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ba92547625d14a76912105447242711&q=${city}&days=${daysValue}`);
        var data = await response.json();
        WeatherData.push(data);
        console.log(WeatherData);
        displayWeatherData();

    } catch (error) {
        console.log(error);
    }
}

function displayWeatherData() {
    var cartona = ""
    var forecast = WeatherData[WeatherData.length - 1].forecast.forecastday;

    for (var i = 0; i < forecast.length; i++) {
        var dateObj = new Date(forecast[i].date);
        var dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        var monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
        var dayOfMonth = dateObj.getDate();
        var formattedDate = `${dayName}, ${monthName} ${dayOfMonth}`;
        searchCity.value = WeatherData[WeatherData.length - 1].location.name ;
        cartona += `<div class="weather-card ${i % 2 === 0 ? '' : 'even-card'} ${i === 0 ? 'first-card' : ''} ${i === forecast.length - 1 ? 'last-card' : ''}">
                    <div class="weather-card-header">
                        <h2>${forecast[i].date}</h2>
                        <p class="date">${formattedDate}</p>
                    </div>
                    <h3>${WeatherData[WeatherData.length - 1].location.name}</h3>
                    <div class="temp">${forecast[i].day.avgtemp_c}°C</div>
                    <img src="${forecast[i].day.condition.icon}" alt="Partly Cloudy" class="weather-icon">
                    <p class="condition">${forecast[i].day.condition.text}</p>
                    <div class="details">
                        <p>🌧️ ${forecast[i].day.daily_chance_of_rain}%</p>
                        <p>💨 ${forecast[i].day.maxwind_kph} km/h</p>
                        <p>➡️ ${forecast[i].day.maxwind_dir}</p>
                    </div>
                </div>`
    }
    document.querySelector(".weather-container").innerHTML = cartona;
}

searchCity.addEventListener("input", function () {
    searchCityValue = searchCity.value;
    if (searchCityValue.length > 3) {
        fetchWeatherData(searchCityValue);
    }
})

function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                userLocation = `${latitude},${longitude}`;
                await fetchWeatherData(userLocation);
            },
            function (error) {
                console.log("Geolocation error:", error);
                fetchWeatherData(defaultCity);
            }
        );
    } else {
        console.log("Geolocation is not supported");
        fetchWeatherData(defaultCity);
    }
}

getUserLocation();