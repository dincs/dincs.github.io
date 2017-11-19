// Initialize Firebase
  

  var txtEmail = document.getElementById('txtEmail');
  var txtPassword = document.getElementById('txtPassword');
  var btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');

if(btnLogin){
  btnLogin.addEventListener('click', e=> {
  	var email = txtEmail.value;
  	var pass = txtPassword.value;
  	var auth = firebase.auth();

  	const promise = auth.signInWithEmailAndPassword(email,pass);
  	promise.catch(e=> console.log(e.message));
  	});
}
if(btnLogout){
  btnLogout.addEventListener('click', e=> {
  	firebase.auth().signOut();
  	});
}

  firebase.auth().onAuthStateChanged(firebaseUser=>{
  		if(firebaseUser){
  			 console.log(firebaseUser);
         btnLogout.classList.remove('hide');
  		}
  		else{
  			console.log('not logged in');
        btnLogout.classList.add('hide');
  		}
  });