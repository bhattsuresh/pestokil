const express = require('express')
const app = express()
const fs = require('fs')
require('dotenv').config();

const PORT = process.env.PORT
let con = null;
const hbs = require('hbs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', __dirname + '/src/views');
app.use(express.static(__dirname + '/src/public'));

app.set('view engine', 'html');
app.engine('html', hbs.__express)

app.use('/',require('./src/routes/web'));


app.use((req,res)=>{
  res.render('404');
});

const config = require('./src/config/setting');
//for web object global in client
app.locals.config = config;
// for server side get config obj in req.app.config
app.config = config;

hbs.registerHelper('include', function (view,args,options) {
 
  let data = {config,data:args}
  
	let file = __dirname + '/src/views/' + view+'.html';
    var template = hbs.compile(fs.readFileSync(file, 'utf8'));
    return new hbs.handlebars.SafeString(template(data));
});


app.listen(PORT,()=>{

    console.log(`Server is Running on http://localhost:${PORT}`)
});