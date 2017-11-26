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
    var latitude = location[k].latitude;
    var longitude = location[k].longitude;
    var typeDisaster = location[k].typeDisaster;
    var date = location[k].date;
    var info = location[k].information;

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
      '#' + i + '<br>' +
      'Information: ' + info + '<br>' +
      'Date: ' + date + '<br>' +
      '<button class="delete" value='+ k + '>Delete</button>' + 
      '<button class="verify" value='+ k + '>Verify</button>'
      ,
      image: 'img/flood.png',
      "icon": {
              "iconUrl":"img/" + typeDisaster + ".png",
              "iconSize": [25, 25], // size of the icon
              "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
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
     var content = '<p><strong>' + feature.properties.title + '</strong><br>'+feature.properties.description +'</p><img src="' + feature.properties.image + '" height=50 width=60>';
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

//function verify
$(document).on('click', '.verify', function() {
    
    var clicked = $(this).val();
    
    var con = confirm("Are you sure want to verify this data?");
    if(con==true){
        alert("Data has been verified");
        /*var ref = database.ref('location');
        ref.child(clicked).remove();*/
        return true;
    }
    else{
        return false;
    }
});
//function verify



var marker = new Firebase('https://real-time-tracking-bcce8.firebaseio.com/maps/');
var markers = {};

navigator.geolocation.watchPosition(function(position) {
enableHighAccuracy: true,
  marker.child(myUuid).set({
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
    timestamp: Math.floor(Date.now() / 1000)
  })
}
);


function addPoint(uuid, position) {
  var myIcon = L.icon({
  iconUrl: (uuid === myUuid ? 'img/marker1.png' : 'img/marker.png'),
  iconSize: [25, 25], 
  iconAnchor: [15, 25],
});
  
  var marker = L.marker([position.coords.latitude, position.coords.longitude], {
    icon: myIcon
  })
  .bindPopup(uuid)
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

