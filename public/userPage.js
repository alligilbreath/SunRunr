var avgWeight = 137;
var walkMET = 6.0;
var joggMET = 8.3;
var bicyclingMET = 7.5;

///////////////////////////////////////////////////////////////////////////////////////
function showData(data, textStatus, jqXHR){
	if(data.length > 0){
		let deviceId = {deviceId: data[data.length - 1].userDevices[0]};

		// Make buttons for different devices here




		$.ajax({
			url: "/devices/sensorData", //TODO: Clarify actual url endpoint
			method: 'GET', // TODO: Whys is it a POST. Shouldn't it be a GET?
			contentType: 'application/json',
			headers: { 'x-auth': window.localStorage.getItem("authToken") },
			data: JSON.stringify(deviceId),
			dataType: 'json'
		 })
				 .done(displayData)
				 .fail(showError);
	}

	else{ console.log("Something went horribly wrong, there was no data at /users/account ..."); }
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

	//var longi = data[data.length - 1].longitude;
	//var lati = data[data.length - 1].latitude;
	if(data.lenth > 0){
		var userSpeed = data[data.length - 1].speed;// The entire array of speed; TODO: gonna need to parse this data and store it in a new variable (an array with object elements: [{y: 0}]) for CanvasJS
		var uv = data[data.length - 1].uvIndex; 	// The entire array of uvIndex; TODO: gonna need to parse this data and store it in a new variable (an array with object elements: [{y: 0}]) for CanvasJS
		var startTime = data[data.length - 1].startTime;
		var endTime = data[data.length - 1].endTime;
		var duration = data[data.length - 1].duration;
		var activityType = data[data.length - 1].activityType;

		// TODO: Ask to update database to get data of weekly activities
		// weekData = data[data.length - 1].weekData;


		summaryViewUpdate();
		activitySummaryUpdate();
		activityDetailsUpdate(userSpeed, uv, startTime, endTime, duration, activityType);

	}

	else{ console.log("Something went horribly wrong, there was no data at /devices/sensorData ..."); }
}

function showError(jqXHR, textStatus, errorThrown){
	$("#errorDispl").text("Error: " + jqXHR.responseJSON.message);
}
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
function summaryViewUpdate(){
	let deviceId = {deviceId: $("#deviceId").val()};

	$.ajax({
		url: "/devices/summary", //Need Ali to finish this endpoint
		method: 'GET',
		contentType: 'application/json',
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	})
		.done(function(data, textStatus, jqXHR){

		// Need Ali to finish endpoint to get data


		})
		.fail(function(jqXHR, textStatus, errorThrown){

		});

}

function activitySummaryUpdate(){

}

function activityDetailsUpdate(userSpeed, uv, startTime, endTime, duration, activityType){
	let speedData = [];
	// Iterate through userSpeed array and store each value as an object {y: speed}
	// because CanvaJS takes data as an array w/ object elements (i.e. [{y:1}, {y:2}, ...])
	for(var speed of userSpeed){
		var tempSpeedObj = {y: speed};
		speedData.push(tempSpeedObj);
	}

	// Then graph data using CanvasJS
	var speedChart = new CanvasJS.Chart("speedChart", {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "Speed During Activity"
		},
		axisY:{
			title: "Speed (mph)",
			includeZero: false
		},
		axisX:{
			title: "Time (min)"
		},
		data: [{
			type: "line",
			dataPoints: speedData
		}]
	});
	speedChart.render();

	//


	//same for uv index
	let uvData = [];
	// Iterate through uv array
	for(var uvIndex of uv){
		var tempUVObj = {y: uvIndex};
		speedData.push(tempUVObj);
	}

	// Then graph data using CanvasJS
	var uvChart = new CanvasJS.Chart("uvChart", {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "UV Exposure During Activity"
		},
		axisY:{
			title: "UV (WRITE UNITS HERE)",
			includeZero: false
		},
		axisX:{
			title: "Time (min)"
		},
		data: [{
			type: "line",
			dataPoints: uvData
		}]
	});
	uvChart.render();


}
////////////////////////////////////////////////////////////////////////////////////






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

	 $.ajax({
		url: "/users/account", //Need Ali to finish this endpoint
		method: 'GET',
		contentType: 'application/json',
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	 })
	 .done(showData)
	 .fail(function(jqXHR, textStatus, errorThrown){

	 });


	$('.collapsible').collapsible();
	$('.dropdown-trigger').dropdown();
	$('.tabs').tabs(); //duration, onShow, swipeable, responsiveThreshold



	//let deviceId = {deviceId: $("#deviceId").val()};

	//$('#registerDevice').click(showData);


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

	 $("#weatherReport").click(function(){
		window.location = "weatherReport.html"; // Take user back to log in page
	});

});
