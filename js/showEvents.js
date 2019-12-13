AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    accessKeyId: "AKIASFEGCKK5QOC2EHKO",
    secretAccessKey: "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"
});


$(document).ready(function() {
    var poolData = {
        UserPoolId: "us-east-1_r5CMTSAmY",
        ClientId: "l8u78nbg7p92hhhclgt467jsa"
      };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.log(userPool);
    var cognitoUser = userPool.getCurrentUser();
    console.log(cognitoUser);


    var apigClient = apigClientFactory.newClient({
        apiKey:'Yxfe8Gujtf5V1TCysH0Lg3I3ec95alnV8zcAqkqf'
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