function generateTable() {
    let initBalance = 1000;
    let numYears = 5;
    let interestRate = 1.2;
    let currBalance;

    let savingsTabelDiv = document.getElementById("savingsTable");
    let tableHTML = "";
    
    tableHTML += "<table>";
    tableHTML += "<tr><th>Year</th><th>Balance</th></tr>";
    
    currBalance = initBalance;
    for(let i=0; i <numYears; i++) {
      currBalance += currBalance * (interestRate/ 100.0);
      tableHTML += "<tr><td>" + (i+1) + "</td><td>" + currBalance + "</td></tr>";
    }
    
    tableHTML += "</table>";

    savingsTabelDiv.innerHTML = tableHTML;
}