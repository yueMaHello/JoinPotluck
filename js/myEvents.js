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
    // console.log(userPool);
    var cognitoUser = userPool.getCurrentUser();
    // console.log(cognitoUser);


    var apigClient = apigClientFactory.newClient({
        apiKey: 'Yxfe8Gujtf5V1TCysH0Lg3I3ec95alnV8zcAqkqf'
    });
    var params = {};
    var body = { "UserID": cognitoUser.username };
    // console.log(cognitoUser.username);
    var additionalParams = {};
    var response = [];
    apigClient.finduserhostingeventsPost(params, body, additionalParams)
        .then(function(result) {
            response = result.data;
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                // console.log(response[i]);
                var address = response[i].Address
                console.log(address)
                var eventName = response[i].EventName
                var members = response[i].Members
                var publicOrNot = response[i].PublicOrNot
                var time = response[i].Time
                var mems = "";
                for (var j = 0; j < members.length; j++) {
                    mems += members[j] + " ";
                }
                var newCard =  "<div class=\"col\"> \
											<div class=\"card\" style=\"width: 18rem;\"> \
												<div class=\"card-body\" id=\"" + eventName +"\"> \
													<h5 class=\"card-title\">EventName :" + eventName + "</h5> \
													<p class=\"card-text\">Address :" + address + "</p> \
													<p class=\"card-text\">Time :" + time + "</p> \
													<p class=\"card-text\">Members :" + mems + "</p> \
												</div> \
											</div> \
										</div>\
                                </div>"
                $("#row1").append(newCard);
            }
        }).catch(function(result) {
            console.log(result);
        });
});