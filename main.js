// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

    //create map//
	createMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 3,
		});
        // tile & zoom//
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '9',

		}).addTo(this.map)
        //User marker//
		const userMarker = L.marker(this.coordinates)
		userMarker
        //Adds pop up message to show users location//
		.addTo(this.map)
		.bindPopup('<p1><b>Here you are!</b><br></p1>')
		.openPopup()
	},

    //business markers//
	bizMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

//Current position//
async function getCoords(){
	const startPos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [startPos.coords.latitude, startPos.coords.longitude]
}

//Foursquare//
async function getData(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3GfLjfu97/4L4PL/Xti/VY+a1tK1lhjz/6fvcdTcRk88='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// process foursquare 
function processData(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}
//4sq details//
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'fsq3GfLjfu97/4L4PL/Xti/VY+a1tK1lhjz/6fvcdTcRk88='
    }
  };
  
  fetch('https://api.foursquare.com/v3/places/{fsq_id}?fields=name%2Cdescription%2Ctel%2Crating', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));




// event handlers
// window load

window.onload = async function() {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.createMap()
}
// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getData(business)
	myMap.businesses = processData(data)
	myMap.bizMarkers()
})


/*
window.onload = function() {
    let startPos;
    let geoOptions = {
       timeout: 10 * 1000
    }
  
    let geoSuccess = function(position) {
      startPos = position;
      document.getElementById('startLat').innerHTML = startPos.coords.latitude;
      document.getElementById('startLon').innerHTML = startPos.coords.longitude;
    };
    let geoError = function(error) {
      console.log('Error occurred. Error code: ' + error.code);
    };
  
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  };
  */