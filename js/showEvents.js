AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
 
});


$(document).ready(function() {
    var poolData = {
        UserPoolId: "us-east-1_r5CMTSAmY",
        ClientId: "l8u78nbg7p92hhhclgt467jsa"
      };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.log(userPool);
    var cognitoUser = userPool.getCurrentUser();
    var key = "CognitoIdentityServiceProvider.l8u78nbg7p92hhhclgt467jsa."+cognitoUser.username+".accessToken";
    var params = {
      AccessToken: cognitoUser.storage[key] /* required */
    };
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        var name = data.UserAttributes[2].Value;
        console.log(name);           // successful response
      }
    });

    var apigClient = apigClientFactory.newClient({
        // deleted by cz2574
    });
    var params = {};
    var body = {"UserID": cognitoUser.username};
    console.log(cognitoUser.username);
    var additionalParams = {};
    apigClient.finduserhostingeventsPost(params, body, additionalParams)
    .then (function(result) {
        console.log(result);
    }).catch( function(result) {
        console.log("Error");
    });

});
