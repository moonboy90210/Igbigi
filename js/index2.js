// const exchangeList = document.querySelectorAll("exchange-list select");

// const crypto = document.querySelector(".crypto select");
// const fiat = document.querySelector(".fiat select");
// getButton = document.querySelector("button")
// const access_key = "db0c3f964b1a72c19f5a8cb7495b3636";



function showCurrencyName() {
	var selectCurrency = document.getElementById("toCurrency");
	var currencyName = selectCurrency.options[selectCurrency.selectedIndex].text;
	document.getElementById("currencyName").innerHTML =  currencyName;
}

function showFromCurrencyName() {
	var selectFromCurrency = document.getElementById("fromCurrency");
	var fromcurrencyName = selectFromCurrency.options[selectFromCurrency.selectedIndex].text;
	document.getElementById("fromcurrencyName").innerHTML =  fromcurrencyName;
}

const amountInput = document.querySelector("#amount"),
fromCurrencySelect = document.querySelector('#fromCurrency'),
toCurrencySelect = document.querySelector('#toCurrency'),
convertButton = document.querySelector('#convert'),
resultTxt = document.querySelector('#result');

convertButton.addEventListener('click', () =>{
	const amount = amountInput.value;
	const fromCurrency = fromCurrencySelect.value;
	const toCurrency = toCurrencySelect.value;
	const apiUrl = `http://api.coinlayer.com/api/live?access_key=db0c3f964b1a72c19f5a8cb7495b3636&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

	fetch(apiUrl)
	.then(response => response.json())
		.then(data => {
			const rate = data[fromCurrency];
			const result = amount / rate;

			resultTxt.innerHTML = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
		})
		.catch(error => {
			resultTxt.innerHTML = "Errror: Unable to fetch ";
			console.error(error);
		});  
	
});
// window.addEventListener("load", () =>{
// 	convertCrypto();
// });

// getButton.addEventListener("click", e =>{
// 	e.preventDefault(); //prevent form from submitting 
// 	convertCrypto();
// });


// function convertCrypto() {
// const amount = document.querySelector("input .amount"),
// exchangeRateTxt = document.querySelector(".result"); 
// let amountVall = amount.value;
// 	//if user dont enter any value or enter 0 then we'll put 1 value by default in the input field
// 	if (amountVall == "" || amountVall == "0") {
// 		amount.value = "1";
// 		amountVall = amount.value;
// 	}	
// 	//const apiUrl = `http://api.coinlayer.com/api/live?access_key=db0c3f964b1a72c19f5a8cb7495b3636&from=${crypto}&to=${fiat}&amount=${amount}`;
// 	//const response = await fetch(apiUrl);
// 	// const data = await response.json();	
// 	exchangeRateTxt.innerText = "Getting exchange rate...";
// 	let apiUrl = `http://api.coinlayer.com/api/live?access_key=db0c3f964b1a72c19f5a8cb7495b3636&from=${crypto}&to=${fiat}&amount=${amount}`;
// 	fetch(apiUrl).then(response => response.json()).then(result => {
// 		let rate = result.conversion_rates[crypto.value];
// 		let convertedAmount = (amountVall * rate).toFixed(2);
// 		exchangeRateTxt.innerText = `${amount} ${crypto} = ${convertedAmount} ${fiat}`;
// 		console.log(convertedAmount)
// 	})
// }