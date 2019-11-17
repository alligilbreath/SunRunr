var PLEASEGODWORK = "PLEASE WORK";


function showData(){
	
	let deviceId = {deviceId: $("#deviceId").val()};
	
	
	$.ajax({
	   url: "/devices/sunRun", //TODO: Clarify actual url endpoint
	   method: 'GET',
	   contentType: 'application/json',
	   data: JSON.stringify(deviceId),
	   dataType: 'json'
	})
		    .done(displayData)
		    .fail(showError);
	
}


function displayData(data, textStatus, jqXHR){
	
	// longitude, letitude, 
	
	let dataDispl = "<ul>" + 
	"<li>" + data.longitude + "</li>" +
	"<li>" + data.latitude + "</li>" +
	"<li>" + data.speed + "</li>" +
	"<li>" + data.uvIndex + "</li>" +
	"</ul>";
	
	$("dataDispl").html(dataDispl);
}

function showError(jqXHR, textStatus, errorThrown){
	$("#errorDispl").text("Error: " + jqXHR.responseJSON.message);
}



function toDevicePage(){
	window.location = "regDevice.html";	
}

$(function () {
	  
	$("#showData").click(showData);
	
	$('#regDevicePage').click(toDevicePage);
	  
	  
});
