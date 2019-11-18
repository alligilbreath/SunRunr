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
	let dataDispl = "<ul>" +
	"<li>" + str(data.longitude) + "</li>" +
	"<li>" + str(data.latitude) + "</li>" +
	"<li>" + str(data.speed) + "</li>" +
	"<li>" + str(data.uv) + "</li>" +
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
