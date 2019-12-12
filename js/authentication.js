AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    accessKeyId: "AKIASFEGCKK5QOC2EHKO",
    secretAccessKey: "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"
});


function getPoolData() {
    return {
        UserPoolId: 'us-east-1_r5CMTSAmY',
        ClientId: 'l8u78nbg7p92hhhclgt467jsa'
    };
}

let userPool;

function getUserPool() {
    if (userPool === undefined) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(getPoolData());
    }
    return userPool;
}

let cognitoUser;

function getUser(userName) {
    if (cognitoUser === undefined) {
        let userData = {
            Username: userName,
            Pool: getUserPool()
        };
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    }
    return cognitoUser;
}


function signUpUser(email, name, phone, password, callback) {
    let dataEmail = {
        Name: 'email',
        Value: email
    };
    let dataName = {
        Name: 'name',
        Value: name
    };
    let dataPhone = {
        Name: 'phone_number',
        Value: phone
    };
    let attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail),
        new AmazonCognitoIdentity.CognitoUserAttribute(dataName),
        new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone)];


    let userPool = getUserPool();
    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            cognitoUser = result.user;
            callback(null, result);
        }
    });
}

function confirmUser(userName, code, callback) {
    getUser(userName).confirmRegistration(code, true, callback);
}


function wrapCallback(callback) {
    return {
        onFailure: (err) => {
            callback(err, null);
        },
        onSuccess: (result) => {
            callback(null, result);
            location.href = '../html/dashboard.html';
        }
    };
}


function signInUser(userName, password, callback) {
    let authenticationData = {
        Username: userName,
        Password: password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    getUser(userName).authenticateUser(authenticationDetails, wrapCallback(callback));
}


function signOutUser(callback) {
    if (cognitoUser) {
        if (cognitoUser.signInUserSession) {
            cognitoUser.signOut();
            callback(null, {});
            return;
        }
    }
    callback({name: "Error", message: "User is not signed in"}, null);
}

function userAttributes(updateCallback) {
    if (cognitoUser) {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                updateCallback({});
                return;
            } else {
                let userInfo = {name: cognitoUser.username};
                for (let k = 0; k < result.length; k++) {
                    userInfo[result[k].getName()] = result[k].getValue();
                }
                updateCallback(userInfo);
            }
        })
    } else {
        updateCallback({});
    }
}


function updateAttributes(attributes, callback) {
    let attributeList = [];
    for (key in attributes) {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: key,
            Value: attributes[key]
        }));
    }

    cognitoUser.updateAttributes(attributeList, callback);
}