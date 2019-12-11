
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

	// longitude, letitude,
	//console.log(data[data.length - 1]);
	let dataDispl = "<ul>" +
	"<li>" + (data[data.length - 1].longitude).toString() + "</li>" +
	"<li>" + (data[data.length - 1].latitude).toString() + "</li>" +
	"<li>" + (data[data.length - 1].speed).toString() + "</li>" +
	"<li>" + (data[data.length - 1].uvIndex).toString() + "</li>" +
	"</ul>";

	$("#dataDispl").html(dataDispl);
}

function showError(jqXHR, textStatus, errorThrown){
	$("#errorDispl").text("Error: " + jqXHR.responseJSON.message);
}
///////////////////////////////////////////////////////////////////////////////////////


$(function () {

	// This is to take user back to login page if they haven't logged in yet
	// if(!window.localStorage.getItem('authToken')){
	// 	window.location = "login.html";
	// }

	$('.collapsible').collapsible();
	$('.dropdown-trigger').dropdown();
	$('.tabs').tabs(); //duration, onShow, swipeable, responsiveThreshold 
	// var weeklySummary = M.Tabs.init(document.getElementById('weekSummary'));
	// weeklySummary.select('weekSummary');


	$("#showData").click(showData);


	$('#regDevicePage').click(function(){
		window.location = "regDevice.html";
	});


	// This is for the user to log out of their account
	 $("#logOut").click(function(){
	 	window.localStorage.removeItem('authToken'); // This is to remove the authToken
	 	window.location = "login.html"; // Take user back to log in page
	 });

});
