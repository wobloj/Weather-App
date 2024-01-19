let searchingQuery = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

let currLocation = document.getElementById("location");
let currTemp = document.getElementById("temperature");
let currTempFellslike = document.getElementById("temperature-feelslike");
let currCloud = document.getElementById("cloud");
let currWind = document.getElementById("wind");
let currHumidity = document.getElementById("humidity");
let currCondition = document.getElementById("condition");
let currWeatherIcon = document.getElementById("weather_icon")


async function loadWeatherData(location){
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}&lang=pl`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2c319d3103msh1390d1fcb76c01ep105b1bjsn65e39beb8989',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        setWeatherData(location, result.current.temp_c, result.current.feelslike_c, result.current.cloud, result.current.wind_kph, result.current.wind_dir, result.current.humidity, result.current.condition.text, result.current.condition.icon);
    } catch (error) {
        currTemp.innerHTML="Nie znaleziono lokalizacji"
        console.error(error);
    }
}

function setWeatherData(location, temp_c, feelslike_c, cloud, wind, wind_dir, humidity, condition, icon){
    currLocation.innerHTML = location;
    currCondition.innerHTML = condition
    currTemp.innerHTML = `${temp_c}&degC`;
    currTempFellslike.innerHTML = `Odczuwalna: <span  class="bold">${feelslike_c} &degC</span>`;
    currCloud.innerHTML = `Zachmurzenie: <span class="bold">${cloud} %</span>`;
    currWind. innerHTML = `Wiatr: <span class="bold">${wind} km/h w kierunku ${wind_dir}</span>`
    currHumidity.innerHTML = `Wilgotność: <span class="bold">${humidity}%</span>`
    currWeatherIcon.src = `${icon}`
    searchingQuery.value = ''
}

searchButton.addEventListener("click", () =>{
    loadWeatherData(searchingQuery.value)
})