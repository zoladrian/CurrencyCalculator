// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  let output = "";
  let operand1 = "";
  let operand2 = "";
  let operator = "";
  let rates = {};
  let currentCurrency = "EUR"; // Default currency

  // Fetch exchange rates from NBP API
  fetch("https://api.nbp.pl/api/exchangerates/tables/A/2023-10-12/")
    .then(response => response.json())
    .then(data => {
      // Populate the rates object with the fetched data
      rates = {
        GBP: data[0].rates.find(x => x.code === "GBP").mid,
        EUR: data[0].rates.find(x => x.code === "EUR").mid,
        USD: data[0].rates.find(x => x.code === "USD").mid,
      };
    })
    .catch(err => console.error("Error fetching exchange rates: ", err));

  // Select all input buttons
  const buttons = document.querySelectorAll("input[type='button']");
  // Select the result field
  const resultField = document.getElementById("result");

  // Add event listeners to each button
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.value;

      // Check if the button is an operator
      if (["+", "-", "*", "/"].includes(value)) {
        operand1 = output;
        operator = value;
        output = "";
      }
      // Clear button functionality
      else if (value === "C") {
        operand1 = "";
        operand2 = "";
        operator = "";
        output = "";
        resultField.value = "";
      }
      // Equals button functionality
      else if (value === "=") {
        operand2 = output;
        if (operand1 !== "" && operand2 !== "") {
          // Perform calculation
          output = eval(`${parseFloat(operand1)}${operator}${parseFloat(operand2)}`).toString();
        }
        // Display result with the current currency
        resultField.value = `${output} ${currentCurrency}`;
        operand1 = output;
        operand2 = "";
        operator = "";
      }
      // Currency conversion buttons
      else if (["GBP", "EUR", "USD"].includes(value)) {
        if (currentCurrency !== value) {
          // Convert the amount to the selected currency
          const amount = parseFloat(output) / rates[currentCurrency] * rates[value];
          output = amount.toFixed(2);
          // Update the result field with the new currency
          resultField.value = `${output} ${value}`;
          currentCurrency = value;
        }
      }
      // Number buttons
      else {
        output += value;
      }

      // Update the display, unless it's "=" or "C" or a currency button
      if (value !== "=" && value !== "C" && !["GBP", "EUR", "USD"].includes(value)) {
        resultField.value = `${output} ${currentCurrency}`;
      }
    });
  });
});
