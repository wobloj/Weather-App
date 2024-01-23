const searchingQuery = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const favicon = document.getElementById("favicon")

const currLocation = document.getElementById("location");
const currTemp = document.getElementById("temperature");
const currTempFellslike = document.getElementById("temperature-feelslike");
const currCloud = document.getElementById("cloud");
const currWind = document.getElementById("wind");
const currHumidity = document.getElementById("humidity");
const currCondition = document.getElementById("condition");
const currWeatherIcon = document.getElementById("weather_icon")

const favouriteButton = document.getElementById("add-to-favourite")
const deleteButton = document.getElementById("delete")
let favouriteLocationTemp;

const favouriteTable = document.getElementById("favourite-table")
const favTd = document.getElementById("fav")

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
        console.log(result);
        setWeatherData(location, result.current.temp_c, result.current.feelslike_c, result.current.cloud, result.current.wind_kph, result.current.wind_dir, result.current.humidity, result.current.condition.text, result.current.condition.icon);
        favouriteLocationTemp = location;
        document.title = location;
        favicon.href = result.current.condition.icon;
    } catch (error) {
        currTemp.innerHTML="Nie znaleziono lokalizacji"
        currLocation.innerHTML = '';
        currCondition.innerHTML = ''
        currTempFellslike.innerHTML = '';
        currCloud.innerHTML = '';
        currWind. innerHTML = ''
        currHumidity.innerHTML = ''
        currWeatherIcon.src = ''
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

function existInFavourite(storage, location){
    if(location != ''){
        for (let i = 0; i < storage.length; i++) {
            if(localStorage.getItem(i) == location){
                return true
            }
        }
    }
    return 
}

function addToFavourite(location){
    if(!existInFavourite(localStorage, location)){
        localStorage.setItem(localStorage.length, location);
        
    }
}

function deleteFromFavourite(value){
    console.log(value);
    localStorage.removeItem(value)
    location.reload(true)
}

function loadTable(){
    Object.keys(localStorage).forEach(key =>{
        favouriteTable.innerHTML += 
        `
        <tr>
            <td id="delete" onclick="deleteFromFavourite(${key})"><i class="fa-regular fa-trash-can"></i></td>
            <td id="fav" class="select-fav" onclick="loadWeatherData('${localStorage.getItem(key)}')">${localStorage.getItem(key)}</td>
        </tr>
        `
    })
}

function addToTable(id, location){
    favouriteTable.innerHTML += 
    `
    <tr>
        <td id="delete" onclick="deleteFromFavourite(${id})"><i class="fa-regular fa-trash-can"></i></td>
        <td id="fav" class="select-fav">${location}</td>
    </tr>
    `
}

favouriteButton.addEventListener("click", ()=>{
    addToFavourite(favouriteLocationTemp)
})

searchButton.addEventListener("click", () =>{
    loadWeatherData(searchingQuery.value)
})
