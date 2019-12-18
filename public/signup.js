function sendRegisterRequest() {
  let email = $('#newEmail').val();
  let userFullName = $("#newFullName").val();
  let password = $('#makePassword').val();
  let passwordConfirm = $('#reenterPassword').val();
  
  
  // Check to make sure the passwords match
  if (password != passwordConfirm) {
    $('#ServerResponse').text("Passwords do not match");
    $('#ServerResponse').show();
    return;
  }
  
  // TODO: Check if RegEx below works properly
  // Could make password have at least one upper case letter, one lower case letter, at least one number, and at least one random character 
  // ex: Jello1#, H4p&py, $2Meep, HELlo432%
  let goodPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
  let doesMatch = goodPassword.exec(password);
  // Found this regEx at: https://riptutorial.com/regex/example/18996/a-password-containing-at-least-1-uppercase--1-lowercase--1-digit--1-special-character-and-have-a-length-of-at-least-of-10
  if(doesMatch == null){
	  
	  let passwordNeeded = "Password not strong enough. Must have the following: " + 
	  "<ul>" +
	  "<li>at least one upper case letter</li>" + 
	  "<li>at least one lower case letter</li>" +
	  "<li>at least one number</li>" +
	  "<li>at least one symbol</li>" +
	  "</ul>" +
	  "ie) Jello1#, H4p&py, $2Meep, HELlo432%";
	  
    $("#ServerResponse").text(passwordNeeded);
    $("#ServerResponse").show();
	  return;
  }
  
  let newAccountInfo = {email: email, fullName: userFullName, password: password};
  
  $.ajax({
   url: "/users/register", //TODO: Clarify actual url endpoint
   method: 'POST',
   contentType: 'application/json',
   data: JSON.stringify(newAccountInfo),
   dataType: 'json'
  })
    .done(makeNewAcc)
    .fail(registerError);
}

function makeNewAcc(data, textStatus, jqXHR) {
	
	$("#ServerResponse").html("<span style='color: green'>" + jqXHR.responseJSON.message + "</span>");
	$("#ServerResponse").show();
	// Is it same as from login.js?
	//TODO: Under router.post('/register'...){...} of routes/user.js, shouldn't there be an authToken?
	window.localStorage.setItem('authToken', data.authToken);
	window.location = "userPage.html";
}

function registerError(jqXHR, textStatus, errorThrown) {
  $("#ServerResponse").text("Error: " + jqXHR.responseJSON.message);
  $("#ServerResponse").show();
}


$(function () {
  $('#signUp').click(sendRegisterRequest);
  $("#homePage").click(function(){
    window.location = "login.html";
  });
});
