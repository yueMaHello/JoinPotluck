
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    accessKeyId: "AKIASFEGCKK5QOC2EHKO",
    secretAccessKey: "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"
});

// Initialize and add the map
function initMap() {
  var center = {lat: 40, lng: -74};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 13, center: center});

  var apigClient = apigClientFactory.newClient({
    apiKey:'Yxfe8Gujtf5V1TCysH0Lg3I3ec95alnV8zcAqkqf'
  });
  var params = {};
  var body = {};
  var additionalParams = {};
  apigClient.getalleventsPost(params, body, additionalParams)
  .then (function(response) {
      var data = response['data'];
      var windows = [];
      for (var i = 0; i < data.length; i++) {
    
        var addr = 'https://maps.googleapis.com/maps/api/geocode/json?address='+data[i]['Address']['S']+'&key=AIzaSyCXM-hS25ZNYn0lwafz5Pd8pM38BqTJc-w';
        var addrHttp = new XMLHttpRequest();
        addrHttp.open( "GET", addr, false ); // false for synchronous request
        addrHttp.send( null );
        var addrResponse = JSON.parse(addrHttp.responseText);
        var latLng = new google.maps.LatLng(addrResponse['results'][0]['geometry']['location']['lat'],addrResponse['results'][0]['geometry']['location']['lng']);
        // console.log(addrResponse['results'][0]['geometry']['location']['lat'],addrResponse['results'][0]['geometry']['location']['lng']);
        var marker = new google.maps.Marker({position: latLng, map: map});

        map.setCenter(marker.getPosition());

        var contentString = '<div id="content">'+'<h2>'+data[i]['EventName']['S']+'</h2>Time: '+data[i]['Time']['S']+'<br>Address: '+data[i]['Address']['S']+'<br>Host ID: '+data[i]['HosterID']['S']+'<br><!-- Alert --><div class="alert alert-danger" style="display:none;" id="operationAlert"><button type="button" class="close" onclick="closeAlertMessage()">&times;</button><span></span></div><button type="button" class="btn btn-primary" id="joinEvent" onclick="joinEvent(\''+data[i]['EventID']['S']+'\')" style="margin-right:10px; float:right">Join Selected Event</button></div>';
        var infoWindow = new google.maps.InfoWindow();
        windows.push(infoWindow);
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infoWindow){ 
            return function() {
                for (var j = 0; j < windows.length; j++) {
                  windows[j].close();
                }
                infoWindow.setContent(contentString);
                infoWindow.open(map,marker);
            };
        })(marker,contentString,infoWindow)); 
      };  
  }).catch( function(response) {
      console.log("Error");
  });
};
function showAlertMessage(alertType, message) {
    $("#operationAlert span").remove();
    $("#operationAlert").attr('class', "alert alert-" + alertType);
    $("#operationAlert button").after('<span>' + message + '</span>');
    $("#operationAlert button").remove();
    $("#operationAlert").fadeIn('slow');
    $("#operationAlert").show();
};

function closeAlertMessage() {
    $("#operationAlert span").remove();
    $("#operationAlert").hide();
};
function joinEvent(eventID) {
  var poolData = {
    UserPoolId: "us-east-1_r5CMTSAmY",
    ClientId: "l8u78nbg7p92hhhclgt467jsa"
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var cognitoUser = userPool.getCurrentUser();
  var apigClient = apigClientFactory.newClient({
    apiKey:'Yxfe8Gujtf5V1TCysH0Lg3I3ec95alnV8zcAqkqf'
  });
  var params = {};
  var body = {"EventID": eventID, "UserID": cognitoUser.username};
  var additionalParams = {};
  apigClient.joinaneventPost(params, body, additionalParams)
  .then (function(response) {
    message = "<strong>Success</strong>: Successfully joined event!" ;
    showAlertMessage("success", message);
  }).catch( function(response) {
    message = "<strong>Failure</strong>: Failed to join the event.";
    showAlertMessage("danger", message);
  });
}