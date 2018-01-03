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

 function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var myUuid = localStorage.getItem('myUuid');
if (!myUuid) {
  myUuid = guid();
  localStorage.setItem('myUuid', myUuid);
}



  var database = firebase.database();


// Validating Empty Field
function check_empty() 
{
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var conNumber = document.getElementById("conNumber").value;
  var cas = document.getElementById("cas").value;

var uNeed = new Array();
      for(var i=0;i<2;++i){
        var urgentNeed = document.getElementById("urgentNeed"+i);
        if(urgentNeed.checked){
          uNeed.push(urgentNeed.value);
        }
      }

var nMedic = new Array();
      for(var i=0;i<2;++i){
         var needMedic = document.getElementById("needMedic" +i);
        if(needMedic.checked){
          nMedic.push(needMedic.value);
        }
      }

var type = new Array();
      for(var i=0;i<2;++i){
        var disasterType = document.getElementById("disaster" +i);
            if (disasterType.checked) {
                            type.push(disasterType.value);
                        }
        }

if(type==""){
  alert("ERROR! Please select image !");
  return false;
}
else if (name=="") {
  alert("ERROR! Please enter name !");
  document.getElementById("name").focus();
  return false;
}
else if (age=="") {
  alert("ERROR! Please enter age  !");
  document.getElementById("age").focus();
  return false;
}
else if (isNaN(age)) {
  alert("ERROR! Please enter number only!");
  document.getElementById("age").focus();
  document.getElementById("age").value="";
  return false;
}
else if (conNumber=="") {
  alert("ERROR! Please enter contact number !");
  document.getElementById("conNumber").focus();
  return false;
}
else if (isNaN(conNumber)) {
  alert("ERROR! Please enter number only!");
  document.getElementById("conNumber").focus();
  document.getElementById("conNumber").value="";
  return false;
}

else if (uNeed=="") {
  alert("ERROR! Please select urgent need !");
  return false;
}
else if (cas=="") {
  alert("ERROR! Please enter number of people injured !");
  document.getElementById("cas").focus();
  return false;
}

else if (isNaN(cas)) {
  alert("ERROR! Please enter number only");
  document.getElementById("cas").focus();
  document.getElementById("cas").value="";
  return false;
}

else if (nMedic=="") {
  alert("ERROR! Please select if there any need of medication !");
  return false;
}

else {
var displayName = localStorage.setItem("name", name);
var displayAge = localStorage.setItem("age", age);
var displayContact = localStorage.setItem("conNumber", conNumber);
var displayuNeed = localStorage.setItem("uNeed", uNeed);
var displayCas = localStorage.setItem("cas", cas);
var displaynMedic = localStorage.setItem("nMedic", nMedic);
var displayType = localStorage.setItem("type", type);
var dt = new Date();
var utcDate = dt.toUTCString();
var displayDate = localStorage.setItem("utcDate", utcDate);


if (navigator.geolocation) {

navigator.geolocation.getCurrentPosition(
        function(position) {
              lat = position.coords.latitude;
              lon = position.coords.longitude;

              var ref = database.ref('location/'+ myUuid+ '/');

              ref.set({
                name: name,
                age: age,
                contactNumber: conNumber,
                urgentNeed: uNeed,
                casualties: cas,
                needofmedication: nMedic,
                latitude: lat,
                longitude: lon,
                typeDisaster: type,
                date: utcDate
              });

      alert("Information has been sent...please wait for our unit to response");
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
document.getElementById('fit').style.display = "none";
document.getElementById('map').style.display = "none";
}
//Function to Hide Popup
function div_hide(){
document.getElementById('abc').style.display = "none";
document.getElementById('fit').style.display = "block";
document.getElementById('map').style.display = "block";

}

 
// store current location with information regarding disaster into firebase

    