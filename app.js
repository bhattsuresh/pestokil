const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');

const web = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = require('./server/config/setting');
const fs = require('fs');

var SequelizeStore = require("connect-session-sequelize")(session.Store);
 
process.env.TZ = 'Asia/Kolkata';
const data = {};
const TWO_HOURS = 1000 * 60 ;
const {
	PORT=5000,
	NODE_ENV = 'developement',
	SESS_NAME = 'cosmossid',
	SESS_SECRET = 'WE32DS$#$@#@',
	SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production'
//for web object global in client
web.locals.app = app;




web.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({ extended: true }));

web.use(cookieParser());



web.use(session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: require('./server/models').sequelize,
      cleanup: true
    }),
    /*cookie: {
        maxAge: SESS_LIFETIME,
        sameSite:true,
        secure:IN_PROD
    }*/
}));



web.use((req,res,next)=>{
	web.locals.session = req.session;
	next();
});




web.use('/',require('./server/routes/web'));

web.use('/admin',require('./server/routes/admin'));
web.use('/api',require('./server/routes/api'));



web.set('views', __dirname + '/client/views');
web.use(express.static(__dirname + '/client/public'));
web.use(express.static(__dirname + '/client/public/admin'));



  
web.set('view engine', 'html');
web.engine('html', hbs.__express)

hbs.registerHelper('include', function (view,args,options) {
	if(data.app == undefined)
		data.app = app;
	data.session=web.locals.session;
	let file = __dirname + '/client/views/' + view+'.html';
    var template = hbs.compile(fs.readFileSync(file, 'utf8'));
    return new hbs.handlebars.SafeString(template(data));
});

hbs.registerHelper("count", function(value, options) {
		return value.length;
});

hbs.registerHelper("dateFormat", function(value, options) {
		let months = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		let d = new Date(value);
		return d.getDate()+'-'+months[d.getMonth()]+'-'+d.getFullYear();
});

hbs.registerHelper("per", function(val1, val2, options) {
		if(typeof options == 'object')
			return (parseFloat(val1) * parseFloat(val2)/100).toFixed(3);

		var amt =  (((parseFloat(val1) * parseFloat(val2)) * options) / 100);
		return amt.toFixed(3);
});


hbs.registerHelper("set", function(name, val, options) {
		options.data.root[name] = val;
	});

	hbs.registerHelper("add", function(name, val, options) {
	if(options.data.root[name] == undefined)
		options.data.root[name]=0;

	options.data.root[name] += parseFloat(val);
	});

hbs.registerHelper("inc", function(value, options){   
	return parseInt(value) + 1;
	}); 

hbs.registerHelper("inArray", function(value,array, options){ 
	if(array == null)
		return true;
	return array.indexOf(value)+1;
	}); 



hbs.registerHelper("unique", function(name, value, options)
	{  
		if(options.data.root[name] == undefined)
			options.data.root[name] = [];
	  if(options.data.root[name].indexOf(value) > -1){
	  	return false;
	  }else{
	  	options.data.root[name].push(value);
	  	return true;
	  }

}); 

	hbs.registerHelper("math", function(a,b, options)
	{
	switch (options){
		case '+':
			return (parseFloat(a) +  parseFloat(b)).toFixed(3);
		case '-':
			return (parseFloat(a) -  parseFloat(b)).toFixed(3);
		case '*':
			return (parseFloat(a) *  parseFloat(b)).toFixed(3);
		case '/':
			return (parseFloat(a) /  parseFloat(b)).toFixed(3);
		case '%':
			return (parseFloat(a) % parseFloat(b)).toFixed(3);
		default:
			return (parseFloat(a)).toFixed(3) ;           
	}
		
	}); 
	
	
	hbs.registerHelper({
		not:(v1) => !v1,
		eq: (v1, v2) => v1 == v2,
		eqt: (v1, v2) => v1 === v2,
		ne: (v1, v2) => v1 != v2,
		net: (v1, v2) => v1 !== v2,
		lt: (v1, v2) => v1 < v2,
		gt: (v1, v2) => v1 > v2,
		lte: (v1, v2) => v1 <= v2,
		gte: (v1, v2) => v1 >= v2,
		and() {
			return Array.prototype.every.call(arguments, Boolean);
		},
		or() {
			return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
		}
	});

hbs.registerHelper("json", function(a,b, options){
	if(!b)
		return  typeof a == "string" ? JSON.parse(a) : a;
	return  typeof a == "string" ? JSON.parse(a)[b] : a[b];
});


web.use(function(req,res){
    res.render('404');
});

web.listen(PORT, function() {
	console.log('http://localhost:'+PORT);
});

