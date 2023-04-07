var dataCollectin = null,
  category = null,
  size = null,
  thickness = null,
  amount = 0,
  amount_total = 0,
  amount_discount = 0,
  amount_subtotal = 0,
  amount_subtotal_tax = 0,
  discount_per = 0,
  base_url = null,
  cart = null,
  app = {},
  items = null,
  arr = [],
  coupon = [],
  flag_site_coupon = 0,
  forgot_password_email = null,
  forgotCode = 0,
  variation_id = 0,
  current_url = location.href;

  var check_amt = 0;
  var check_discount = 0;  
  var check_total = 0;
  var extra_tax = 0.075;
  var ckCartArr = [];
  var subcartflag = 0;

  var is_offer_active = 0,offer=0;

function placeOrder(t) {
  $(".submit-checkout").attr("disabled", !0),
    app.showToast("Placing your order. Please wait.");
  var a = $(t).serialize();
  
  var cart_to_user =  cart.getItem("cartItems");
  var data = {'cart_to_user': cart_to_user};
  addUserCart(data);
  var ca = parseInt($("input.checkout-page-subtotal").val()); 
  var cd =   parseInt($("input.checkout-page-discount").val());
  var ct =  parseInt($("input.checkout-page-total").val());

  if(ca == check_amt && cd == check_discount && ct == check_total && ct>0 && ca>0){
  return (
    app.post(
      base_url + "place-order",
      a,
      t => {
        if(t.err){
          alert(JSON.stringify(t));
          console.log(JSON.stringify(t));
          app.showToast("Please login first!");
          $(".submit-checkout").attr("disabled", !1)
        
        }else{
        //alert(JSON.stringify(t));
            app.showToast("Redirecting for payment.");

            $(".submit-checkout").attr("disabled", !0);
            if(t.order != undefined || t.order != null)
              location.href = base_url + "payment";
            else
              location.href = base_url + "process";
        }
            
      }
      
    ),
    !1
  );
}else{
  app.showToast("Sorry Something went wrong.");
  return false;
}
}


function addUserCart(data){
  var url = base_url+"api/add-user-cart";

  app.post(url,data,(res)=>{
    console.log(res);
  });
}

function checkoutAddShowEdit() {
  $(".checkout-added-address-box").addClass("hide"),
    $(".checkout-address-box").removeClass("hide");
}

function removeSiteCoupon() {
  (flag_site_coupon = 1), $(".mo-coupon-display").addClass("hide");

}

function activeCategory(t,c=null) {
  $(".category-tbl .btn-outline-variation").removeClass("active"),
    $(t).addClass("active"),
    $(".size-container").removeClass("hide"),
    (category = $(t).attr("value")),
    $(".sizes-tbl").hide(),
    $(".size-" + category).show(),
    $(".sizes").removeClass("active"),
    $(".thickness").removeClass("active");
    (size = 0),
    (amount = 0),
    (thickness = 0),

    
    setAmount();
    if(c != null){
      
      variation_id = $(t).attr('variation_id');
      $('.'+c).click();
    }

    var temp_category = category;
    category = category.toUpperCase();

    var first_size = $('.size-'+temp_category);
  
      $('a',first_size).eq(0).click();
    
}


function activeSize(t) {

  $(".sizes").removeClass("active");
  $(t).addClass("active");

  var a = $(t).attr("value");
  size = parseInt(a);
 
    $(".thickness-container").removeClass("hide");
    thickness = parseFloat($('.thickness').val());

    checkDataCollectin();
}



function activeThickness(t) {
  $(".thickness").removeClass("active"),
    $(t).addClass("active"),
    (thickness = parseInt($(t).val()));
    
    checkDataCollectin();
}
/*
function checkDataCollectin() {
 
  //dataCollectin ? calculate() : setLocalDatabase();
}

function setLocalDatabase() {
  var product_sku = $('#product_sku').val();
  var url = $(".checkout-form").attr("product");
  var data = {product_sku:product_sku};
  app.post(url,data,function(t) {
    
      (dataCollectin = t), calculate();
        console.log(dataCollectin);
  });


}
*/



function calculate() {
  /*for (i in dataCollectin) {
    var t = dataCollectin[i];
    if ((size == t.size && thickness == t.thickness && category == t.category) || (t._id == variation_id)) {
      amount = parseFloat(t.price);
      $("#product_display_size").val(t.dimension);
        size = t.size;
      $('.checkout-product-variation').text(t.dimension);
      break;
    }

    amount = 0;
  }*/
  setAmount();
}



function setAmount() {
  var t = parseInt($(".qty").val()),
    a = amount * t;
  $(".checkout-amount").text(a.toFixed(3)),
   $("#variation_id").val(variation_id),
    $("#product_category").val(category),
    $("#product_size").val(size),
    $("#product_thickness").val(thickness),
    $("#product_qty").val(t),
    $("#product_price").val(amount);
    setckCartArr();
}




function addToCart(t) {
  var form = $(t);
  var index = form.attr('index');
  var v = parseFloat($('.id').eq(index).val());
  var a = parseFloat($('.rate').eq(index).val());
  var qty = parseFloat($('.qty').eq(index).val());
  $(".add-to-cart-submit").eq(index).attr("disabled",true);
  
  var tq = 0;
  if (a && v){
    if(arr != null){
      for (var r in arr)
        if (v == arr[r].productId)
          return (
            (tq=parseFloat(arr[r].qty) + qty), 
            arr[r].qty = tq,
            cart.setItem("cartItems", JSON.stringify(arr)),
            app.loadCart(),
            app.showToast("You have increased item quantity to cart."),
            app.cart(),
            !1
          );
    }


     var c = {id:v,qty:qty};
  

    setTimeout(()=>{
          var url_ajax = base_url+'api/add-to-cart';
          sendCartItems(url_ajax,c,t,index);
          
    },300)
    

  } else
    app.showToast("Something went wrong!"),
      $(".add-to-cart-submit").attr("disabled", !1);
  return !1;
}


function sendCartItems(url,c,t,index){
  app.post(url,c,a => {
  	
        arr.push(a.data),
          cart.setItem("cartItems", JSON.stringify(arr)),
          app.loadCart(),
          app.showToast("You have added item to cart."),
          $(".add-to-cart-submit").eq(index).attr("disabled", !0);
          app.cart();

      }
    );

}


function removeToCart(t) {
  arr.splice(parseInt($(t).val()), 1),
    arr.length || ((discount_per = 0), (amount_total = 0), removeCoupon()),
    app.loadCart(),
    app.cart(),
    cart.setItem("cartItems", JSON.stringify(arr)),
    app.showToast("You have removed item to cart.");
}

function checkCouponCode() { 
  var a = $("#coupon"),
    e = a.val();
  var skuArr = [];
    $('.product_sku').each(function(){
        var sku = $(this).val();
        if(!skuArr.includes(sku)){
          skuArr.push(sku);
        }     
    });

  var   product_sku = skuArr.length==1 ? skuArr[0]:product_sku = null;

  var data = {coupon:e,product_sku:product_sku};  
  var url = base_url+'api/coupon'; 
  "" == e.trim()
    ? a.css({
        "border-color": "red"
      })
    : (a.css({
        "border-color": "gray"
      }),

      app.post(url,data,
        (o)=> {
          o
            ? ((coupon = o),
              (discount_per = parseFloat(o.coupon_amount)), app.checkoutCalculate(),
              a.css({
                "border-color": "green"
              }),
              $(".coupon-status")
                .html(
                  "<small>This coupon code has been successfully applied.</small>"
                )
                .css({
                  color: "green"
                }),
              $(".cart-page-discount-label").html(
                'Coupon: <b style="text-transform: uppercase">' + e + "</b> "
              ),
              $(".coupon-diplay-container").removeClass("hide"))
            : (
              a.css({
                "border-color": "#ff0052"
              }),
              (discount_per = 0),
              (coupon = null),
              $(".cart-page-discount-label").html("-"),
              $(".coupon-diplay-container").addClass("hide"),
              $(".coupon-status")
                .html(
                  "<small>You have not entered a valid coupon code.</small>"
                )
                .css({
                  color: "#ff0052"
                }));

            is_offer_active = 0;
            $('.offer').addClass('hide');
        }
      ));
}

function removeCoupon() {
  $("#coupon")
    .val("")
    .css({
      "border-color": "#ced4da"
    }),
    (discount_per = 0),
    app.cart(),app.checkoutCalculate(),
    $(".cart-page-discount-label").html("-"),
    $(".coupon-diplay-container").addClass("hide"),
    (coupon = null),
    $(".coupon-status")
      .html("<small>You have removed coupon code.</small>")
      .css({
        color: "#ced4da"
      }),
    app.get(base_url + "api/remove-coupon", t => {});
}

function processCart(t) {
  var a = $(t).attr("url"),
    e = cart.getItem("cartItems");
  null != e && (e = JSON.parse(e)),
    $(t).attr("disabled", !0),
    app.post(a + "api/process-cart",
      {
        cart: e,
        coupon: coupon
      },
      t => {
        if(!t.err)
          location.href = a + "checkout";
        else
          app.showToast('Something went wrong!');
      }
    );
}

function setCheckoutSession(){
  e = cart.getItem("cartItems");
  if(null != e){
    e = JSON.parse(e);
    if(e.length>0){
      app.post(base_url + "api/process-cart",
        {
          cart: e,
          coupon: coupon
        },
        t => {}
      );
    }
  }
}


function setActiveUserMenu(t) {
  var a = $(t);
  $(".user-menu").removeClass("active"),
    a.addClass("active"),
    $(".user-dash-section .site-section").removeClass("active"),
    $(".user-dash-section ." + a.attr("value")).addClass("active"),
    cart.setItem("user_tab", a.attr("value"));
}

function setUserCurrentTab() {
  var t = localStorage.getItem("user_tab");
  t
    ? ($("[value='" + t + "']").addClass("active"),
      $("." + t).addClass("active"))
    : ($("[value='dashboard-tab']").addClass("active"),
      $(".dashboard-tab").addClass("active"));
}
$(() => {
  (base_url = $("#app-uri").attr("data-url")),
    $(window).scroll(function() {
      var t = $(this).scrollTop();
      t > 80
        ? ($(".site-navbar").addClass("fixed"),
          t > 120 &&
            ($(".site-navbar").addClass("active"),
            flag_site_coupon && $(".mo-coupon-display").addClass("hide")))
        : t < 20 &&
          ($(".site-navbar")
            .removeClass("fixed")
            .removeClass("active"));

          if(flag_site_coupon == 0) 
            $(".mo-coupon-display").removeClass("hide");
    }),
    $(".login-tab-btn").click(function() {
      $(".signup-tab-btn").removeClass("active"),
        $(this).addClass("active"),
        $(".login-tab").addClass("active"),
        $(".forgot-tab").removeClass("active"),
        $(".signup-tab").removeClass("active");
    }),
    $(".signup-tab-btn").click(function() {
      $(".login-tab-btn").removeClass("active"),
        $(this).addClass("active"),
        $(".signup-tab").addClass("active"),
        $(".forgot-tab").removeClass("active"),
        $(".login-tab").removeClass("active");
    });
    $(".forgot-tab-btn").click(function() {
        
        
        $(".forgot-step-1").removeClass("hide");
        $(".forgot-tab").addClass("active");
        $(".login-tab").removeClass("active");
        $(".signup-tab").removeClass("active");
    });
}),
  $(() => {
    "undefined" != typeof localStorage
      ? (cart = localStorage)
      : console.log("localStorage does not Suported"),
      app.init(),
      $(".cart-close").click(() => {
        $(".cart-container").removeClass('active')
      }),
      $(".cart-btn").click(() => {
        $(".cart-container").addClass('active')
        
      });
  }),
  

/*
app.setCheckoutSession = () => {
    app.post(base_url + "api/process-cart",{
        cart: arr
      },
     t => {
        t && (discount_per = t.coupon_amount);
         // app.calculate();

         alert(t);
      });
};*/

app.init = () => {
    null != (items = cart.getItem("cartItems")) &&
      ((arr = JSON.parse(items)), app.loadCart());

      $('.active-bed').click();
  
};


  app.loadCart = () => {
    $(".cart-counter").text(arr.length).animate(
        {
          opacity: 1
        },
        300
      );
  };




  app.cart = () => {
     offer = 0;
     var sub_total = 0,sub_total_tax=0;
    var t =
      ' <table class="table table-bordered small">  <thead>    <tr>      <th class="product-thumbnail">Image</th>      <th class="product-name">Product</th>      <th class="product-price">Price</th>      <th class="product-quantity">Quantity</th>   <th class="product-tax">Tax(GST)</th>    <th class="product-total">Total</th>      <th class="product-remove">Remove</th>    </tr>  </thead>  <tbody>';
    for (i in ((amount_total = 0), arr)) {
      var a = arr[i],
        e = parseFloat(a.price),
        o = parseInt(a.qty) * e,
        tax = parseFloat(a.tax),
        tax_amt = (o * tax) / 100; 
        sub_total += o;
        sub_total_tax += tax_amt;
        o += tax_amt;
        
      (t +=
        '<tr><td class="product-thumbnail"><input type="hidden" class="product_sku" value="'+a.product_sku+'"><img src="' +base_url+'uploads/products/'+a.image +
        '" alt="Product Image" class="img-fluid" style="height:50px;"></td><td class="product-name">  <span class="text-black">') ;

        (t += a.name +
        ',   ' +
        a.sortDesc +
        ' </span>   </td>  <td ><i class="icon icon-inr"></i>' +
        e.toFixed(3) +
        '</td> <td>'+
        a.qty +
        '</td>  <td>'+
        a.tax +'%</td>\
        <td><i class="icon icon-inr"></i>' +
        o.toFixed(3) +
        '</td>                    <td><button type="button" class="btn btn-primary btn-xs"  onclick="removeToCart(this)" value="' +
        i +
        '">X</button></td>                  </tr>'),
        (amount_total += o),(amount_subtotal = sub_total),(amount_subtotal_tax = sub_total_tax);
    }

    0 == arr.length
      ? ((t +=
          '<tr><td colspan="7"><h2>Your have no items in your Shopping Cart!</h2></td></tr></tbody></table>'),
        $(".cart-table-container")
          .html(t)
          .addClass("active"),
        $(".cart-footer").hide(),
        app.calculate())
      : ((t += "</tbody></table>"),
        $(".cart-table-container")
          .html(t)
          .addClass("active"),
        $(".cart-footer").show(),
        app.calculate()),
      $(".cart-loader").remove();



  };




app.offer = (res=0) =>{
  free = 0;
  if(res){
      if(offer == 2 || offer == 3){
        free = 2;
        jQuery('.offer').addClass('alert-success').html('Congratulations! <br> <small>You are eligible for <b>2</b> free pillow along with this order.</small>');
      }
      else if(offer == 4 || offer == 5){
        free = 4;
        jQuery('.offer').addClass('alert-success').html('Congratulations! <br> <small>You are eligible for <b>4</b> free pillow along with this order.</small>');
      }
      else if(offer == 6){
        free = 6;
        jQuery('.offer').addClass('alert-success').html('Congratulations! <br><small> You are eligible for <b>6</b> free pillow along with this order.</small>');
      }
      else if(offer>6){
        free = 0;
         jQuery('.offer').html('Sorry! <br>  <small>You are not eligible for 2 free pillow along with this order </small>').addClass('alert-danger');
    }

    

  }

  return free;

    
}



app.calculate = () => {

    (amount_total = amount_total),
      $(".cart-page-subtotal").html(
        '<i class="icon icon-inr"></i>' + amount_subtotal.toFixed(3)
      ),
       $(".cart-gst-total").html(
        '<i class="icon icon-inr"></i>' + amount_subtotal_tax.toFixed(3)
      ), 
       $(".checkout-gst-total").html(
        '<i class="icon icon-inr"></i>' + amount_subtotal_tax.toFixed(3)
      ),
       $(".checkout-page-gst").val(amount_subtotal_tax.toFixed(3));


      

  
      (amount_discount = (amount_total * discount_per) / 100),
      (amount_discount = amount_discount),
      $(".cart-page-discount").html(
        '+<i class="icon icon-inr"></i>' + amount_discount.toFixed(3)
      );
      var referral = $('.cart-page-referral-amt').attr('val');



          

      
      if(referral != "" && referral!=undefined){
      referral = parseFloat(referral);
        var referral_amt_dis = (amount_total * referral / 100);
          if(referral_amt_dis>0){
             $(".cart-page-referral-amt").html(
          '-<i class="icon icon-inr"></i>' + referral_amt_dis.toFixed(3)
        );
          $('.referral-diplay-container').removeClass('hide');




          var t = amount_total - (amount_discount+referral_amt_dis);
        }else{
          var t = amount_total - amount_discount;
        }
      }else{
        var t = amount_total - amount_discount;
          
      }
      var tsc = parseInt($('.tsc').val());
      if(tsc){
          var extra_tax_rate = (amount_total*extra_tax)/100;

          t = amount_total+extra_tax_rate;
     

            $(".cart-extra-tax").html('<i class="icon icon-inr"></i>'+extra_tax_rate.toFixed(3));
       
            $(".checkout-page-extra-tax").val(extra_tax_rate.toFixed(3));
      }else{
            $(".cart-extra-tax").remove();
            $(".checkout-page-extra-tax").remove();
            $(".tsc-label").remove();
      }
    
    $(".cart-page-total").html('<i class="icon icon-inr"></i>' + t.toFixed(3));
    $(".checkout-page-total-display").html('<i class="icon icon-inr"></i>' + t.toFixed(3));
    $(".checkout-page-total").val(t.toFixed(3));


  };


app.checkoutCalculate = () => {

    (amount_total = amount_total),
      $(".cart-page-subtotal").html(
        '<i class="icon icon-inr"></i>' + amount_total.toFixed(3)
      ),
      (amount_discount = (amount_total * discount_per) / 100),
      (amount_discount = amount_discount),
      $(".checkout-page-discount").html(
        '-<i class="icon icon-inr"></i>' + amount_discount.toFixed(3)
      );
      var referral = $('.cart-page-referral-amt').attr('val');
      
      if(referral != "" && referral!=undefined){
      referral = parseFloat(referral);
        var referral_amt_dis =(amount_total * referral / 100);
          if(referral_amt_dis>0){
             $(".checkout-page-referral-amt").html(
          '-<i class="icon icon-inr"></i>' + referral_amt_dis.toFixed(3)
        );
          $('.referral-diplay-container').removeClass('hide');
          var t = amount_total - (amount_discount+referral_amt_dis);
        }else{
          var t = amount_total - amount_discount;
        }
      }else{
        var t = amount_total - amount_discount;
          
      }

      check_amt  = amount_total;
      check_discount  = amount_discount;
      check_total  = t;

      console.log(check_total);
        
      $("input.checkout-page-subtotal").val(amount_total);
      
      $("input.checkout-page-discount").val(amount_discount);
      $("input.checkout-page-total").val(t);

      $(".checkout-page-discount-display").html('<i class="icon icon-inr"></i> '+ amount_discount.toFixed(3));
       $(".checkout-page-total-display").html('<i class="icon icon-inr"></i> '+t.toFixed(3));

  };



  (app.showToast = function(t,err=1) {
    if(!err)
      $(".cart-toast-message").css('background','seagreen');
    else if(1==err){
       $(".cart-toast-message").css('background','orange');
    }

    $(".cart-toast-message")
      .animate({
        opacity: 1
      })
      .fadeIn(500)
      .html(t),
      setTimeout(() => {
        $(".cart-toast-message").animate(
          {
            opacity: 0
          },
          function() {
            $(this).hide(800);
          }
        );
      }, 3e3);
  }),
  (app.resetVariations = function() {
    $(".category-tbl .btn-outline-variation").removeClass("active"),
      $(".sizes").removeClass("active"),
      $(".thickness").removeClass("active"),
      (category = ""),
      (size = 0),
      (amount = 0),
      (thickness = 0),
      setAmount();
  }),
  (app.get = (t, a) => {
    $.ajax({
      type: "GET",
      url: t,
      success: a
    });
  }),
  (app.post = (t, a, e, o = !1) => {
    o
      ? $.ajax({
          type: "POST",
          url: t,
          data: a,
          contentType: !1,
          processData: !1,
          success: e
        })
      : $.ajax({
          type: "POST",
          url: t,
          data: a,
          success: e
        });
  }),
  (function(t) {
    (t.fn.countTo = function(a) {
      return (
        (a = a || {}),
        t(this).each(function() {
          var e = t.extend(
              {},
              t.fn.countTo.defaults,
              {
                from: t(this).data("from"),
                to: t(this).data("to"),
                speed: t(this).data("speed"),
                refreshInterval: t(this).data("refresh-interval"),
                decimals: t(this).data("decimals")
              },
              a
            ),
            o = Math.ceil(e.speed / e.refreshInterval),
            s = (e.to - e.from) / o,
            r = this,
            c = t(this),
            i = 0,
            n = e.from,
            l = c.data("countTo") || {};

          function u(t) {
            var a = e.formatter.call(r, t, e);
            c.html(a);
          }
          c.data("countTo", l),
            l.interval && clearInterval(l.interval),
            (l.interval = setInterval(function() {
              i++,
                u((n += s)),
                "function" == typeof e.onUpdate && e.onUpdate.call(r, n);
              i >= o &&
                (c.removeData("countTo"),
                clearInterval(l.interval),
                (n = e.to),
                "function" == typeof e.onComplete && e.onComplete.call(r, n));
            }, e.refreshInterval)),
            u(n);
        })
      );
    }),
      (t.fn.countTo.defaults = {
        from: 0,
        to: 0,
        speed: 1e3,
        refreshInterval: 100,
        decimals: 3,
        formatter: function(t, a) {
          return t.toFixed(a.decimals);
        },
        onUpdate: null,
        onComplete: null
      });
  })(jQuery),
  jQuery(function(t) {
    t(".count-number").data("countToOptions", {
      formatter: function(t, a) {
        return t.toFixed(a.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
      }
    }),
      t(".timer").each(function(a) {
        var e = t(this);
        (a = t.extend({}, a || {}, e.data("countToOptions") || {})),
          e.countTo(a);
      });
  });




  function forgotPassword(th){
    forgotCode = 0;
    app.showToast("Please wait a while...");
    $('.btn-primary').attr('disabled',true);
    var formData = new FormData(th);
    var url = $(th).attr('action');
    app.post(url,formData,(res)=>{
      $('.btn-primary').attr('disabled',false);
      app.showToast(res.msg,res.err);
      var fpe = $('.forgot-password-email');
      fpe.attr('readonly',true);
      forgot_password_email = fpe.val();
      if(!res.err){
        $('.forgot-step-2').removeClass('hide');
          $('.forgot-step-1').addClass('hide');
        forgotCode = res.forgotCode;
      }

    },true);
  
    return false;
  }

  function resetPassword(th){
   
    var formData = new FormData(th);
    formData.append('email',forgot_password_email);
    var userForgot = jQuery('[name="forgotCode"]').val();
    var password = jQuery('[name="password"]').val();
    var cpassword = jQuery('[name="confirm"]').val();
    if(forgotCode == userForgot){
      if(password == cpassword){
          $('[type="submit"]',th).attr('disabled',true);
          var url = $(th).attr('action');
          app.post(url,formData,(res)=>{
            app.showToast(res.msg,res.error);
            if(!res.error){
              $('.forgot-step-2').addClass('hide'),
              $(th).trigger('reset'),
              $(".login-tab").addClass("active"),
              $(".forgot-tab").removeClass("active"),
              $(".signup-tab").removeClass("active");
            }

            $('[type="submit"]',th).attr('disabled',false);
          },true);
        }else{
          app.showToast("please confirm your password",1);
        }
    }else{
       app.showToast("Please check your code",1);
    }
    
    return false;
  }

  function reloadForgot(){
    $('.forgot-step-1').removeClass('hide');
    $('.forgot-step-2').addClass('hide');
    $('.forgot-password-email').removeAttr('readonly');
  }



  


   function productPreviewAction(th){
    var btn = jQuery(th).attr('type');
    var dir = jQuery(th).attr('dir');
    var pos = parseInt(jQuery('.product-preview-line-pos').attr('pos'));
    var img = parseInt(jQuery('.product-preview-line-pos').attr('img'));
    
    if(btn == 'back'){
        img = img == 0 ? 4:img;
        img -=1;
        pos = pos*img;
      jQuery('.product-preview-line-pos').css('left',pos+'%');
      jQuery('.product-preview-line-pos').attr('img',img);
      previewThis(dir,img); 

    }else{
     
       img = img == 3 ? -1:img;
        img +=1;
        pos = pos*img;
        jQuery('.product-preview-line-pos').css('left',pos+'%');
      
        jQuery('.product-preview-line-pos').attr('img',img);
        
        
        previewThis(dir,img);

    
    }

 }




 jQuery(()=>{
  jQuery('.dropdown-mattresses-menu, #dropdown-mattresses').hover(
    function(){
      
      jQuery('#dropdown-mattresses').addClass('active');
      jQuery('.header-img-preview').removeClass('hide');
    },
    function(){
      jQuery('#dropdown-mattresses').removeClass('active');
      
    }
    );

  

    if(current_url == base_url+'cart' || current_url.indexOf('product')){
        app.cart();
    }

 })



 function seeMore(th){
  var val = parseInt(jQuery(th).val());
  if(val){
    jQuery('.see-more').addClass('hide');
    jQuery(th).val(0);
  }else{
    jQuery('.see-more').removeClass('hide');
    jQuery(th).val(1);
  }
 }



function resetCart(){
  return null;
}


 function previewThis(dir,num){
               
               $('.xzoom').attr('src', base_url+'static/public/images/product/' + dir + '/preview/' + num + '.jpg');
               $('.xzoom').attr('xoriginal', base_url+'static/public/images/product/' + dir + '/preview/' + num + '.jpg');
}



$(() => {
    $('.custom-size-btn').click(function () {
      $('#customSizeModal').modal('show');
    })
        
     $('.site-mobile-menu a:not(.not-close)').click(function(){
        
        $('.site-mobile-menu-close span').click();
     });

  if(current_url == base_url+'my-account')
     setUserCurrentTab();


    


    if (window.matchMedia("(max-width: 700px)").matches) {
               setTimeout(()=>{
                 $('.mo-coupon-display').removeClass('hide');
                 },5000);

        }else{
            $('.mo-coupon-display').removeClass('hide');
         }



  check_amt = parseInt($("input.checkout-page-subtotal").val()); 
  check_discount =  parseInt($("input.checkout-page-discount").val());
  check_total =  parseInt($("input.checkout-page-total").val());
   



});

            

           



function setckCartArr(){
   var frm = $('.checkout-form');
   ckCartArr = [];
   $('[type="hidden"]',frm).each(function(){
      var v = $(this).val();

      ckCartArr.push(v);
   });

   console.log(ckCartArr);
 }



$(()=>{
  setTimeout(()=>{
    $('.auto-hide').fadeOut(1500);
  },1500);

  app.get('/api/reset-info-session',(r)=>{});


  jQuery('#SignupForm .confirm-password').change(function(){
      var pass = jQuery('#SignupForm .password').val();
      var cpass = jQuery(this).val();
      if(pass != cpass){
        jQuery(this).val('').focus();
        app.showToast('Password did not match!');
      }
  });

  setCheckoutSession();
});




function doUserLogin(t){
  var formData = $(t).serialize();
  var action = $(t).attr('action');
  jQuery('.btn.btn-primary').attr('disabled',true);
  app.post(action,formData,res=>{
   
    if(!res.err){
      openTermModal(res);
      jQuery('.btn.btn-primary').attr('disabled',false);
    }else{
      app.showToast(res.msg,res.err);
       jQuery('.btn.btn-primary').attr('disabled',false);
    }

  });
  return false;
}

var loggedUrl = '/';
var loggedRes = {};
function openTermModal(res){
    jQuery('#TermViewModal').modal('show');
    loggedUrl = res.url;
    loggedRes = res;
}


function setUrl(){
    location.href = loggedUrl;
     app.showToast(loggedRes.msg,loggedRes.err);
}