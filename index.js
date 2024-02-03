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

const infoBox = document.getElementById('info-box')

let isAnimationEnd = true;

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
        favouriteLocationTemp = location;
        document.title = location;
        favicon.href = result.current.condition.icon;
        favouriteButton.style.display = "block"
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

function existInFavourite(storage, location) {
    if (location !== undefined && location !== '') {
        for (let key in storage) {
            if (storage.hasOwnProperty(key) && localStorage.getItem(key) === location) {
                return true;
            }
            displayInfo("exist", location)
        }
        
        return false;
    }
    return false;
}

function addToFavourite(location){
    if(existInFavourite(localStorage, location) === false){
        let id = uuidv4();
        displayInfo("add", location)            
        localStorage.setItem(id, location);
        loadTable()
    }
}

function deleteFromFavourite(value){
    displayInfo("delete", localStorage.getItem(value))
    localStorage.removeItem(value)
    loadTable()
}

function loadTable(){
    favouriteTable.innerHTML = ''

    Object.keys(localStorage).forEach(key =>{
        favouriteTable.innerHTML += 
        `
        <tr>
            <td id="delete" onclick="deleteFromFavourite('${key}')"><i class="fa-regular fa-trash-can"></i></td>
            <td id="fav" class="select-fav" onclick="loadWeatherData('${localStorage.getItem(key)}')">${localStorage.getItem(key)}</td>
        </tr>
        `
    })
}

function animationPopOut(){
    if(isAnimationEnd){
        isAnimationEnd = false
        infoBox.classList.add("anim-in");
        setTimeout(() => {
            infoBox.classList.remove("anim-in");
            infoBox.classList.add("anim-out");
        }, 3000);
        infoBox.classList.remove("anim-out");
    }else{
        return;
    }
    
    infoBox.addEventListener("animationend" , () =>{
        isAnimationEnd = true;
    });
}

function displayInfo(type, location){
    switch (type) {
        case "delete":
            infoBox.innerHTML = `<p>Lokacja <span style="color: rgb(255, 106, 106);">${location}</span>, została usunięta z ulubionych</p>`
            animationPopOut()
            break;

        case "add":
            infoBox.innerHTML = `<p>Lokacja <span style="color: rgb(145, 252, 172);">${location}</span>, została dodana do ulubionych</p>`
            animationPopOut()
            break;

        case "exist":
            infoBox.innerHTML = `<p>Lokacja <span style="color: rgb(252, 241, 145);">${location}</span>, już jest dodana w twoich ulubionych</p>`
            animationPopOut()
            break;
        
        default:
            
            break;
    }
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

favouriteButton.addEventListener("click", ()=>{
    addToFavourite(favouriteLocationTemp)
})

searchButton.addEventListener("click", () =>{
    loadWeatherData(searchingQuery.value)
})
