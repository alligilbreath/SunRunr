var PLEASEGODWORK = "PLEASE WORK";


function showData(){

	let deviceId = {deviceId: $("#deviceId").val()};


	$.ajax({
	   url: "/devices/sensorData", //TODO: Clarify actual url endpoint
	   method: 'POST',
	   contentType: 'application/json',
	   data: JSON.stringify(deviceId),
	   dataType: 'json'
	})
		    .done(displayData)
		    .fail(showError);

}


function displayData(data, textStatus, jqXHR){

	// longitude, letitude,
	console.log(data);
	let dataDispl = "<ul>" +
	"<li>" + (data[-1].longitude).toString() + "</li>" +
	"<li>" + (data[-1].latitude).toString() + "</li>" +
	"<li>" + (data[-1].speed).toString() + "</li>" +
	"<li>" + (data[-1].uvIndex).toString() + "</li>" +
	"</ul>";

	$("#dataDispl").html(dataDispl);
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
