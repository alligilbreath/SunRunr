//Global Variables
///////////////////////////////////////////////////
var avgWeight = 62; //kgrams
var walkMET = 6.0;
var joggMET = 8.3;
var bicyclingMET = 7.5;

var walkCalPerHour = avgWeight * walkMET;
var jogCalPerHour = avgWeight * joggMET;
var bicycleCalPerHour = avgWeight * bicyclingMET;

//Default Device ID for testing
var device = "3a0030001851373237343331";
///////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
function showData(data, textStatus, jqXHR){
	if(data != null){
		let deviceId = {deviceId: data.devices[0].deviceId};

		// Make buttons for different devices here
		var email = data.email; // old version: data[data.length - 1].email
		var fullName = data.fullName; // old version: data[data.length - 1].fullName
		var lastAccess = data.lastAccess; // old version: data[data.length - 1].lastAccess

		$('#email').html(email);
		$('#fullName').html(fullName);
		$('#lastAccess').html(lastAccess);
		//let deviceInfo = {'deviceId' : deviceId};
		$.ajax({
			url: "/devices/sensorData", //TODO: Clarify actual url endpoint
			method: 'GET', // TODO: Why is it a POST. Shouldn't it be a GET?
			contentType: 'application/json',
			data: JSON.stringify(deviceId),
			headers: { 'x-auth': window.localStorage.getItem("authToken") },
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
	if(data != null){
		var userSpeed = data[data.length - 1].speed;// The entire array of speed; TODO: gonna need to parse this data and store it in a new variable (an array with object elements: [{y: 0}]) for CanvasJS
		var uv = data[data.length - 1].uvIndex; 	// The entire array of uvIndex; TODO: gonna need to parse this data and store it in a new variable (an array with object elements: [{y: 0}]) for CanvasJS
		var startTime = data[data.length - 1].startTime;
		var endTime = data[data.length - 1].endTime;
		var duration = data[data.length - 1].duration; // TODO: What are the units?
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
	$("#errorDispl").text("Error: " + jqXHR.responseJson.message);
}
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
function summaryViewUpdate(){

	$.ajax({
		url: "/devices/summary",
		method: 'GET',
		contentType: 'application/json',
		data: JSON.stringify(deviceId),
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	})
		.done(function(data, textStatus, jqXHR){

			var showWeekData = "";

			let showDuration = data.duration;

			let calBurnedWeek = 0;

			for(var i = 0; i < data.dataPoints.length; i++){
				let timeDuration = data.dataPoints[i].duration * (1/1000) * (1/60) * (1/60);

				if(data.dataPoints[i].activityType == "bicycling"){
					calBurnedWeek += bicycleCalPerHour * timeDuration;
				}
				else if(data.dataPoints[i].activityType == "jogging"){
					calBurnedWeek += jogCalPerHour * timeDuration;

				}
				// walking as else
				else{ calBurnedWeek += walkCalPerHour * timeDuration; }
			}

			showWeekData = "<ul>"
			+ "<li> Total Time Spent Exercising " + showDuration + "</li>"
			+ "<li> Total Calories Burned " + calBurnedWeek + "</li>"
			+ "<li> Total UV Exposure " + data.uv + "</li>"
			+"</ul>";

			$('#summaryView').html(showWeekData);

		})
		.fail(function(jqXHR, textStatus, errorThrown){

		});

}

function activitySummaryUpdate(){
	$.ajax({
		url: "/devices/sensorData",
		method: "GET",
		contentType: 'application/json',
		data: {deviceId: device},
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	})
	.done(function(data, textStatus, jqXHR){
		var innerHTML = "";
		for(var i = 0; i < data.length; i++){
			var activityType = data[i].activityType;
			var date = data[i].startTime;
			var dateString = date.toString();
			var duration = data[i].duration;
			var uvexposure = data[i].uvIndex[0];
			var temp = data[i].temperature;
			var humid = data[i].humidity;
			let timeDuration = duration * (1/1000) * (1/60) * (1/60);
			if(data[i].activityType == "bicycling"){
				calBurned += bicycleCalPerHour * timeDuration;
			}
			else if(data[i].activityType == "jogging"){
				calBurned += jogCalPerHour * timeDuration;

			}
			// walking as else
			else{ calBurned += walkCalPerHour * timeDuration; }
		}
			innerHTML += "<li class=\"collection-item\"> Activity: " + activityType + "</li>";
			innerHTML += "<li class=\"collection-item\"> Date: " + dateString + "</li>";
			innerHTML += "<li class=\"collection-item\"> Duration [ms]: " + duration + "</li>";
			innerHTML += "<li class=\"collection-item\"> Calories: " + calBurned + "</li>";
			innerHTML += "<li class=\"collection-item\"> UV exposure: " + uvexposure + "</li>";
			innerHTML += "<li class=\"collection-item\"> Temperature: " + temp + "</li>";
			innerHTML += "<li class=\"collection-item\"> Humidity:  " + humid + "</li>";
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){

	});
}

function activityDetailsUpdate(userSpeed, uv, startTime, endTime, duration, activityType){

	$.ajax({
		url: "/devices/activityDetail", //TODO: Clarify actual url endpoint
		method: 'GET', // TODO: Why is it a POST. Shouldn't it be a GET?
		contentType: 'application/json',
		data: {deviceID : device},
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	})
	.done(function(data, textStatus, jqXHR){

		let durationMin = data.duration * (1/1000) * (1/60);
		let durationHour = data.duration * (1/1000) * (1/60) * (1/60);
		let caloriesBurned = 0;

		if(data.activityType == "bicycling"){
			caloriesBurned = bicycleCalPerHour * durationHour;
		}
		else if(data.activityType == "jogging"){
			caloriesBurned = jogCalPerHour * durationHour;

		}
		// walking as else
		else{ caloriesBurned = walkCalPerHour * durationHour; }


		let dispData = "<ul>"
		+ "<li>Date: " + data.startTime + "</li>"
		+ "<li>Duration (Minutes): " + durationMin + "</li>"
		+ "<li>Temperature: " + data.temperature + "</li>"
		+ "<li>Humidity: " + data.humidity + "</li>"
		+ "<li>Activity Type: " + data.activityType + "</li>"
		+ "<li>Calories Burned: " + caloriesBurned + "</li>"
		+ "</ul>";

		$('#activityData').html(dispData);



		// Graphing Speed and UV Exposure
		////////////////////////////////////////////////////////////////////////////////////////////
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
			uvData.push(tempUVObj);
		}

		// Then graph data using CanvasJS
		var uvChart = new CanvasJS.Chart("uvChart", {
			animationEnabled: true,
			theme: "light2",
			title:{
				text: "UV Exposure During Activity"
			},
			axisY:{
				title: "UV",
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
		////////////////////////////////////////////////////////////////////////////////////////////





	})
	.fail(function(jqXHR, textStatus, errorThrown){

	});

}





////////////////////////////////////////////////////////////////////////////////////






/* TODO: Perhaps try to instead of having the user always enter their device ID to get their data,
maybe try to automatically get their first device id and then grab all of the data to be displayed
on the $(function(){}) below (before page load). This would mean changing the /devices/sensorData endpoint to a GET
OR creating the same /devices/sensorData endpoint but as a GET */
$(function () {

	// TODO: Uncomment code below and else statement when everything works
	// This is to take user back to login page if they haven't logged in yet
	/* if(!window.localStorage.getItem('authToken')){
	 	window.location = "login.html";
	 }*/
	 $.ajax({
		url: "/users/account",
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
	//}
});
