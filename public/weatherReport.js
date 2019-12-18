function showWeather(data, textStatus, jqXHR){








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