// API URLs and Key
const countryApiUrl = 'https://restcountries.com/v3.1/all'; // To fetch all countries
const cityApiUrl = 'https://countriesnow.space/api/v0.1/countries/cities'; // Better API for fetching cities
const weatherApiKey = '911f151be0a5539b978c27e124264ad0'; // Replace this with your actual OpenWeatherMap API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather/';

// HTML Elements
const countrySelect = document.getElementById('country-select');
const citySelect = document.getElementById('city-select'); 
const searchButton = document.getElementById('search-button');
const countrySearch = document.getElementById('country-search');
const currentWeatherButton = document.getElementById('current-weather-button');
const backgroundImage = document.body;

// Function to populate countries
const populateCountries = async () => {
    try {
        const response = await fetch(countryApiUrl);
        const countries = await response.json();

        countrySelect.innerHTML = '<option value="">Select a country</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
};

// Function to populate cities based on selected country
const populateCities = async (countryName) => {
    if (!countryName) return;

    try {
        const response = await fetch(cityApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country: countryName })
        });

        const data = await response.json();
        const cities = data.data || [];

        citySelect.innerHTML = '<option value="">Select a city</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

// Function to fetch weather data and change background image
const fetchWeather = async (cityName) => {
    try {
        const url = `${weatherApiUrl}?q=${cityName}&appid=${weatherApiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('current-location').textContent = `Location: ${data.name}`;
            document.getElementById('current-temp').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('current-description').textContent = `Description: ${data.weather[0].description}`;
            document.getElementById('current-weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            // Change background image based on weather
            changeBackgroundImage(data.weather[0].main);
        } else {
            console.error('Error fetching weather:', data);
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
};

// Function to change background image based on weather condition
const changeBackgroundImage = (weatherCondition) => {
    let imageUrl = '';

    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            imageUrl = 'https://source.unsplash.com/1600x900/?clear-sky';
            break;
        case 'clouds':
            imageUrl = 'https://source.unsplash.com/1600x900/?cloudy';
            break;
        case 'rain':
            imageUrl = 'https://source.unsplash.com/1600x900/?rain';
            break;
        case 'snow':
            imageUrl = 'https://source.unsplash.com/1600x900/?snow';
            break;
        case 'thunderstorm':
            imageUrl = 'https://source.unsplash.com/1600x900/?thunderstorm';
            break;
        case 'drizzle':
            imageUrl = 'https://source.unsplash.com/1600x900/?drizzle';
            break;
        case 'mist':
        case 'fog':
            imageUrl = 'https://source.unsplash.com/1600x900/?fog';
            break;
        default:
            imageUrl = 'https://source.unsplash.com/1600x900/?weather';
            break;
    }

    backgroundImage.style.backgroundImage = `url(${imageUrl})`;
};

// Event listeners
countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;
    populateCities(selectedCountry);
});

searchButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    if (selectedCity) {
        fetchWeather(selectedCity);
    }
});

currentWeatherButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

countrySearch.addEventListener('input', () => {
    const query = countrySearch.value.toLowerCase();
    const options = countrySelect.querySelectorAll('option');

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(query)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
});

// Initial population of countries
populateCountries();
