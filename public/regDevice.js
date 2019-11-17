
function registerDevice(){
	
	let deviceID = $("#deviceID").value();
	let userEmail = $("#userEmail").value();
	
	let deviceInfo = {deviceId: deviceID, email: userEmail};
	
	  $.ajax({
		   url: "/devices/register", //TODO: Clarify actual url endpoint
		   method: 'POST',
		   contentType: 'application/json',
		   data: JSON.stringify(deviceInfo),
		   dataType: 'json'
		  })
		    .done(deivceNowRegistered)
		    .fail(registerError);
}	
	
	
function deviceNowRegistered(data, textStatus, jqXHR){
	window.alert(jqXHR.responseJSON.message);
	
}

function registerError(jqXHR, textStatus, errorThrown){
	window.alert("Error: " + jqXHR.responseJSON.message);
	$("#deviceError").text("Error: " + jqXHR.responseJSON.message);
}











$(function () {
  $('#regDevice').click(registerDevice);
});
