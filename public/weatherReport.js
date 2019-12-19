function showWeather(data, textStatus, jqXHR){

	let today = "<ul>" +
	"<li>Temperature [K]: " + data.forecast[0].main.temp +
	"<li>UV " + 6.0 +
	"<li>Humidity: " + data.forecast[0].main.humidity +
	"<li>Weather: " + data.forecast[0].weather[1].description +
	+ "</ul>";

	let day2 = "<ul>" +
	"<li>Temperature [K]: " + data.forecast[1].main.temp +
	"<li>UV " + 7.2 +
	"<li>Humidity: " + data.forecast[1].main.humidity +
	"<li>Weather: " + data.forecast[1].weather[0].description +
	"</ul>";

	let day3 = "<ul>" +
	"<li>Temperature [K]: " + data.forecast[2].main.temp +
	"<li>UV " + 6.9 +
	"<li>Humidity: " + data.forecast[2].main.humidity +
	"<li>Weather: " + data.forecast[2].weather[0].description +
	"</ul>";

	let day4 = "<ul>" +
	"<li>Temperature [K]: " + data.forecast[3].main.temp +
	"<li>UV " + 6.5 +
	"<li>Humidity: " + data.forecast[3].main.humidity +
	"<li>Weather: " + data.forecast[3].weather[0].description +
	"</ul>";

	let day5 = "<ul>" +
	"<li>Temperature [K]: " + data.forecast[4].main.temp +
	"<li>UV " + 7.9 +
	"<li>Humidity: " + data.forecast[4].main.humidity +
	"<li>Weather: " + data.forecast[4].weather[0].description +
	"</ul>";



	$('#today').html(today);
	$('#day2').html(day2);
	$('#day3').html(day3);
	$('#day4').html(day4);
	$('#day5').html(day5);





}



$(function(){




    $.ajax({
		url: "/devices/weather", //Need Ali to finish this endpoint
		method: 'GET',
		contentType: 'application/json',
		headers: { 'x-auth': window.localStorage.getItem("authToken") },
		dataType: 'json'
	})
	.done(showWeather)
	.fail(function(jqXHR, textStatus, errorThrown){

	});


    $('.tabs').tabs();
	$('.dropdown-trigger').dropdown();

	$('#Home').click(function(){
		window.location = "userPage.html"; // Take user back to their main page
	});
});
