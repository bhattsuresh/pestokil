const express = require('express')
const app = express()
const fs = require('fs')
require('dotenv').config();
const config = require('./src/config/setting');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
let con = null;
const hbs = require('hbs')

const TWO_HOURS = 1000 * 60 ;
const {
  PORT=5000,
  NODE_ENV = 'developement',
  SESS_NAME = 'pestossid',
  SESS_SECRET = 'WE36DS$#$@#@',
  SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production'


 
var sessionStore = new SequelizeStore({
      db: require('./src/models').sequelize,
      cleanup: true
    });
sessionStore.sync()
app.use(session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    /*cookie: {
        maxAge: SESS_LIFETIME,
        sameSite:true,
        secure:IN_PROD
    }*/
}));

app.use((req,res,next)=>{
  app.config.greeting=config.greetings()

  app.locals.session = req.session;

  next();
});

app.set('views', __dirname + '/src/views');
app.use(express.static(__dirname + '/src/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'html');
app.engine('html', hbs.__express)

app.use('/',require('./src/routes/web'));


app.use((req,res)=>{
  res.render('404');
});


//for app object global in client we can use config.[property] to access all config
app.locals.config = config;
// for server side get config obj in req.app.config
app.config = config;


hbs.registerHelper('include', function (view,args,options) {
  
  let data = {config,data:args}
   // this code is use for session on include layouts
   data.session=app.locals.session;

	let file = __dirname + '/src/views/' + view+'.html';
    var template = hbs.compile(fs.readFileSync(file, 'utf8'));
    return new hbs.handlebars.SafeString(template(data));
});


hbs.registerHelper("counter", function(value, options){   
  return parseInt(value) + 1;
}); 

hbs.registerHelper("dateFormat", function(value, options) {
    let months = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let d = new Date(value);
    return d.getDate()+'-'+months[d.getMonth()]+'-'+d.getFullYear();
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


app.listen(PORT,()=>{

    console.log(`Server is Running on http://localhost:${PORT}`)
});