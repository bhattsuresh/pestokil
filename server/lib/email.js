class Email{

    constructor() {
        let nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD
            }
          });

        this.mailOptions = {
            from:`${process.env.APP_NAME} 👻 <${process.env.FROM_EMAIL}>`,
            to:process.env.ADMIN_EMAIL,
            subject:"Default email from "+process.env.APP_NAME
        };

    }

    from(from){    
        this.mailOptions.from = from;
        return this;
    }

    to(to){    
        this.mailOptions.to = to;
        return this;
    }

    sub(subject){    
        this.mailOptions.subject = subject;
        return this;
    }

    render(file,data={}){
        const  fs = require('fs'),path = require('path'),hbs = require('hbs');
        let file_path = path.join(__dirname,'../../client/email/' +file+'.html');
        if(fs.existsSync(file_path)) {
            var header_file = path.join(__dirname,'../../client/email/global/header.html');
            var footer_file = path.join(__dirname,'../../client/email/global/footer.html');
            var source = fs.readFileSync(header_file, 'utf8');
            source += fs.readFileSync(file_path, 'utf8');
            source += fs.readFileSync(footer_file, 'utf8');
              data.app = app;
            var template = hbs.compile(source);
            this.mailOptions.html=template(data);
          }else{
            this.mailOptions.text='email template not fount';
          }
      return this;
    }

    msg(body,html=false){
        if(html)
            this.mailOptions.html=body;
        else
            this.mailOptions.text=body;

        return this;
    }

    send(res){
        if(parseInt(process.env.IS_SMTP))
            this.transporter.sendMail(this.mailOptions,res);
    }

}


module.exports = new Email;

