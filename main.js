const url = 'https://api.openweathermap.org/data/2.5/';
const key = '45f006a9f6651c2bd89393c3e1976b8c';

//values
let city = document.querySelector(".city");
let temp = document.querySelector(".temp");
let condition = document.querySelector(".condition");
let description = document.querySelector(".description");
let minmax = document.querySelector(".minmax");
let realFeel = document.querySelector(".real-feel");
let pressure = document.querySelector(".pressure");
let windSpeed = document.querySelector(".wind-speed");
let humidity = document.querySelector(".humidity");
let windDirection = document.querySelector(".wind-direction");
let responseTime = document.querySelector(".date-response")

//City name  input
const cityName = document.getElementById('cityName');
const cityBtn = document.getElementById('cityBtn');

cityBtn.addEventListener('click', () => requestApiForCityName(cityName.value))


function requestApiForCityName(name) {
    if (name.trim() != "") {
        fetch(`${url}weather?q=${name}&appid=${key}&units=metric&lang=en`)
            .then(respons => respons.json())
            .then(result => {
                if (result.cod == 200) {
                    resetValidationForCityName();
                    requestApiForCountryName(result);
                    getResponseDate();
                }
                else {
                    resetValidationForCityName();
                    resetValues();
                    getResponseDate();
                    validationForName.innerText = "City name not found";
                }
            })
    }
    else {
        resetValidationForCityName();
        resetValues();
        responseTime.innerText = "";
        validationForName.innerText = "Please write city name";
    }

}

function  requestApiForCountryName(info) {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${info.sys.country}`)
        .then(response => response.json())
        .then(result => weatherDetailsForCity(result, info));

}
function weatherDetailsForCity(result, info) {
    validationForName.innerText = "";

    city.innerText = `${info.name}, ${result[0].name.common}`
    temp.innerText = `${Math.round(info.main.temp)}°C`
    condition.innerText = `${info.weather[0].main}`
    description.innerText = `${info.weather[0].description}`
    minmax.innerText = `${Math.round(info.main.temp_min)}°C / ${Math.round(info.main.temp_max)}°C`
    realFeel.innerText = `${Math.round(info.main.feels_like)}°C`
    pressure.innerText = `${info.main.pressure * 100}  Pa`
    windSpeed.innerText = `${info.wind.speed} m/s`
    humidity.innerText = `${info.main.humidity}%`
    getDirection(info.wind.deg);
}



//Lat and Lon intputs
const corrBtn = document.getElementById('coordinantBtn');
const lat = document.getElementById('lat');
const lon = document.getElementById('lon');
corrBtn.addEventListener('click', () => requestApiForCoordinant(lat.value, lon.value));

function requestApiForCoordinant(value1, value2) {
    if (value1.trim() != "" && value2.trim() != "") {
        fetch(`${url}weather?lat=${value1}&lon=${value2}&appid=${key}&units=metric&lang=en`)
            .then(respons => respons.json())
            .then(result => {
                if (result.cod == 200) {
                    resetValidationForCorr();
                    weatherDetailsForCorr(result)
                    getResponseDate();
                }
                else {
                    resetValues();
                    resetValidationForCorr();
                    getResponseDate();
                    validationForCoor.innerText = "Coordinant not found"
                }
            })
    }
    else {
        resetValues();
        resetValidationForCorr();
        validationForCoor.innerText = "Please write lat and lot"
    }

}


function weatherDetailsForCorr(info) {
    if (info.sys.country) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${info.sys.country}`)
            .then(response => response.json())
            .then(result => getCountryNameForCorr(result, info));
    }
    else if (info.name != "") {
        city.innerText = `${info.name}, Country name not found`
    }
    else {
        city.innerText = "City name not found, Country name not found";
    }
    CoordinantAndCurrentInnerText(info)
}
function getCountryNameForCorr(result, info) {
    city.innerText = `${info.name}, ${result[0].name.common}`
}

//Current cordiant button

const locationBtn = document.getElementById('currentLoc');

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
    else {
        console.log("! ! !");
    }
})


function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetch(`${url}weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric&lang=en`)
        .then(respons => respons.json())
        .then(result => weatherDetailsForCurrentPosition(result))
    getResponseDate();
}

function onError(error) {
    resetValidationForCurrLocation();
    resetValues();
    validationForCurrLocation.innerText = error.message;
}

function weatherDetailsForCurrentPosition(info) {
    resetValidationForCurrLocation();
    if (info.sys.country) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${info.sys.country}`)
            .then(response => response.json())
            .then(result => getCountryNameForCurrentLocation(result, info));
    }
    else if (info.name != "") {
        city.innerText = `${info.name}, Country name not found`
    }
    else {
        city.innerText = "City name not found, Country name not found";
    }
    CoordinantAndCurrentInnerText(info);
}
function getCountryNameForCurrentLocation(result, info) {
    city.innerText = `${info.name}, ${result[0].name.common}`
}



//Get response date
function getResponseDate() {
    const utcStr = new Date();
    responseTime.innerText = utcStr.toLocaleTimeString();
}

//Coordinant and Current Cordinant values 
function CoordinantAndCurrentInnerText(info) {
    validationForCoor.innerText = "";
    validationForCurrLocation.innerText = "";

    temp.innerText = `${Math.round(info.main.temp)}°C`
    condition.innerText = `${info.weather[0].main}`
    description.innerText = `${info.weather[0].description}`
    minmax.innerText = `${Math.round(info.main.temp_min)}°C / ${Math.round(info.main.temp_max)}°C`
    realFeel.innerText = `${Math.round(info.main.feels_like)}°C`
    pressure.innerText = `${info.main.pressure * 100}  Pa`
    windSpeed.innerText = `${info.wind.speed} m/s`
    humidity.innerText = `${info.main.humidity}%`
    getDirection(info.wind.deg);
}


//Validations
const validationForName = document.querySelector('.validationForName')
const validationForCoor = document.querySelector('.validationForCoor');
const validationForCurrLocation = document.querySelector(".validationForCurrentLocation");

function resetValidationForCityName() {
    lat.value = "";
    lon.value = "";
    validationForCoor.innerText = "";
    validationForCurrLocation.innerText = "";
}
function resetValidationForCurrLocation() {
    lat.value = "";
    lon.value = "";
    cityName.value = "";
    validationForCoor.innerText = "";
    validationForName.innerText = "";
}

function resetValidationForCorr() {
    cityName.value = '';
    validationForName.innerText = "";
    validationForCurrLocation.innerText = "";
}

//Reset all values
function resetValues() {
    city.innerText = "";
    temp.innerText = "";
    condition.innerText = "";
    description.innerText = "";
    minmax.innerText = "";
    realFeel.innerText = "";
    pressure.innerText = "";
    windSpeed.innerText = "";
    humidity.innerText = "";
    windDirection.innerText = "";
}

//Wind Direction
function getDirection(degree) {
    if (degree == 0 || degree == 360) {
        windDirection.innerText = "North";
    }
    else if (degree > 0 && degree < 45) {
        windDirection.innerText = "NNE";
    }
    if (degree == 45) {
        windDirection.innerText = "NE";
    }
    if (degree > 45 && degree < 90) {
        windDirection.innerText = "ENE";
    }
    if (degree == 90) {
        windDirection.innerText = "East";
    }
    if (degree > 90 && degree < 135) {
        windDirection.innerText = "ESE";
    }
    if (degree == 135) {
        windDirection.innerText = "SE";
    }
    if (degree > 135 && degree < 180) {
        windDirection.innerHTML = "SSE";
    }
    if (degree == 180) {
        windDirection.innerText = "South";
    }
    if (degree > 180 && degree < 225) {
        windDirection.innerText = "SSW";
    }
    if (degree == 225) {
        windDirection.innerText = "SW";
    }
    if (degree > 225 && degree < 270) {
        windDirection.innerText = "WSW";
    }
    if (degree == 270) {
        windDirection.innerText = "West";
    }
    if (degree > 270 && degree < 315) {
        windDirection.innerText = "WNW";
    }
    if (degree == 315) {
        windDirection.innerText = "NW";
    }
    if (degree > 315 && degree < 360) {
        windDirection.innerText = "NNW";
    }
}




