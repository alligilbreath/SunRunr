function isValidInput() {
    let interestRateElement = document.getElementById("intRate");
    let initialBalanceElement = document.getElementById("initBalance");
    let numYearsElement = document.getElementById("numYears");
    let isValid = true;
    
    // Create a regular expression that only matches valid input 
    let numYearsRe = /^\d{1,2}$/;  // One or two digits
    let interestRateRe = /^\d?\d\.\d+$/;  // 1 or 2 digits followed by a period and 1 or more digits
    let balanceRe = /^\d+(\.\d\d)?$/;  // Any number of digits, optionally followed by a period and two digits
    
    if( numYearsRe.test(numYearsElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        numYearsElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        numYearsElement.classList.add("error");
        isValid = false;
    }
    
    if( interestRateRe.test(interestRateElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        interestRateElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        interestRateElement.classList.add("error");
        isValid = false;
    }
    
    // Create a regular expression that only matches valid input 
    if( balanceRe.test(initialBalanceElement.value)) {
        // Remove the error class, in case the error class was
        // previously added. 
        initialBalanceElement.classList.remove("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        initialBalanceElement.classList.add("error");
        isValid = false;
    }
    return isValid;
}

function generateTable() {
console.log("test");
    // If input is invalid, do not update the table.
    if (!isValidInput()) return;
    
    let initBalance = 1.0 * document.getElementById('initBalance').value;
    let numYears = parseInt(document.getElementById('numYears').value);
    let interestRate = parseFloat(document.getElementById('intRate').value);
    let isYearlyInterest = document.getElementById("yearlyInt").checked;
    let currBalance;

    let savingsTabelDiv = document.getElementById("savingsTable");
    let tableHTML = "";
    
    tableHTML += "<table>";
    tableHTML += "<tr><th>Year</th><th>Balance</th></tr>";
    
    currBalance = initBalance;
    for(let i=0; i <numYears; i++) {
      if (isYearlyInterest) {
        currBalance += currBalance * (interestRate/ 100.0);
      }
      else {
        currBalance *= Math.pow(1.0 + (interestRate/ 100.0), 12);
      }
      tableHTML += "<tr><td>" + (i+1) + "</td><td>$" + currBalance.toFixed(2) + "</td></tr>";
    }
    
    tableHTML += "</table>";

    savingsTabelDiv.innerHTML = tableHTML;
}

document.addEventListener("DOMContentLoaded", function(event) {
    generateTable();
    var items = document.getElementsByTagName('input');
    for (i in items) {
      items[i].addEventListener("input", generateTable);
    }
});


