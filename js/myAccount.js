AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    accessKeyId: "AKIASFEGCKK5QOC2EHKO",
    secretAccessKey: "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"
});

let cognitoUser;

$(document).ready(function() {
	var poolData = {
	    UserPoolId: "us-east-1_r5CMTSAmY",
	    ClientId: "l8u78nbg7p92hhhclgt467jsa"
	  };
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	// console.log(userPool);
	cognitoUser = userPool.getCurrentUser();
	var key = "CognitoIdentityServiceProvider.l8u78nbg7p92hhhclgt467jsa."+cognitoUser.username+".accessToken";
    var params = {
      AccessToken: cognitoUser.storage[key] /* required */
    };
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    var name;
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        name = data.UserAttributes[2].Value;
        console.log(name);           // successful response
      }
    });
	// var keys = Object.keys(cognitoUser.storage)
	// console.log(keys[0]);
	// console.log(cognitoUser.storage[keys[0]])


	var apigClient = apigClientFactory.newClient({
	    apiKey:'Yxfe8Gujtf5V1TCysH0Lg3I3ec95alnV8zcAqkqf'
	});
	var params = {};
	var body = {"UserID": cognitoUser.username};
	var email = cognitoUser.username;
	var additionalParams = {};
	apigClient.finduserhostingeventsPost(params, body, additionalParams)
	.then (function(result) {
	    // console.log(response);
		var info = "<div>\
					  <div class=\"container\">\
					    <h1 class=\"display-4\">Name: " + name +" </h1>\
					    <p class=\"lead\">Email: " + email + "</p>\
					  </div>\
					</div>"
		  $("#userInfo").append(info);
	}).catch( function(result) {
	    console.log("Error");
	});	
});

function logout(){
	console.log(cognitoUser)
	if (cognitoUser) {
            cognitoUser.signOut();
            location.href = "../index.html"
            return;
    } else {
    	alert("The user is not logged in.")
    }
}





// var cognitoUser = userPool.getCurrentUser();
//     var key = "CognitoIdentityServiceProvider.l8u78nbg7p92hhhclgt467jsa."+cognitoUser.username+".accessToken";
//     var params = {
//       AccessToken: cognitoUser.storage[key] /* required */
//     };
//     var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
//     cognitoidentityserviceprovider.getUser(params, function(err, data) {
//       if (err) console.log(err, err.stack); // an error occurred
//       else {
//         var name = data.UserAttributes[2].Value;
//         console.log(name);           // successful response
//       }
//     });