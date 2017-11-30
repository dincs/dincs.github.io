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
  //var ref = database.ref('location/'+ myUuid + '/');


// Validating Empty Field
function check_empty() 
{
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var conNumber = document.getElementById("conNumber").value;
  var disaster = document.getElementById("disaster").value;
  var sevLevel = document.getElementById("sevLevel").value;


  if (disaster=="") {
  alert("ERROR! Please select disaster type !");
  document.getElementById("disaster").focus();
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
else if (conNumber=="") {
  alert("ERROR! Please enter contact number !");
  document.getElementById("conNumber").focus();
  return false;
}
else if (sevLevel=="") {
  alert("ERROR! Please select severity level !");
  document.getElementById("sevLevel").focus();
  return false;
}
else if (urgentNeed=="") {
  alert("ERROR! Please select urgent need !");
  document.getElementById("urgentNeed").focus();
  return false;
}
else if (casualties=="") {
  alert("ERROR! Please select if there any casualties happened !");
  document.getElementById("casualties").focus();
  return false;
}
else if (needMedic=="") {
  alert("ERROR! Please select if there any need of medication !");
  document.getElementById("needMedic").focus();
  return false;
}

else {

var uNeed = new Array();
      for(var i=0;i<2;++i){
        var urgentNeed = document.getElementById("urgentNeed"+i);
        if(urgentNeed.checked){
          uNeed.push(urgentNeed.value);
        }
      }
  //alert(uNeed);

      for(var i=0;i<2;++i){
         var casualties = document.getElementById("casualties" +i);
        if(casualties.checked){
          var cas = casualties.value;
        }
      }
  //alert(cas);

      for(var i=0;i<2;++i){
         var needMedic = document.getElementById("needMedic" +i);
        if(needMedic.checked){
          var nMedic = needMedic.value;
        }
      }
  //alert(nMedic);

      var test = document.getElementsByName("disaster");
      for (var i = 0, length = test.length; i < length; i++) {
              if (test[i].checked) {
                  var type = test[i].value;
                  break;
              }
          }

    //alert(type);


if (navigator.geolocation) {

navigator.geolocation.getCurrentPosition(
        function(position) {
              lat = position.coords.latitude;
              lon = position.coords.longitude;
              var dt = new Date();
              var utcDate = dt.toUTCString();

              var ref = database.ref('location/'+ myUuid);

              ref.set({
                name: name,
                age: age,
                contactNumber: conNumber,
                severityLevel: sevLevel,
                urgentNeed: uNeed,
                casualties: cas,
                needofmedication: nMedic,
                latitude: lat,
                longitude: lon,
                typeDisaster: type,
                date: utcDate
              });

      alert("Information has been sent...please wait for our unit to response");
      //window.location.replace("map.html");
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

    