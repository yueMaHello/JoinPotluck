AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({

});

function submitEvent() {
	let theme = $("#theme").val();
    let time = $("#time").val();
	let location = $("#location").val();
	let PublicOrNot = false;

	var radio = document.getElementsByName("publicOrNot");
	for (i=0; i<radio.length; i++) {
		if (radio[i].checked) {
			if (radio[i].value == "true") {
				PublicOrNot = true;
			}

		}
	}

	var poolData = {
        UserPoolId: "us-east-1_r5CMTSAmY",
        ClientId: "l8u78nbg7p92hhhclgt467jsa"
      };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.log(userPool);
    var cognitoUser = userPool.getCurrentUser();

	var apigClient = apigClientFactory.newClient({
        //
    });
    var params = {};
    // get lat and long for the address
    var addr = 'https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&key=AIzaSyCXM-hS25ZNYn0lwafz5Pd8pM38BqTJc-w';
    var addrHttp = new XMLHttpRequest();
    addrHttp.open( "GET", addr, false ); // false for synchronous request
    addrHttp.send( null );
    var addrResponse = JSON.parse(addrHttp.responseText);
    var body = {
	  "Address": location,
	  "EventName": theme,
	  "HosterID": cognitoUser.username,
	  // save the lat and long for this address
	  "Lat": addrResponse['results'][0]['geometry']['location']['lat'].toString(),
	  "Long": addrResponse['results'][0]['geometry']['location']['lng'].toString(),
	  "PublicOrNot": PublicOrNot,
	  "Time": time
	};
    console.log(cognitoUser.username);
    var additionalParams = {};
    apigClient.hostaneventPost(params, body, additionalParams)
    .then (function(result) {
        message = "<strong>Success</strong>: Successfully created an event!" ;
    	showAlertMessage("success", message);
  	}).catch( function(response) {
	    message = "<strong>Failure</strong>: Failed to create an event.";
	    showAlertMessage("danger", message);
  	});
	
}

function showAlertMessage(alertType, message) {
    $("#operationAlert span").remove();
    $("#operationAlert").attr('class', "alert alert-" + alertType);
    $("#operationAlert button").after('<span>' + message + '</span>');
    $("#operationAlert").fadeIn('slow');
    $("#operationAlert").show();
}

function closeAlertMessage() {
    $("#operationAlert span").remove();
    $("#operationAlert").hide();
}
