#WEBAPP FOR PESTOKIL

npx sequelize-cli model:create --name MyUser --attributes first_name:string,last_name:string,bio:text

 npx sequelize-cli model:create --name exporter --attributes company:string,name:string,address:text,address2:text,city:string,state:string,country:string,pincode:integer,mobile:string,phone:string,email:string,active:integer


 npx sequelize-cli model:create --name consignee --attributes company:string,name:string,address:text,address2:text,city:string,state:string,country:string,pincode:integer,mobile:string,phone:string,email:string,active:integer



 npx sequelize-cli model:create --name billing --attributes company:string,name:string,address:text,city:string,state:string,country:string,pincode:integer,mobile:string,phone:string,email:string,gstin:string,allowCertificate:string,active:integer



npx sequelize-cli model:create --name branch --attributes name:string,address:string,code:string,invoice:string,active:integer