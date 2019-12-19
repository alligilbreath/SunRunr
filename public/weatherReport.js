function showWeather(data, textStatus, jqXHR){

	let today = "<ul>" + 
	"Temperature: " +
	"" +
	 
	+ "</ul>";

	let day2 = "<ul>" + "" 
	"" +
	+ "</ul>";

	let day3 = "<ul>" + "" 
	"" +
	+ "</ul>";

	let day4 = "<ul>" + "" 
	"" +
	+ "</ul>";

	let day5 = "<ul>" + "" 
	"" +
	+ "</ul>";



	('#today').html();
	('#day2').html();
	('#day3').html();
	('#day4').html();
	('#day5').html();





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