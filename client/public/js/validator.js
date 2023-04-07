var otp = 0;
   function sendOtpBtn(t){
         var val = $(t).val();
         if(val.length==10)
            $('.send-otp-btn').removeClass('hide');

    }

function sendOtp(t){
	$('.phone-status').html("");
	var val = $('.mobile-otp').val();
	if(val.length==10){
   	
      var url = base_url+"api/check-phone";
      var data = {'phone':val};
      $('.phone-status').html('<i class="text-info">Please wait a while checking mobile number</i>');
      app.post(url,data,function(res){
        
            if(!res.err){
              $('.phone-status').html('<i class="text-success">Available for signup</i>');
            }else{
            	
               		$('.phone-status').html('<i class="text-danger">This mobile number already exists, You please login </i>');
        	}
      });

 }else{
   $('.phone-status').html('<i class="text-danger">Enter 10 digit mobile number</i>');
 }
  
}


function sendOtpVerify(t){
      var val = $('.mobile-otp').val();
      if(val.length==10){
         var user_otp = $('.otp').val();
         if(otp != 0){ 

            if(otp == user_otp){
               $('.submit-btn-container').removeClass('hide');

               $('.mobile-otp').attr('readonly','readonly');

               $('.otp-main-section').html(' <span class="icon-check_circle text-success"></span> OTP Verified');
            }else{
               app.showToast("Sorry! OTP Does not match!");
            }


       }
    }

}

      /*function customSize(t){
         var fd = new FormData(t);
         var url = "{{app.url}}send-custom-size"; 
         app.post(url,fd,(r)=>{
            if(!r.err)
               location.href='thankyou';
         },true);
         return false;
      }*/






function validedEmail(email){
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/.test(email))
  	{
  		return true;
  	}
    return false;
}






$(()=>{
	$('.mobile-otp').on('keypress',function(event){
		$('.phone-status').html('');
	    var keycode = event.which;
	       if(keycode < 48 || keycode > 57){
			  return false;
			}
	});

	$('.signup-email').on('change',function(){
		var email = $(this).val();
		if(validedEmail(email)){
			$('.email-status').html('<i class="text-info">Please wait while checking email Availablilty.</i>');
			
      var url = base_url+"api/check-email";
   
	      	var data = {'email':email};
	      	
	      	app.post(url,data,function(res){
              // alert(JSON.stringify(res));
	      		if(!res.err){
	      			$('.email-status').html('<i class="text-success">This email available.</i>');
	      		}else{
	      			$('.email-status').html('<i class="text-danger">This email already used for this site, please login.</i>');
	      		}
	      	});
      }else{
      	$('.email-status').html('<i class="text-danger">You have entered an invalid email address!</i>');	
      }

	});

	$('.signup-email').on('keypress',function(){
			$('.email-status').html('');
	});
});


