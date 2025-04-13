//----------------------------- FIAT SECTION-----------------------------------------------------------------------------
const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");
const apiKey = `4d4a35ea1c4cf3340fef4505`;

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    //selecting USD by default as FROM currencey and NGN as TO currency
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "NGN" ? "selected" : "";
    }
    //creating option tag with passing currency code as a text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //inserting option tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); // calling loadFlag with passing target element as an argument
  });
}
function loadFlag(element) {
  for (code in country_code) {
    if (code == element.value) {
      //if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); //slect img tag of particular element
      //passing country code of a selected currency code in a img url
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}

// prevent browser refresh
// window.addEventListener('beforeunload', (event) => {
// 	event.preventDefault();
// 	event.returnValue = '';
//   });

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); //prevent form from submitting
  getExchangeRate();
});

// exchange Icon swap
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
  fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
  toCurrency.value = tempCode; //passing temporary currency code to TO currency code
  loadFlag(fromCurrency); //calling loadFlag with passsing select element (fromCurrency) of FROM
  loadFlag(toCurrency); //calling loadFlag with passsing select element (toCurrency) of TO
  getExchangeRate();
});

function getExchangeRate() {
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
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
      console.log(totalExchangeRate);
    });
}

// ------------------------------------------------CRYPTO SECTION-----------------------------------------------------------------
// Convert country code to flag emoji
function getFlagEmoji(code) {
  const countryCode = countryCodeMap[code];
  if (!countryCode) return "";
  return countryCode.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
}

// Extract currency code from a label like "Bitcoin (BTC)"
function extractCurrencyCode(text) {
  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
}

// Get formatted HTML for selected item
function formatSelected(code, list, isCrypto = false) {
	if (isCrypto) {
		return `<img src="js/icons/${code.toLowerCase()}.svg" alt="${code}" /><span>${list[code]} (${code})</span>`;
	} else {
		return `<span>${getFlagEmoji(code)} ${list[code]} (${code})</span>`;
	}
}

// Dropdown population
function populateDropdown(dropdownId, list, isCrypto = false, selectedCode = null) {
  const dropdown = document.getElementById(dropdownId);
  const selected = dropdown.querySelector(".dropdown-selected");
  const options = dropdown.querySelector(".dropdown-options");

  options.innerHTML = "";

  for (let code in list) {
    const li = document.createElement("li");
    li.innerHTML = formatSelected(code, list, isCrypto);

    li.addEventListener("click", () => {
      selected.innerHTML = li.innerHTML;
      options.style.display = "none";
    });

    options.appendChild(li);
  }

	// Set selection (either from passed code or default first)
	const firstCode = selectedCode || Object.keys(list)[0];
	selected.innerHTML = formatSelected(firstCode, list, isCrypto);
	
  // Toggle dropdown
  selected.onclick = () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
  };

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
		options.style.display = "none";
    }
  });
}

// Initialize both dropdowns
let currentCryptoList = { ...crypto_list };
let currentFiatList = { ...fiat_list};

populateDropdown("cryptoDropdown", currentCryptoList, true);
populateDropdown("fiatDropdown", currentFiatList, false);

// Swap logic
document.getElementById("swapButton").addEventListener("click", () => {
  // swap selected text
  const cryptoSelectedText = document.querySelector("#cryptoDropdown .dropdown-selected").innerText;
  const fiatSelectedText = document.querySelector("#fiatDropdown .dropdown-selected").innerText;

  const cryptoCode = extractCurrencyCode(cryptoSelectedText);
  const fiatCode = extractCurrencyCode(fiatSelectedText);

  // Swap lists
  [currentCryptoList, currentFiatList] = [currentFiatList, currentCryptoList];

  // Check if the new lists are crypto or fiat
  const isCryptoNowCrypto = Object.keys(currentCryptoList).some(code => crypto_list.hasOwnProperty(code));
  const isCryptoNowFiat = !isCryptoNowCrypto;

  // Re-populate dropdowns with swapped content after repopulating
  // Re-populate with correct types
  populateDropdown("cryptoDropdown", currentCryptoList, isCryptoNowCrypto, fiatCode);
  populateDropdown("fiatDropdown", currentFiatList, isCryptoNowFiat, cryptoCode);

});


// GET CONVERSION RATE

const apiKeyy = '4b9a67ec-0803-4010-8b56-053b9ced9857';


document.getElementById("convertBtn").addEventListener("click", convertRate); 

function convertRate () {
	const cryptoText = document.querySelector("#cryptoDropdown .dropdown-selected").innerText;
	const fiatText = document.querySelector("#fiatDropdown .dropdown-selected").innerText;
	const amount = parseFloat(document.getElementById("amountInput").value) || 1; // Get user input amount (default to 1 if empty)

	const cryptoCode = extractCurrencyCode(cryptoText);
	const fiatCode = extractCurrencyCode(fiatText);
	
	if (!cryptoCode || !fiatCode) {
		document.getElementById("displayRate").textContent = "Please select valid currencies.";
		return;
	  }
 // Send the amount to SERVER backend
 fetch(`http://localhost:3000/api/convert?amount=${amount}&symbol=${cryptoCode}&convert=${fiatCode}`,  {
		method: 'GET',
		headers: {
		  'X-CMC_PRO_API_KEY': apiKeyy
		}
	  })

	//   NEW EDIT FOR USING PROXY SERVER
	.then(res => res.json())
	.then(data => {
		// Check the response structure to avoid issues
		if (data.success) {
			const convertedAmount = data.result.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			document.getElementById("displayRate").textContent = `${amount} ${cryptoCode} = ${convertedAmount} ${fiatCode}`;
		  } else {
			document.getElementById("displayRate").textContent = data.message || "Error fetching conversion rate.";
		  }
		})
	//   ORIGINAL SYNTAX FOR RUNNING API DIRECT TO SERVER
	// .then(res => {
	// 	if (!res.ok) {
	// 	  throw new Error(`HTTP error! Status: ${res.status}`);
	// 	}
	// 	return res.json();
	//   })
	//   .then(data => {
	// 	console.log("API Response:", data); // Log the full response to inspect
	// 	const quote = data?.data?.quote?.[fiatCode];
	// 	if (!quote) {
	// 	  throw new Error("Conversion rate not found.");
	// 	}
  
	// 	const convertedPrice = quote.price.toLocaleString(undefined, {
	// 		minimumFractionDigits: 2,
	// 		maximumFractionDigits: 2
	// 	  });

	// 	  document.getElementById("displayRate").textContent = `${amount} ${cryptoCode} = ${convertedPrice} ${fiatCode}`;
	// })
	.catch(err => {
		document.getElementById("displayRate").textContent = "Error fetching conversion rate.";
		console.error("API error:", err);
	  });
}

  



//   async function fetchConversionRate(base, quote) {
// 	try {
// 	  const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`);
// 	  const data = await res.json();
// 	  const rate = data.rates[quote];
// 	  if (rate) {
// 		document.getElementById("displayRate").textContent = `1 ${base} = ${rate.toFixed(2)} ${quote}`;
// 	  }
// 	} catch (err) {
// 	  document.getElementById("displayRate").textContent = "Rate unavailable.";
// 	  console.error("Error fetching rate:", err);
// 	}
//   }

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
