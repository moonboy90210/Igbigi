//----------------------------- FIAT SECTION-----------------------------------------------------------------------------
const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");
const apiKey = `16c698e371e08a9f741d2cf4`;

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    //selecting USD by default as FROM currency and NGN as TO currency
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
	getExchangeRate();
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
  // placeholder if user enters no value or 0 
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = amount.value;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";

  // DO NOT FORGET TO UNCOMMENT THE API FOR GETTING ECHANGE RATE
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

  //fetch API response 
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
      console.log(totalExchangeRate);
    });
}

// ------------------------------------------------CRYPTO SECTION-----------------------------------------
// Convert country code to flag emoji
function getFlagEmoji(code) {
  const countryCode = countryCodeMap[code];
  if (!countryCode) return "";
  return countryCode.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
}

// Extract currency code from a label, "Bitcoin (BTC)"
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

  // Check for new list is crypto or fiat
  const isCryptoNowCrypto = Object.keys(currentCryptoList).some(code => crypto_list.hasOwnProperty(code));
  const isCryptoNowFiat = !isCryptoNowCrypto;

  // Re-populate dropdowns with swapped content after repopulating
  populateDropdown("cryptoDropdown", currentCryptoList, isCryptoNowCrypto, fiatCode);
  populateDropdown("fiatDropdown", currentFiatList, isCryptoNowFiat, cryptoCode);

});


// GET CONVERSION RATE
const apiBase = 'http://localhost/igbigi/api/convert.php';

// Trigger default conversion on page load
  document.addEventListener("DOMContentLoaded", () => convertRate());
  // Listen to currency dropdown changes (if dynamically updated)

document.querySelector("#cryptoDropdown").addEventListener("click", () => convertRate());
document.querySelector("#fiatDropdown").addEventListener("click", () => convertRate());
document.getElementById("convertBtn").addEventListener("click", convertRate);

function convertRate() {
  const cryptoText = document.querySelector("#cryptoDropdown .dropdown-selected").innerText;
  const fiatText = document.querySelector("#fiatDropdown .dropdown-selected").innerText;
  const amountInput = document.getElementById("amountInput").value.trim();
  const amount = parseFloat(amountInput) || 0;

  const cryptoCode = extractCurrencyCode(cryptoText);
  const fiatCode = extractCurrencyCode(fiatText);

  if (!cryptoCode || !fiatCode) {
    document.getElementById("displayRate").textContent = "Please select valid currencies.";
    return;
  }
  // Validate amount input  
    if (amount <= 0) {
    document.getElementById("displayRate").textContent = "Enter a valid amount.";
    return;
  }

  // placeholder while fetching
  document.getElementById("displayRate").textContent = `Converting ${amount} ${cryptoCode}...`;

  // Construct API URL with query parameters
 const url = `${apiBase}?amount=${amount}&symbol=${cryptoCode}&convert=${fiatCode}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
      try {
        console.log("API Response:", data);
        const convertedAmount = data.data[0].quote[fiatCode].price;
        const formattedAmount = parseFloat(convertedAmount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        document.getElementById("displayRate").textContent = `${amount} ${cryptoCode} = ${formattedAmount} ${fiatCode}`;
      } catch (error) {
        document.getElementById("displayRate").textContent = "Conversion failed. Check currency selection.";
        console.error("Conversion error:", error);
      }
    })
    .catch(err => {
      document.getElementById("displayRate").textContent = "Error fetching conversion rate.";
      console.error("API error:", err);
    });
}


//-------------------------- application for node.js backend server-----------------------------------------

//  const url = `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&symbol=${cryptoCode}&convert=${fiatCode}`;
// fetch(url, {
//     method: 'GET',
//     headers: {
//       'X-CMC_PRO_API_KEY': apiKeyy
//     }
//   })
// -------
//   fetch(`http://localhost:3000/api/convert?amount=${amount}&symbol=${cryptoCode}&convert=${fiatCode}`, {
//     method: 'GET',
//     headers: {
//       'X-CMC_PRO_API_KEY': apiKeyy
//     }
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (data.success) {
// 		const convertedAmount = parseFloat(data.result.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

//         //Display final amount 
//         document.getElementById("displayRate").textContent = `${amount} ${cryptoCode} = ${convertedAmount} ${fiatCode}`;
//       } else {
//         document.getElementById("displayRate").textContent = data.message || "Error fetching conversion rate.";
//       }
//     })
//     .catch(err => {
//       document.getElementById("displayRate").textContent = "Error fetching conversion rate.";
//       console.error("API error:", err);
//     });
// }
