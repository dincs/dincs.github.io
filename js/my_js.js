 // Initialize Firebase
var config = {
    apiKey: "AIzaSyAI4vwpS8NGVIZcDeiZtY0ZHsZdRE-mhLs",
    authDomain: "real-time-tracking-bcce8.firebaseapp.com",
    databaseURL: "https://real-time-tracking-bcce8.firebaseio.com",
    projectId: "real-time-tracking-bcce8",
    storageBucket: "real-time-tracking-bcce8.appspot.com",
    messagingSenderId: "906782233166"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var ref = database.ref('location');

var myUuid = localStorage.getItem('myUuid');
// Validating Empty Field
function check_empty() 
{
  var info = document.getElementById("info").value;
  var disaster = document.getElementById("disaster").value;

  if (disaster==""||info=="") {
  alert("ERROR! Please send again!");
  return false;
}

else {
var test = document.getElementsByName("disaster");
for (var i = 0, length = test.length; i < length; i++) {
        if (test[i].checked) {
            var type = test[i].value;
            break;
        }
    }
//document.getElementById('form').submit();


if (navigator.geolocation) {

navigator.geolocation.getCurrentPosition(
        function(position) {
             lat = position.coords.latitude;
              lon = position.coords.longitude;
              var dt = new Date();
              var utcDate = dt.toUTCString();

              var data = {
                latitude: lat,
                longitude: lon,
                typeDisaster: type,
                uuid: myUuid,
                information: info,
                date: utcDate
              }
              ref.push(data);

      alert("Information has been sent...Thank you!!");
        },
        function errorCallback(error) {
            alert("Failed!");
        },
        {
            enableHighAccuracy: true,
            maximumAge:Infinity,
            timeout:5000
        }
    );
    } 

    else { 
         geolocFail();
         window.alert("Geolocation is not supported by this browser.");
    }

    
}



}

//Function To Display Popup
function div_show() {
document.getElementById('abc').style.display = "block";
}
//Function to Hide Popup
function div_hide(){
document.getElementById('abc').style.display = "none";
}

 
// store current location with information regarding disaster into firebase

    