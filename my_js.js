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
var myUuid = localStorage.getItem('myUuid');
// Validating Empty Field
function check_empty() 
{
  var info = document.forms["form"]["info"].value;
  var disaster = document.forms["form"]["disaster"].value;

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
alert("Information has been sent...Thank you!!");

if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
         window.alert("Geolocation is not supported by this browser.");
    }


    function showPosition(position){
      
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      var dt = new Date();
      var utcDate = dt.toUTCString();

      var database = firebase.database();

      var ref = database.ref('location');

      var data = {
        latitude: lat,
        longitude: lon,
        typeDisaster: type,
        uuid: myUuid,
        information: info,
        date: utcDate
      }
      ref.push(data);
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

    