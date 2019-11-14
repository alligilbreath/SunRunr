function isValidInput() {
    let interestRateElement = document.getElementById("intRate");
    let initialBalanceElement = document.getElementById("initBalance");
    let numYearsElement = document.getElementById("numYears");
    let isValid = true;
    
    // Create a regular expression that only matches valid input 
    let numYearsRe = /\d+/;  // One or two digits
    
    // Create a regular expression that only matches valid input 
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
    
    return isValid;
}

function generateTable() {

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