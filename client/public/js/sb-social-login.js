var response = {};
var fbUser = '';  



  window.fbAsyncInit = function() {
    FB.init({
      appId      : '2566482413367221',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.2'
    });
      
    FB.AppEvents.logPageView();   

    FB.getLoginStatus(function(res) {
      response = res;
    });

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



   function facebookLogout() {
		
		if(response.status == "connected")
			    FB.logout();
    }
    



  var statusChangeCallback = (res)=>{
    
    console.log(res);
  }



 


  function logInWithFacebook(){
    if(response.status !== "connected"){
      FB.login(function(response) {
        getUserData();
      }, {scope: 'email,public_profile'});
    }else{
      getUserData();
    }
    return 0;
  }



  function getUserData(){

    var fields = 'first_name,last_name,email';
    FB.api('/me', {fields:fields }, function(response) {
     
      var url = base_url+'login-by-fb';
      var data = {req:response};

      app.post(url,data,(res)=>{
        
        if(!res.err) {
            facebookLogout();
            location.reload();
           }
           
      });

    });
  } 




/*start google login */
  



function onSuccess(googleUser) {
  var auth2 = gapi.auth2.getAuthInstance();
    
 

    var profile = googleUser.getBasicProfile();
    var response = {
      first_name:profile.getGivenName(),
      last_name:profile.getFamilyName(),
      email:profile.getEmail(),
      id:profile.getId()
    };
   
     
    var url = base_url+'login-by-google';
      var data = {req:response};
    app.post(url,data,(res)=>{
      
        if(!res.err) {
             auth2.signOut().then(function () {
                console.log("User signed out.");
              });
            location.reload();
           }
           
      });
}

function onFailure(error) {
    console.log(error);
}

function renderButton(){ 

    gapi.signin2.render("google_button", {
      "scope": "profile email",
      "width": 205,
      "height": 40,
      "longtitle": true,
      "theme": "dark",
      "onsuccess": onSuccess,
      "onfailure": onFailure
    });
   
}




