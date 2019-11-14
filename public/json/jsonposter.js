function postJson() {
    let url = document.getElementById("url").value;
    let json = document.getElementById("jsonData").value;

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", processResponse);
    xhr.responseType = "json";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(json);
}

// Response listener for the Ajax call for posting a participation 
function processResponse() {
    let responseDiv = document.getElementById('ServerResponse');
    let responseHTML = "";

    // 201 is the response code for a successful POST request
    if (this.status === 201) {
        responseHTML += "<ol class='ServerResponse'>";

        for (let key in this.response) {
            responseHTML += "<li>" + key + ": " + this.response[key] + "</li>";
        }
        responseHTML += "</ol>"
    }
    else {
        responseHTML = "<p>Response (" + this.status + "):</p>"
        responseHTML += "<ol class='ServerResponse'>";

        for (let key in this.response) {
            responseHTML += "<li>" + key + ": " + this.response[key] + "</li>";
        }
        responseHTML += "</ol>"
    }

    // Update the response div in the webpage and make it visible
    responseDiv.style.display = "block";
    responseDiv.innerHTML = responseHTML;
}

document.getElementById("postJson").addEventListener("click", postJson);
