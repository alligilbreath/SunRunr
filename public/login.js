function verifyLogIn(){ // Verify that user email and password entered exists in database using ajax from client-side to server-side/database
	
	let userEmail = $("#email").val();
	let userPassword = $("#userPassword").val();
	
	let infoToPass = {email: userEmail, password: userPassword};
	// TODO:
	$.ajax({
		//  TODO: IS IT "routes/users/signin" ?
		url: "/users/signin", //TODO: What is the specific url/endpoint needed for routes/users.js?
		method: "POST", // POST as mentioned in the the user.js routes file
		contentType: "application/json",
		data: JSON.stringify(infoToPass),
		dataType: "json"
	})
	.done(redirectToAccount)
	.fail(incorrectLogIn);
	
}
	
	// This function is called when user email and password exist in database, sending user to their Account page
	function redirectToAccount(data, textSatus, jqXHR){ 
		// TODO: Set up user authentication token(?) ANSWER: probably not... already made in routes.users.js
		
		window.localStorage.setItem('authToken', data.authToken);
		window.location = "userPage.html";
	}
	
	
	// This function is called when user email or password do NOT exist in database, warning user to retype email and password again
	function incorrectLogIn(jqXHR, textStatus, error){
		
		// If 4XX status code thrown 
		// NOTE: This might be redundant, since in the routes file, there's a res.status(400) for missing email or password
		if(jqXHR.statusCode == 401){ $("#errorMsg").text("Error" + jqXHR.responseJSON.message);	}
		
		// If user email and password don't exist
		else{ $("#errorMsg").text("Error" + jqXHR.responseJSON.message); }
	}
	

//Handle authentication on page load
$(function() {  

  // TODO: rewrite this, as this was taken from Holz example, and review user authentication chapter on Zybooks
  // Redirect user to their page if they haven't closed their window yet (I think...?)
  if( window.localStorage.getItem('authToken')) { 
    window.location = 'userPage.html';
  }
  
  else {
	  
	// This is if user decides to press enter while on password textbox
    $('#UserPassword').keypress(function(event) {
        if( event.which === 13 ) { // event.which = 13 --> checks if enter key was pressed (while on password textbox)
           verifyLogIn();
        }
    });
    
    // Verify user email and password when Log In button is clicked
    $("#submit").click(verifyLogIn); 

    // Redirect user to create a new account when clicked on the Make a New Account button
    $("#newAcc").click(function(){
    	window.location = "signup.html";
    });
  }
});


