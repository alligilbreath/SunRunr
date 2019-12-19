function showWeather(data, textStatus, jqXHR){

	let today = "<ul>" +
	"<li>Temperature: " + data[0].main.temp +
	"<li>UV" + 6.0 +
	"<li>Humidity: " + data[0].main.humidity +
	"<li>Weather" + data[0].weather.main +
	+ "</ul>";

	let day2 = "<ul>" + ""
	"<li>Temperature: " + data[1].main.temp +
	"<li>UV" + 7.2 +
	"<li>Humidity: " + data[1].main.humidity +
	"<li>Weather" + data[1]weather.main +
	"</ul>";

	let day3 = "<ul>" +
	"<li>Temperature: " + data[2].main.temp +
	"<li>UV" + 6.9 +
	"<li>Humidity: " + data[2].main.humidity +
	"<li>Weather" + data[2].weather.main +
	"</ul>";

	let day4 = "<ul>" + ""
	"<li>Temperature: " + data[3].main.temp +
	"<li>UV" + 6.5 +
	"<li>Humidity: " + data[3].main.humidity +
	"<li>Weather" + data[3].weather.main +
	"</ul>";

	let day5 = "<ul>" + ""
	"<li>Temperature: " + data[4].main.temp +
	"<li>UV" + 7.9 +
	"<li>Humidity: " + data[4].main.humidity +
	"<li>Weather" + data[4].weather.main +
	"</ul>";



	('#today').html(today);
	('#day2').html(day2);
	('#day3').html(day3);
	('#day4').html(day4);
	('#day5').html(day5);





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
