
function registerDevice(){
	
	let deviceID = $("#deviceID").val();
	let userEmail = $("#userEmail").val();
	
	
	console.log("Checking if something was entered in textboxes");
	if(deviceID.length == 0   && userEmail.length == 0){
		$("deviceError").text("Please enter your deive ID and email");
		console.log("No email or device Id");
		return;
	}



	let deviceInfo = {deviceId: deviceID, email: userEmail};
	
	  $.ajax({
		   url: "/devices/register", //TODO: Clarify actual url endpoint
		   method: 'POST',
		   contentType: 'application/json',
		   headers: { 'x-auth': window.localStorage.getItem("authToken") },
		   data: JSON.stringify(deviceInfo),
		   dataType: 'json'
		  })
		    .done(deviceNowRegistered)
		    .fail(registerError);
}	
	
	
function deviceNowRegistered(data, textStatus, jqXHR){
	window.alert(jqXHR.responseJSON.message);
	window.location = "userPage.html";
}

function registerError(jqXHR, textStatus, errorThrown){
	window.alert("Error: " + jqXHR.responseJSON.message);
	$("#deviceError").text("Error: " + jqXHR.responseJSON.message);
}



$(function () {
  $('#regDevice').click(registerDevice);
  
  $('#returnUserPage').click(function(){
	window.location.replace("userPage.html");
  });
  
});
