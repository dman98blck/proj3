const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');
let unit = 'metric';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

celsiusBtn.addEventListener('click', () => {
    unit = 'metric';
    celsiusBtn.classList.add('active');
    fahrenheitBtn.classList.remove('active');
    if (cityName.textContent) {
        getWeather(cityName.textContent);
    }
});

fahrenheitBtn.addEventListener('click', () => {
    unit = 'imperial';
    celsiusBtn.classList.remove('active');
    fahrenheitBtn.classList.add('active');
    if (cityName.textContent) {
        getWeather(cityName.textContent);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === '404') {
            alert('City not found');
            return;
        }
        displayCurrentWeather(data);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayCurrentWeather(data) {
    weatherDisplay.style.display = 'block';
    cityName.textContent = data.name;
    currentWeather.innerHTML = `
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = item.main.temp;
        const description = item.weather[0].description;
        forecast.innerHTML += `
            <div class="forecast-item">
                <p>${day}</p>
                <p>${description}</p>
                <p>${temp}°</p>
            </div>
        `;
    }
}
