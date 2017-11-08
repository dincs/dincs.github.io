 // Initialize Firebase


function votelike(){
	var config = {
    apiKey: "AIzaSyAI4vwpS8NGVIZcDeiZtY0ZHsZdRE-mhLs",
    authDomain: "real-time-tracking-bcce8.firebaseapp.com",
    databaseURL: "https://real-time-tracking-bcce8.firebaseio.com",
    projectId: "real-time-tracking-bcce8",
    storageBucket: "real-time-tracking-bcce8.appspot.com",
    messagingSenderId: "906782233166"
  };
  firebase.initializeApp(config);

	var like=0;

	like = like +1;
	
	var database = firebase.database();

    var ref = database.ref('test');

    var data = {
      likevote: 0,
      likevote1: 1,
    }
    ref.push(data);
}