 function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var myUuid = localStorage.getItem('myUuid');
var displayName = localStorage.getItem('name');
var displayAge = localStorage.getItem('age'); 
var displayContact = localStorage.getItem('conNumber');
var displayuNeed = localStorage.getItem('uNeed');
var displayCas = localStorage.getItem('cas');
var displaynMedic = localStorage.getItem('nMedic');
var displayType = localStorage.getItem('type');
var displayDate = localStorage.getItem('utcDate');
if (!myUuid) {
  myUuid = guid();
  localStorage.setItem('myUuid', myUuid);
}

if (!displayName) {
  displayName = "Other user";
  localStorage.setItem('displayName', displayName);
}

if (!displayAge) {
  displayAge = "None";
  localStorage.setItem('displayAge', displayAge);
}

if (!displayContact) {
  displayContact = "None";
  localStorage.setItem('displayContact', displayContact);
}

if (!displayuNeed) {
  displayuNeed = "None";
  localStorage.setItem('displayuNeed', displayuNeed);
}

if (!displayCas) {
  displayCas = "None";
  localStorage.setItem('displayCas', displayCas);
}

if (!displaynMedic) {
  displaynMedic = "None";
  localStorage.setItem('displaynMedic', displaynMedic);
}

if (!displayType) {
  displayType = "None";
  localStorage.setItem('displayType', displayType);
}

if (!displayDate) {
  displayDate = "None";
  localStorage.setItem('displayDate', displayDate);
}

L.mapbox.accessToken = 'pk.eyJ1IjoicmlsZXhicmFkZXIiLCJhIjoiY2ozMDAxdnBmMDAzNTMzanMyMjJ5bTZsZyJ9.1KZbtlEhO7mfSELugWCqxA';

var map = L.mapbox.map('map', 'mapbox.streets', {
  zoomControl: true,
  attributionControl: false,
  tileLayer: {
    maxNativeZoom: 19
  }
}).setView([3.0680776, 101.4975633], 10)

L.control.locate().addTo(map);

//function messaging
$(document).on('click', '.message', function() {
    var clicked = $(this).val();
    //var no = $(this).attr('no');

    message = document.getElementById("mes").value;
    if(message==""){
      alert('please enter message!');
      return false;
    }
    else{
        var refMessage = database.ref('location/' + clicked + '/message');

        refMessage.push({
          message: message,
          visit: 0
        });
        alert('Message has been sent to this victim!');
    }

});
//function messaging

var marker = new Firebase('https://real-time-tracking-bcce8.firebaseio.com/maps/');
var markers = {};

firebase.auth().onAuthStateChanged(firebaseUser=>{
      if(firebaseUser){
         navigator.geolocation.watchPosition(function(position) {
          enableHighAccuracy: true,
            marker.child(myUuid).set({
              coords: {
                role: 1,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              timestamp: Math.floor(Date.now() / 1000)
            })
          }
          );
      }
      else{
         navigator.geolocation.watchPosition(function(position) {
          enableHighAccuracy: true,
            marker.child(myUuid).set({
              coords: {
                role:0,
                name: displayName,
                age: displayAge,
                contact: displayContact,
                urgentneed: displayuNeed,
                casualties: displayCas,
                medication: displaynMedic,
                typeofdisaster: displayType,
                date: displayDate,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              timestamp: Math.floor(Date.now() / 1000)
            })
          }
          );
      }
  });

function addPoint(uuid, position) {
  var myIcon = L.icon({
  iconUrl: (uuid == myUuid ? 'img/marker1.png' : position.coords.role == 1 ? 'img/rescue.png': 'img/marker.png'),
  iconSize: [25, 25], 
  iconAnchor: [10, 10],
});

  var marker = L.marker([position.coords.latitude, position.coords.longitude], {
    icon: myIcon
  })
  .bindPopup(uuid == myUuid ? "You are here" : position.coords.role == 1 ? 'Rescue Operation' : 

    '<b>Type of disaster: </b>'+ position.coords.typeofdisaster + ' <br>' +
    '<b>Name:  </b>' + position.coords.name + ' <br>' + 
    '<b>Age:  </b>' + position.coords.age + '<br>' +
    '<b>Contact Number: </b>' + position.coords.contact + '<br>' +
    '<b>How many people injured? : </b>' + position.coords.casualties + '<br>' +
    '<b>Need of Medication: </b>' + position.coords.medication + '<br>' +
    '<b>Urgent Need: </b>' + position.coords.urgentneed + '<br>' +
    '<b>Date: </b>' + position.coords.date + '<br>' +

    '<input type="textarea" id="mes" name="mes" size=35% width=35%>' +
    '<button id="messageVictim" class="messageVictim" value='+ uuid + '>Message</button>'+ 
    '<button id="delMessage" class="delMessage" value='+ uuid + '>Delete Message</button><br><br>')
  .addTo(map)

  markers[uuid] = marker;
  map.fitBounds(Object.keys(markers).map(function(uuid) {
    return markers[uuid].getLatLng()
  }))
}

function removePoint(uuid) {
  map.removeLayer(markers[uuid])
}

function updatePoint(uuid, position) {
  var marker = markers[uuid]
  marker.setLatLng([position.coords.latitude, position.coords.longitude])
}

function putPoint(uuid, position) {
  if (markers[uuid])
    updatePoint(uuid, position)
  else
    addPoint(uuid, position)
}

//retrieve current location from firebase
marker.on('child_added', function(childSnapshot) {
  var uuid = childSnapshot.key()
  var position = childSnapshot.val()

  addPoint(uuid, position)
})

marker.on('child_changed', function(childSnapshot) {
  var uuid = childSnapshot.key()
  var position = childSnapshot.val()

  putPoint(uuid, position)
})

marker.on('child_removed', function(oldChildSnapshot) {
  var uuid = oldChildSnapshot.key()

  removePoint(uuid)
})

$(document).on('click', '.messageVictim', function() {
    var clicked = $(this).val();
    //var no = $(this).attr('no');

    message = document.getElementById("mes").value;
   /* alert(message);
    alert(clicked);
    alert(myUuid);*/
    if(message==""){
      alert('Please enter message!');
      document.getElementById("mes").focus();
      return false;
    }
    else{
        var refMessage = database.ref('location/' + clicked + '/message');

        refMessage.push({
          message: message,
          role: 1,
          visit: 0
        });
        alert('Message has been sent to this victim!');
        document.getElementById("mes").value="";
    }

});

$(document).on('click', '.delMessage', function() {
    var clicked = $(this).val();

    var con = confirm("Are you sure to delete all message sent to this victim ?");
    if(con==false){
      return false;
    }
    else{

        var refMessage = database.ref('location/' + clicked + '/message');

        refMessage.remove();

        alert('All message has been deleted!');
    }

});


// Remove old markers
setInterval(function() {
  marker.limitToFirst(100).once('value', function(snap) {
    var now = Math.floor(Date.now() / 1000)
    //console.log(now);
    snap.forEach(function(childSnapshot) {
      var uuid = childSnapshot.key()

       if (uuid === myUuid) return

      if (childSnapshot.val().timestamp < now - 100 ) {
        marker.child(uuid).set(null)
      }
    })
  })
}, 5000);

