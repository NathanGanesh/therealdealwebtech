// JWT token string with header, payload and signature

let sessionToken;
let requestText;
let requestStatusCode;
// send HTTP request, possibly with JSON body, and invoke callback when JSON response body arrives
const searchbar = document.getElementsByClassName("search-container")[0];


export function sendJSON({ method, url, body }, callback) {
	const xhr = new XMLHttpRequest();
	xhr.addEventListener('load', () => {
		if (xhr.status === 200) {
			callback(undefined, JSON.parse(xhr.responseText));
		} else {
			requestText = (xhr.responseText);
			requestStatusCode = xhr.status;
			callback(new Error(xhr.responseText));
		}
	});
	xhr.open(method, url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	let token2 = localStorage.getItem('token');
	if ( token2!== undefined) {
		xhr.setRequestHeader('Authorization', `Bearer ${token2}`);
	}
	xhr.send(body !== undefined ? JSON.stringify(body) : undefined);
}

export function saveToken(token) {
	sessionToken = token;
	localStorage.setItem('token', token);
}

export function getRequestText() {
	return requestText;
}
export function getRequestStatus() {
	return requestStatusCode;
}

export function resetToken() {
	// clear token when users logs out
	window.location.href = 'login.html';
	sessionToken = undefined;
	localStorage.removeItem('token');
}

export function getTokenPayload() {
	let jsonLocalStorageToken = localStorage.getItem('token');
	if (jsonLocalStorageToken) {
		// extract JSON payload from token string
		return JSON.parse(atob(jsonLocalStorageToken.split('.')[1]));
	}
	return undefined;
}

// utility functions adds/removes CSS class 'bad' upon validation
export function validateInputControl(element, ok) {
	if (ok) {
		element.classList.remove('bad');
	} else {
		element.classList.add('bad');
	}
}

//extractpayloadfromtoken

export function search(){

}

function populateFilters() {
	let items;
	sendJSON({
				 method: 'get',
				 url: '/auction'
			 }, (err, resp) => {
		// if err is undefined, the send operation was a success
		if (!err) {
			items = (resp.auctionItems);
			priceSlider(items);
			locationDropDown2(items);

		} else {
			console.log(err);
		}
	});

}


function locationDropDown2(items) {
	let locationsSet = new Set();
	let techniqueSet = new Set();
	items.map(item =>{
		locationsSet.add(item.location)
		techniqueSet.add(item.technique);
	})
	let locationDropDown = document.createElement('select');
	let techniqueDropDown = document.createElement('select');
	let locationLabel = document.createElement('label');
	locationLabel.innerHTML += "locations: "
	let techniqueLabel = document.createElement('label');
	techniqueLabel.innerHTML += "technique's: "


	locationsSet.forEach(e =>{
		let option = document.createElement('option');
		option.value = e;
		option.innerHTML = e;
		locationDropDown.append(option);
	})

	let option = document.createElement('option');
	option.value = "";
	option.innerHTML = "";
	locationDropDown.append(option);

	techniqueSet.forEach(e =>{
		let option = document.createElement('option');
		option.value = e;
		option.innerHTML = e;
		techniqueDropDown.append(option);
	})

	let option2 = document.createElement('option');
	option2.value = "";
	option2.innerHTML = "";
	techniqueDropDown.append(option2);

	let brTag = document.createElement('div');
	brTag.innerHTML = "<br>"

	locationLabel.append(locationDropDown);
	techniqueLabel.append(techniqueDropDown);


	searchbar.append(techniqueLabel)
	searchbar.append(brTag)
	searchbar.append(locationLabel)
}

function priceSlider(items) {
	let min = items[0].bids[items[0].bids.length-1].amount;
	let max = items[0].bids[items[0].bids.length-1].amount;
	let priceSlider = document.createElement('div');
	let inputSliderItem = document.createElement('input');
	let labelSliderItem = document.createElement('label');
	labelSliderItem.id = "range_price";
	inputSliderItem.id = "range_price";
	inputSliderItem.type ="range"
	items.map(item =>{
		let itemAmount = item.bids[item.bids.length-1].amount;
		min = (itemAmount<min)? itemAmount:min;
		max = (itemAmount>max)?itemAmount:max;
	})
	inputSliderItem.max = max;
	inputSliderItem.min = min;
	labelSliderItem.innerHTML +="price between " + min +  " and " + max;

	let brTag = document.createElement('div');
	brTag.innerHTML = "<br>"


	labelSliderItem.append(inputSliderItem);

	priceSlider.append(labelSliderItem);
	searchbar.append(priceSlider)
	searchbar.append(brTag)
}


window.onload = function() {
	let tokenPayload = getTokenPayload();
	// if (tokenPayload==)

	populateFilters();
	console.log(tokenPayload)
	if (tokenPayload){
		if (tokenPayload.role === "user"){
			document.querySelector("body > nav >" +
									   " a:nth-child(3)").outerHTML
			="";
			document.querySelector("body > nav >" +
									   " a:nth-child(3)").outerHTML="";
		}else{
			document.querySelector("body > nav >" +
									   " a:nth-child(2)").outerHTML="";
			document.querySelector("body > nav >" +
									   " a:nth-child(3)").outerHTML="";
		}
	}else{
		document.getElementsByClassName("auction_nav")[0].querySelectorAll("a")[2].outerHTML="";
		document.getElementsByClassName("auction_nav")[0].querySelectorAll("a")[1].outerHTML="";
		document.getElementsByClassName("auction_nav")[0].querySelectorAll("a")[2].outerHTML="";
	}
	console.log('DOM has loaded');
};


document.querySelector('nav').querySelectorAll('a')[4].addEventListener('click', resetToken);


