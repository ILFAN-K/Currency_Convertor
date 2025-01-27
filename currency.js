let dropList = document.querySelectorAll("form select");
let fromCurrency = document.querySelector(".from select");
let toCurrency = document.querySelector(".to select");
let icon = document.querySelector(".icon");
let exchangeTxt = document.querySelector(".exchange_rate");
let getBtn = document.querySelector("button");

// Populate the dropdown options with both currency code and name
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i === 0
        ? currency_code === "USD"
          ? "selected"
          : ""
        : currency_code === "INR"
        ? "selected"
        : "";

    // Include both currency code and name in the dropdown
    let optionTag = `<option value="${currency_code}" ${selected}>
      ${currency_code} - ${country_list[currency_code].name}
    </option>`;

    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  // Update the flag whenever a selection changes
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

// Load the corresponding flag based on selected currency
function loadFlag(element) {
  let code = element.value;
  if (country_list[code]) {
    let imgTag = element.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${country_list[code].flag.toLowerCase()}.png`;
  }
}

// Get exchange rate and update the result
getBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission
  getExchangeValue();
});

function getExchangeValue() {
  const amount = document.querySelector("form input");
  let amountVal = amount.value;

  // Set default value if input is empty or invalid
  if (amountVal === "" || amountVal === "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/32d14f35ba44d69b1757e6eb/latest/${fromCurrency.value}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let total = (amountVal * exchangeRate).toFixed(2);
      exchangeTxt.innerText = `${amountVal} ${fromCurrency.value} = ${total} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeTxt.innerText = "Something went wrong";
    });
}

// Swap the "From" and "To" currencies and update flags and exchange rate
icon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeValue();
});

// Fetch initial exchange rate on page load
window.addEventListener("load", () => {
  getExchangeValue();
});
