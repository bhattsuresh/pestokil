var app = {};
app.showToast=function(t,err = 2){
     if(err == 1){
       $('.cart-toast-message').css('background','#fbba43');
     }else if(!err){
      $('.cart-toast-message').css('background','#8bc34a');
     }
   
    $(".cart-toast-message").animate(
    {opacity:1}
    ).fadeIn(500).html(t),setTimeout(()=>{

    $(".cart-toast-message").animate({opacity:0},function(){$(this).fadeOut(800)});
    
},3e3)
};


(app.get = (t, a, b) => {
    $.ajax({
      type: "GET",
    url: t,
    success: a,
    error:b
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
      enctype:"application/x-www-form-urlencoded",
          success: e
        });
  });


app.newWindow = (endpoint,width=800,height=600)=>{
  var set = "toolbar=no,scrollbars=no,resizable=no,top=150,left=150,width="+width+",height="+height;    
  window.open(endpoint,"_self",set);
}



function responseData(res){
  $('.res').removeClass('hide');
    var  html = '<tr>';
    for(p in res)
      html += `<td><b style="text-transform: capitalize;">${p}:</b>  ${res[p]}</td>`;
    html += '</tr>';
  $('#res').append(html);
}



var _install = (t)=>{
  $('.res').removeClass('hide');
  $('#res').html("Please wait...");
  var app_key = $('.app-key').val();
  var url = 'https://project.apisys.in/stock/?app_key='+app_key;
    $('#addForm').trigger('reset');
    $('.autofocus').focus();
  app.get(url,res=>{
      
    if(res.err){

      $('#res').html('<b class="text-danger">App key not valid or already used!</b>');
    }else if(!res.err){
        $('#res').html('');
        $('.app-key').hide();
        $('.res-hide').hide();
        $('#inputSubmit').hide();
        $('.res-img').removeClass('hide');
        var this_url = app.base_url+$(t).attr('action');
        app.post(this_url,res.data,r=>{
        
        location.href=app.base_url+'install/finish';
        
      })
      
    }else{
      $('#res').html('<b class="text-danger">Sorry Try again...</b>');
    }
  
  },err=>{
    $('#res').html('<b class="text-danger">Sorry Try again. No Internet Found!</b>');
  });
  return false;
}



var addBill = (t)=>{
  var fd = $(t).serialize();
  $('#addForm').trigger('reset');
  var url = app.base_url+$(t).attr('action');
    $('.autofocus').focus();
  app.post(url,fd,res=>{
    if(!res.err){
      location.href=res.url;
    }
  });
  return false;
}




var _add = (t)=>{
  var fd = $(t).serialize();
  $('#addForm').trigger('reset');
  var url = app.base_url+$(t).attr('action');
    $('.autofocus').focus();
  app.post(url,fd,res=>{
    responseData(res.res);
  });
  return false;
}

function _edit(t){
  var id = $(t).attr('data-id');
  var url = app.base_url+$(t).attr('data-url')+'/'+id;
  app.newWindow(url);
}

function _update(t){
  var fd = $(t).serialize();
  var url = app.base_url+$(t).attr('action');
  app.post(url,fd,res=>{
    $('.res').removeClass('hide');
    $('#res').html(res);
  });
  return false;
}

function _delete(t){
  var id = $(t).attr('data-id');
  var url = app.base_url+$(t).attr('data-url');
  var name = $('.data-name-'+id).text();
  var bill_no = $(t).attr('data-bill');
  var fd = {id:id,name:name,bill_no:bill_no};
  if(confirm("Are You sure to delete this item.")){
    app.post(url,fd,res=>{
      $('#row-'+id).remove();
      $('.res').removeClass('hide');
      $('#res').html(res);
    });
    
  }
  
}




var edit_stock_item = (t)=>{
  var fd = $(t).serialize();
  app.post(app.base_url+'stock-edit',fd,res=>{
    $('.res').removeClass('hide');
    $('#res').html(res);
  });
  return false;
}






function editStock(t){
  var id = $(t).attr('data-id');
  var name = $('.data-name-'+id).text();
  var category = $('.data-category-'+id).text();
  var qty = $('.data-qty-'+id).text();
  var url ="stock-edit/"+id+'/'+name+'/'+category+'/'+qty;
  app.newWindow(url);
}


function go_back(){
  if(history.length > 1)
    history.go(-1);
  else
    window.close();

  return false;
}




function numberOnly(e){
  return (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 13;
}











function init_DataTables() {
        
  console.log('run_datatables');
  
  if( typeof ($.fn.DataTable) === 'undefined'){ return; }
  console.log('init_DataTables');
  
  var handleDataTableButtons = function() {
    if ($("#datatable-buttons").length) {
    $("#datatable-buttons").DataTable({
      dom: "Blfrtip",
      buttons: [
      {
        extend: "copy",
        className: "btn-sm"
      },
      {
        extend: "csv",
        className: "btn-sm"
      },
      {
        extend: "excel",
        className: "btn-sm"
      },
      
      ],
      responsive: true
    });
    }
  };

  TableManageButtons = function() {
    "use strict";
    return {
    init: function() {
      handleDataTableButtons();
    }
    };
  }();

  $('#datatable').dataTable();

  $('#datatable-keytable').DataTable({
    keys: true
  });

  $('#datatable-responsive').DataTable();

  $('#datatable-scroller').DataTable({
    ajax: "js/datatables/json/scroller-demo.json",
    deferRender: true,
    scrollY: 380,
    scrollCollapse: true,
    scroller: true
  });

  $('#datatable-fixed-header').DataTable({
    fixedHeader: true
  });

  var $datatable = $('#datatable-checkbox');

  $datatable.dataTable({
    'order': [[ 1, 'asc' ]],
    'columnDefs': [
    { orderable: false, targets: [0] }
    ]
  });
  $datatable.on('draw.dt', function() {
    $('checkbox input').iCheck({
    checkboxClass: 'icheckbox_flat-green'
    });
  });

  TableManageButtons.init();
  
};

function convertNumberToWords(s) {
  var th = ['', 'thousand', 'million', 'billion', 'trillion'];

var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return '-';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'and ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    var a = str.replace(/\s+/g, ' ');
    return a.charAt(0).toUpperCase() + a.slice(1);
}







function setSearchFormAction(t){
  var end = jQuery(t).val();
  var route = jQuery(t).attr('route');
  jQuery('.search-form').attr('action','http://localhost:8080/'+route+'/'+end);
}



function setPendingOrders(orders){

  var html = '';
  jQuery('.pendingOrders').html('');  
  for (k in orders){
    var order = orders[k];
    var shipping = JSON.parse(order.orderAddress);
    
        html ='<br><br><table border="1" class="ship-tbl " style="width: 100%">\
                          <tr>\
                            <td rowspan="6" width="45px"></td>\
                            <td><strong>Customer Name</strong></td>\
                            <td>'+shipping.ship_first_name+' '+shipping.ship_last_name+'</td>\
                            <td></td>\
                          </tr>\
                          <tr>\
                            <td><strong>Shipping Address</strong></td>\
                            <td>\
                                 <br>'+shipping.ship_address+'\
                                          <br>'+shipping.ship_address_more+'\
                                          <br>'+shipping.ship_state_country+', \
                                          PIN - '+shipping.ship_zip+'\
                            </td>\
                            <td><strong>Order Number:</strong> #'+order.id+'</td>\
                          </tr>\
                              <tr>\
                            <td> <br></td>\
                            <td>\
                            </td>\
                            <td rowspan="3">\
                <svg id="barcode-'+k+'" class="print"></svg>\
                             </td>\
                          </tr>\
                          <tr>\
                            <td><strong>Contact Details</strong></td>\
                            <td>\
                                          Phone: '+shipping.ship_phone+'\
                                          <br>Email: '+shipping.ship_email+'\
                            </td>\
                            \
                          </tr>\
                          <tr>\
                            <td><strong>Route number</strong></td>\
                            \
                            <td>\
                            '+order.routeNumber+'\
                            </td>\
                          </tr>\
                            <tr>\
                            <td> <br></td>\
                            <td>\
                            \
                            </td>\
                            <td>\
                            \
                            </td>\
                          </tr>\
                          <tr>\
                          <td colspan="4" style="padding:0;vertical-align: top; border:0; "><table class="inner-table" style="width:100%;" border="1"><tr>\
                                <th width="45px">S no</th>\
                                <th>Item Name</th>\
                                <th>Quantity</th>\
                                <th style="width:40%">Remarks</th>\
                             \
                              </tr>';
                             
                             for(j in order.orderitems){
                                  var item =  order.orderitems[j];

                          if(item.pendingQty){
                             html +=' <tr>\
                                    <td>'+(j+1)+'</td>\
                                    <td>'+item.name+'</td>\
                                    <td>'+item.pendingQty+'</td>\
                                    <td>\
                                      \
                                    </td>\
                                   \
                                  </tr>';
                               }                         
                            }
                       html +='</table></td> </tr></table><div style="break-after:page"></div>';

            jQuery('.pendingOrders').append(html);  

            JsBarcode("#barcode-"+k, order.id);          
  }


}