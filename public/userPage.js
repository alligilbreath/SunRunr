
///////////////////////////////////////////////////////////////////////////////////////
function showData(){

	let deviceId = {deviceId: $("#deviceId").val()};


	$.ajax({
	   url: "/devices/sensorData", //TODO: Clarify actual url endpoint
	   method: 'POST',
	   contentType: 'application/json',
	   headers: { 'x-auth': window.localStorage.getItem("authToken") },
	   data: JSON.stringify(deviceId),
	   dataType: 'json'
	})
		    .done(displayData)
		    .fail(showError);

}


function displayData(data, textStatus, jqXHR){
	// Old Code
	// longitude, letitude,
	//console.log(data[data.length - 1]);
	/*let dataDispl = "<ul>" +
	"<li>" + (data[data.length - 1].longitude).toString() + "</li>" +
	"<li>" + (data[data.length - 1].latitude).toString() + "</li>" +
	"<li>" + (data[data.length - 1].speed).toString() + "</li>" +
	"<li>" + (data[data.length - 1].uvIndex).toString() + "</li>" +
	"</ul>";
	$("#dataDispl").html(dataDispl);*/

	longi = data[data.length - 1].longitude;
	lati = data[data.length - 1].latitude;
	userSpeed = data[data.length - 1].speed;
	uv = data[data.length - 1].uvIndex;

	// TODO: Ask to update database to get data of weekly activities
	// weekData = data[data.length - 1].weekData;

	
	summaryViewUpdate();
	activitySummaryUpdate();
	activityDetailsUpdate();


}

function showError(jqXHR, textStatus, errorThrown){
	$("#errorDispl").text("Error: " + jqXHR.responseJSON.message);
}

function summaryViewUpdate(){}
function activitySummaryUpdate(){}
function activityDetailsUpdate(){}

///////////////////////////////////////////////////////////////////////////////////////

/* TODO: Perhaps try to instead of having the user always enter their device ID to get their data,
maybe try to automatically get their first device id and then grab all of the data to be displayed 
on the $(function(){}) below (before page load). This would mean changing the /devices/sensorData endpoint to a GET
OR creating the same /devices/sensorData endpoint but as a GET */
$(function () {

	// TODO: Uncomment code below when everything works
	// This is to take user back to login page if they haven't logged in yet
	/* if(!window.localStorage.getItem('authToken')){
	 	window.location = "login.html";
	 }*/

	$('.collapsible').collapsible();
	$('.dropdown-trigger').dropdown();
	$('.tabs').tabs(); //duration, onShow, swipeable, responsiveThreshold 



	let deviceId = {deviceId: $("#deviceId").val()};

	 	/* Attempt at getting data through AJAX here
		$.ajax({
			url: "/devices/sensorData", //TODO: Clarify actual url endpoint
			method: 'POST',
			contentType: 'application/json',
			headers: { 'x-auth': window.localStorage.getItem("authToken") },
			data: JSON.stringify(deviceId),
			dataType: 'json'
		})
				.done(displayData)
				.fail(showError);
		*/
		
		// TODO: Try to make the code below work
		// WHY DOES THIS NOT WORK?!?!?!?!?!?! ANSWER: IT WAS THE FUCKING AJAX FUNCTION!!!
		
		$('#registerDevice').click(showData);


	//$("#showData").click(showData); 

	/*
	$('#regDevicePage').click(function(){
		window.location = "regDevice.html";
	});*/


	// This is for the user to log out of their account
	 $("#logOut").click(function(){
	 	window.localStorage.removeItem('authToken'); // This is to remove the authToken
	 	window.location = "login.html"; // Take user back to log in page
	 });

});
