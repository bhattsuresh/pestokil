
var app = {};

app.name=process.env.APP_NAME
app.url=process.env.APP_URL
app.adminEmail = process.env.ADMIN_EMAIL
app.fromEmail = process.env.FROM_EMAIL
app.email = process.env.APP_EMAIL
app.phone = process.env.APP_PHONE
app.address = process.env.APP_ADDRESS


let d = new Date();
let m = 1+d.getMonth();
let day = d.getDate();
m = m < 10 ? '0'+m:m;
day = day < 10 ? '0'+day:day;



app.date = d.getFullYear()+'-'+m+'-'+day;
app.year = d.getFullYear();
app.month = m;
app.day = day;

app.time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

app.info = null;
app.key = process.env.APP_KEY;


var date = new Date();
var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
];

app.uniqueId = components.join("");

app.greetings = ()=>{
    d = new Date()
    var h=d.getHours()
     
    if (h>=4 && h<12)
        return 'Good Morning';
    else if (h>=12 && h<17)
        return 'Good Afternoon';
    else if (h>=17)
        return 'Good Evening';
    else 
        return 'Good Night';
}

app.greeting = app.greetings()

app.razorpay_key = process.env.RAZORPAY_KEY;
app.razorpay_secret = process.env.RAZORPAY_SECRET;


app.generateCertificate = (str)=>{
    var c = str.match(/\d+$/)[0];
    var c1=c;
    c++;
    str = str.replace(c1,c)
    console.log('str',str);
    return str;

}


//for app object global in server
global.config = app;

module.exports = global.config;