//----------------------------- FIAT SECTION-----------------------------------------------------------------------------
const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");
const apiKey = `4d4a35ea1c4cf3340fef4505`;

for(let i = 0; i < dropList.length; i++){
	for(currency_code in country_code) {
		//selecting USD by default as FROM currencey and NGN as TO currency
		let selected;
		if(i == 0){
			selected = currency_code == "USD" ? "selected" : "";
		}else if(i == 1){
			selected = currency_code == "NGN" ? "selected" : "";

		}
		//creating option tag with passing currency code as a text and value 
		let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
		//inserting option tag inside select tag
		dropList[i].insertAdjacentHTML("beforeend", optionTag);
	}
	dropList[i].addEventListener("change", e=>{
		loadFlag(e.target); // calling loadFlag with passing target element as an argument
	});
}
function loadFlag(element){
	for(code in country_code){
		if(code == element.value){ //if currency code of country list is equal to option value
			let imgTag = element.parentElement.querySelector("img"); //slect img tag of particular element
			//passing country code of a selected currency code in a img url
			imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`
		}
	}
}

// prevent browser refresh
// window.addEventListener('beforeunload', (event) => {
// 	event.preventDefault();
// 	event.returnValue = '';
//   });
  
window.addEventListener("load", () =>{
	getExchangeRate();
});

getButton.addEventListener("click", e =>{
	e.preventDefault(); //prevent form from submitting 
	getExchangeRate();
});

// exchange Icon swap
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
	let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
	fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
	toCurrency.value = tempCode; //passing temporary currency code to TO currency code
	loadFlag(fromCurrency); //calling loadFlag with passsing select element (fromCurrency) of FROM
	loadFlag(toCurrency); //calling loadFlag with passsing select element (toCurrency) of TO
	getExchangeRate();
});


function getExchangeRate(){
	const amount = document.querySelector(".amount input"),
	exchangeRateTxt = document.querySelector(".exchange-rate"); 
	let amountVal = amount.value;
	//if user dont enter any value or enter 0 then we'll put 1 value by default in the input field
	if (amountVal == "" || amountVal == "0") {
		amount.value = "1";
		amountVal = amount.value;
		
	}
	exchangeRateTxt.innerText = "1 USD = 1,580.000 NGN";

	// DO NOT FORGET TO UNCOMMENT THE API FOR GETTING ECHANGE RATE
	// let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
	//fetching api response and returning it with parsing into js obj and in another then method receiving that obj
	fetch(url).then(response => response.json()).then(result => {
		let exchangeRate = result.conversion_rates[toCurrency.value];
		let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
		exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
		console.log(totalExchangeRate)
	})
}


// ------------------------------------------------CRYPTO SECTION-----------------------------------------------------------------
// Convert country code to flag emoji
function getFlagEmoji(code) {
	const countryCode = countryCodeMap[code];
	if (!countryCode) return "";
	return countryCode.replace(/./g, char =>
	  String.fromCodePoint(char.charCodeAt(0) + 127397)
	);
  }

// Extract (XYZ) currency code from a string
  function extractCurrencyCode(text) {
	const match = text.match(/\(([^)]+)\)/);
	return match ? match[1] : null;
  }

  // Dropdown population
  function populateDropdown(dropdownId, list, isCrypto = false, selectedCode = null) {
	const dropdown = document.getElementById(dropdownId);
	const selected = dropdown.querySelector(".dropdown-selected");
	const options = dropdown.querySelector(".dropdown-options");

	options.innerHTML = "";

	for (let code in list) {
	  const li = document.createElement("li");
	  li.innerHTML = isCrypto
		? `<img src="js/icons/${code.toLowerCase()}.svg" alt="${code}" /><span>${list[code]} (${code})</span>`
		: `<span>${getFlagEmoji(code)} ${list[code]} (${code})</span>`;

	  li.addEventListener("click", () => {
		selected.innerHTML = li.innerHTML;
		options.style.display = "none";
	  });

	  options.appendChild(li);
	}

      // Set default selection
      const firstCode = selectedCode || Object.keys(list)[0];
      selected.innerHTML = isCrypto
        ? `<img src="js/icons/${firstCode.toLowerCase()}.svg" alt="${firstCode}" /><span>${list[firstCode]} (${firstCode})</span>`
        : `<span>${getFlagEmoji(firstCode)} ${list[firstCode]} (${firstCode})</span>`;

		  // Toggle dropdown
	selected.addEventListener("click", () => {
        options.style.display = options.style.display === "block" ? "none" : "block";
      });

	  // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          options.style.display = "none";
        }
      });
    } 

	

	// Initialize both dropdowns
	let currentCryptoList = { ...crypto_list };
    let currentFiatList = { ...fiat_list };

    populateDropdown("cryptoDropdown", currentCryptoList, true);
    populateDropdown("fiatDropdown", currentFiatList, false);

  // Swap logic
  document.getElementById("swapButton").addEventListener("click", () => {
	// swap selected text
	 const cryptoSelected = document.querySelector("#cryptoDropdown .dropdown-selected");
  const fiatSelected = document.querySelector("#fiatDropdown .dropdown-selected");

  const cryptoCode = extractCurrencyCode(cryptoSelected.innerText);
  const fiatCode = extractCurrencyCode(fiatSelected.innerText);

      // Swap lists
      [currentCryptoList, currentFiatList] = [currentFiatList, currentCryptoList];

  // Re-populate dropdowns with swapped content
  populateDropdown("cryptoDropdown", currentCryptoList, true, fiatCode);
  populateDropdown("fiatDropdown", currentFiatList, false, cryptoCode);

  });














  
// //crypto to fiat exchange icon
// let isCryptoToFiat = true; // current mode

// // Load dropdowns initially
// populateDropdown(cryptoCurrency, crypto_list, "BTC", true);
// populateDropdown(fiatCurrency, country_code, "NGN", false);

// // ==========================
// // Populate Dropdown Function
// // ==========================

// // rebuild Dropdowns
// function populateDropdown(selectEl, data, selectedCode, isCrypto) {
//   selectEl.innerHTML = ""; // clear old options
//   for (let code in data) {
//     const isSelected = code === selectedCode ? "selected" : "";
//     const name = data[code];
// 	 const iconSrc = isCrypto
//       ? `js/icons/${code.toLowerCase()}.svg`
//       : getFlagEmoji(code);

// 	  const option = document.createElement("option");
// 	  option.value = code;
// 	  option.selected = code === selectedCode;

// 	  if (isCrypto) {
// 		option.innerHTML = `<img src="${iconSrc}" class="dropdown-icon"> ${name} (${code})`;
// 	  } else {
// 		option.textContent = `${iconSrc} ${name} (${code})`;
// 	  }
	  
// 	  selectEl.appendChild(option);
// 	}
  
// 	if (isCrypto) loadCryptoIcon(selectEl);
//   }
  

// ---------------------------------------------------------------neeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee----------------------------


// function getFlagEmoji(code) {
// 	const countryCode = loadFlag[code];
// 	if (!countryCode) return "";
// 	return countryCode.replace(/./g, char =>
// 	  String.fromCodePoint(char.charCodeAt(0) + 127397)
// 	);
//   }


// //   ------------------------------------alternative syntax to display icon

// // function getFlagEmoji(code) {
// //     const cc = countryCodeMap[code];
// //     if (!cc) return "";
// //     return cc.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
// //   }

// //   function createSelectedItem(container, label, iconSrc, isCrypto) {
// //     container.innerHTML = "";
// //     if (isCrypto) {
// //       const img = document.createElement("img");
// //       img.src = iconSrc;
// //       img.alt = label;
// //       container.appendChild(img);
// //     }
// //     const span = document.createElement("span");
// //     span.textContent = label;
// //     container.appendChild(span);
// //   }
// //   ------------------------------------

//   function initDropdown(dropdownId, list, isCrypto = false) {
// 	const dropdown = document.getElementById(dropdownId);
// 	const selected = dropdown.querySelector(".dropdown-selected");
// 	const options = dropdown.querySelector(".dropdown-options");

// 	options.innerHTML = "";
// // --------------------------------------------------------alternative syntax to display icon

// // for (let code in list) {
// // 	const li = document.createElement("li");
// // 	if (isCrypto) {
// // 	  const img = document.createElement("img");
// // 	  img.src = `js/icons/${code.toLowerCase()}.svg`;
// // 	  img.alt = code;
// // 	  const span = document.createElement("span");
// // 	  span.textContent = `${list[code]} (${code})`;
// // 	  li.appendChild(img);
// // 	  li.appendChild(span);
// // 	} else {
// // 	  const span = document.createElement("span");
// // 	  span.textContent = `${getFlagEmoji(code)} ${list[code]} (${code})`;
// // 	  li.appendChild(span);
// // 	}

// // 	li.addEventListener("click", () => {
// // 	  const label = `${list[code]} (${code})`;
// // 	  const iconSrc = isCrypto ? `js/icons/${code.toLowerCase()}.svg` : null;
// // 	  createSelectedItem(selected, isCrypto ? label : `${getFlagEmoji(code)} ${label}`, iconSrc, isCrypto);
// // 	  options.style.display = "none";
// // 	});

// // 	options.appendChild(li);
// //   }

// //   selected.addEventListener("click", () => {
// // 	options.style.display = options.style.display === "block" ? "none" : "block";
// //   });

// //   document.addEventListener("click", (e) => {
// // 	if (!dropdown.contains(e.target)) {
// // 	  options.style.display = "none";
// // 	}
// //   });

// //   // Set default
// //   const firstCode = Object.keys(list)[0];
// //   const label = `${list[firstCode]} (${firstCode})`;
// //   const iconSrc = isCrypto ? `/js/icons/${firstCode.toLowerCase()}.svg` : null;
// //   createSelectedItem(selected, isCrypto ? label : `${getFlagEmoji(firstCode)} ${label}`, iconSrc, isCrypto);
// // }

// // ------------------------------------------------------
// 	for (let code in list) {
// 	  const li = document.createElement("li");
// 	  li.innerHTML = isCrypto
// 		? `<img src="js/icons/${code.toLowerCase()}.svg" alt="${code}" /><span>${list[code]} (${code})</span>`
// 		: `<span>${getFlagEmoji(code)} ${list[code]} (${code})</span>`;

// 	  li.addEventListener("click", () => {
// 		selected.innerHTML = li.innerHTML;
// 		options.style.display = "none";
// 	  });

// 	  options.appendChild(li);
// 	}
// 	selected.addEventListener("click", () => {
//         options.style.display = options.style.display === "block" ? "none" : "block";
//       });

//       document.addEventListener("click", (e) => {
//         if (!dropdown.contains(e.target)) {
//           options.style.display = "none";
//         }
//       });
//     } 
	
 
// 	// ------------------------------------------------------------------
// 	// Initialize both dropdowns
//     initDropdown("cryptoDropdown", crypto_list, true);
//     initDropdown("fiatDropdown", fiat_list, false);

//   // Swap logic
//   document.getElementById("swapButton").addEventListener("click", () => {
// 	const cryptoSelected = document.getElementById("selectedCrypto").innerHTML;
// 	const fiatSelected = document.getElementById("selectedFiat").innerHTML;

// 	document.getElementById("selectedCrypto").innerHTML = fiatSelected;
// 	document.getElementById("selectedFiat").innerHTML = cryptoSelected;
//   });

