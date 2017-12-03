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

L.mapbox.accessToken = 'pk.eyJ1IjoicmlsZXhicmFkZXIiLCJhIjoiY2ozMDAxdnBmMDAzNTMzanMyMjJ5bTZsZyJ9.1KZbtlEhO7mfSELugWCqxA';

var map = L.mapbox.map('map', 'mapbox.streets', {
  zoomControl: true,
  attributionControl: false,
  tileLayer: {
    maxNativeZoom: 19
  }
}).setView([3.0680776, 101.4975633], 10)
//map.legendControl.addLegend(document.getElementById('legend').innerHTML);
L.control.locate().addTo(map);
var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML +=  '<img src="img/flood.png" height=20 width=20>' + '     Flood' + '<br><br>'
    div.innerHTML +=  '<img src="img/fire.png" height=20 width=20>'  + '     Fire' + '<br><br>'
    div.innerHTML +=  '<img src="img/marker1.png" height=20 width=20>'   +  '     You' + '<br><br>'
    div.innerHTML +=  '<img src="img/rescue.png" height=20 width=20>'   +  '     Rescue Operation' + '<br><br>'
    div.innerHTML +=  '<img src="img/marker.png" height=20 width=20>'   +  '     Other user'
    return div;
};
legend.addTo(map);
//add stored location marker to mapbox - edited

var database = firebase.database();
var ref = database.ref('location');
ref.on('value', gotData);
var mark = {};


function gotData(data){

  var location = data.val();
  
  var keys = Object.keys(location);
  
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
  var mark = new L.MarkerClusterGroup();

  for(var i=0;i<keys.length;i++){
    var k = keys[i];
    var user = location[k].user;
    //console.log(user);
    var name = location[k].name;
    var age = location[k].age;
    var casualties = location[k].casualties;
    var conNumber = location[k].contactNumber;
    var nMedic = location[k].needofmedication;
    var conNumber = location[k].contactNumber;
    var urgentN = location[k].urgentNeed;
    var latitude = location[k].latitude;
    var longitude = location[k].longitude;
    var typeDisaster = location[k].typeDisaster;
    var sevLevel = location[k].severityLevel;
    var date = location[k].date;

    var geoJson = {
    type: 'FeatureCollection',
    features:[{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },  
    "properties": {
      "title": typeDisaster,
      "description": 
      '#' + (i+1) + '<br>' +
      '<b>Name: </b>' + name + '<br>' +
      '<b>Age: </b>' + age + '<br>' +
      '<b>Contact: </b>' + conNumber + '<br>' +
      '<b>Casualties: </b>' + casualties + '<br>' +
      '<b>Need of Medication: </b>' + nMedic + '<br>' +
      '<b>Urgent Need: </b>' + urgentN + '<br>' +
      '<b>Severity Level: </b>' + sevLevel + '<br>' +
      '<b>Date: </b>' + date + '<br>' +
/*      '<button class="delete" value='+ k + '>Delete</button>' +*/
      '<input type="textarea" id="mes" name="mes" size=42% width=42%>' + 
      '<button class="message" no='+i+' value='+ k + '>Message</button>'
      ,
      "icon": {
              "iconUrl":"img/" + typeDisaster + ".png",
              "iconSize": [20, 25], // size of the icon
              "iconAnchor": [20, 25], // point of the icon which will correspond to marker's location
              "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
              "className": "dot"
          }
    }
  }]
};
var myLayer = L.mapbox.featureLayer();
myLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

    marker.setIcon(L.icon(feature.properties.icon));
     var content = '<p><strong>' + feature.properties.title + '</strong><br>'+feature.properties.description +'</p>';
  marker.bindPopup(content);
});

myLayer.setGeoJSON(geoJson);


mark.addLayer(myLayer);
map.addLayer(mark);
}
}
//add stored location marker to mapbox - edited
//function delete
$(document).on('click', '.delete', function() {
    
    var clicked = $(this).val();
    
    var con = confirm("Are you sure want to delete this data?");
    if(con==true){
        alert("Data has been deleted");
        var ref = database.ref('location');
        ref.child(clicked).remove();
        return true;
    }
    else{
        return false;
    }
});
//function delete

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
        var refMessage = database.ref('location/' + clicked + '/messageVictim');

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
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
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
  iconAnchor: [15, 25],
});

  var marker = L.marker([position.coords.latitude, position.coords.longitude], {
    icon: myIcon
  })
  .bindPopup(uuid == myUuid ? "You are here" : position.coords.role == 1 ? 'Rescue Operation' : 

    'Other User' + '<br><input type="textarea" id="mes" name="mes" size=35% width=35%><button id="messageVictim" class="messageVictim" value='+ uuid + '>Message</button>')
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
        var refMessage = database.ref('location/' + clicked + '/messageVictim');

        refMessage.push({
          message: message,
          role: 1,
          visit: 0
        });
        alert('Message has been sent');
        document.getElementById("mes").value="";
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

      if (childSnapshot.val().timestamp < now - 10 ) {
        marker.child(uuid).set(null)
      }
    })
  })
}, 5000);

