function isValidInput() {
    //let interestRateElement = document.getElementById("intRate");
    let interestRateElement = $("#intRate");
    // let initialBalanceElement = document.getElementById("initBalance");
    let initialBalanceElement = $("#initBalance");
    //let numYearsElement = document.getElementById("numYears");
    let numYearsElement = $("#numYears");
    let isValid = true;
    
    // Create a regular expression that only matches valid input 
    let numYearsRe = /^\d{1,2}$/;  // One or two digits
    let interestRateRe = /^\d?\d\.\d+$/;  // 1 or 2 digits followed by a period and 1 or more digits
    let balanceRe = /^\d+(\.\d\d)?$/;  // Any number of digits, optionally followed by a period and two digits
    
    if( numYearsRe.test(numYearsElement.val())) {
        // Remove the error class, in case the error class was
        // previously added. 
        numYearsElement.removeClass("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        numYearsElement.addClass("error");
        isValid = false;
    }
    
    if( interestRateRe.test(interestRateElement.val())) {
        // Remove the error class, in case the error class was
        // previously added. 
        interestRateElement.removeClass("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        interestRateElement.addClass("error");
        isValid = false;
    }
    
    // Create a regular expression that only matches valid input 
    if( balanceRe.test(initialBalanceElement.val())) {
        // Remove the error class, in case the error class was
        // previously added. 
        initialBalanceElement.removeClass("error");
    }
    else {
        // Add the error class, which defines a 2px red border 
        initialBalanceElement.addClass("error");
        isValid = false;
    }
    return isValid;
}

function generateTable() {
    // If input is invalid, do not update the table.
    if (!isValidInput()) return;
    
    let initBalance = 1.0 * $('#initBalance').val();
    let numYears = parseInt($('#numYears').val());
    let interestRate = parseFloat($('#intRate').val());
    let isYearlyInterest = $("#yearlyInt").prop('checked');
    let currBalance;

    let savingsTabelDiv = $("#savingsTable");
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

    savingsTabelDiv.html(tableHTML);
}

// Once the DOM is loaded, register an event handler for the Generate Table Button
// document.addEventListener("DOMContentLoaded", function(event) {
$(function(){
  // let inputs = document.getElementsByTagName("input");
   
  // for (let i = 0; i<inputs.length; i++) {
  //   inputs[i].addEventListener("input", generateTable);
  // }

  $("input[type='text']").keyup(generateTable);
  $("input[type='radio']").change(generateTable);

  generateTable();
});


