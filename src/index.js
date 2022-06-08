const db = require('./db');
const {templateconfirm, templatedownload, templateAlert} = require('./templates');
const config = require('./config');
require('dotenv').config();
const Nylas = require('nylas');

function getMultiple(page = 1) {
    const offset = (page - 1) * config.listPerPage;
    const data = db.query(`SELECT * FROM profile LIMIT ?,?`, [offset, config.listPerPage]);
    const meta = {
        page
    };

    return {data, meta}
}

function getProducts(page = 1) {
    const offset = (page - 1) * config.listPerPage;
    const data = db.query(`SELECT product.id AS id, profile.name AS name, profile.surname AS surname, profile.email AS email, product.product AS product, product.route AS route, product.transfer_code AS transfer_code, product.profile_id AS profile_id, product.activo AS activo, product.fecha AS fecha FROM product 
    INNER JOIN profile ON product.profile_id = profile.id WHERE product.activo = 1 LIMIT ?,?`, [offset, config.listPerPage]);
    const meta = {
        page
    };
console.log(data);
return {data, meta}
}

function validateCreate(req) {
    let messages = [];

    console.log(req);

    if (!req) {
        messages.push('No object is provided');
    }

    if (!req.name) {
        messages.push('name is empty');
    }

    if (!req.surname) {
        messages.push('surname is empty');
    }
    if (!req.email) {
        messages.push('email is empty');
    }

    if (messages.length) {
        let error = new Error(messages.join());
        error.statusCode = 400;

        throw error;
    }
}

function aprovePurchase(req, res) {
    console.log(req)
    //email
    //product
    const {
        email,
        product,
        transfer_code,} = req;

    const user = db.query(`SELECT * FROM profile WHERE email = ?`, [email]);
    const result = {};
    const products = db.query(`SELECT * FROM product WHERE profile_id = ? AND product = ? AND transfer_code = ?`, [user.id, product, transfer_code]);
   

    Nylas.config({
        clientId:process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });
    const nylas = Nylas.with(process.env.ACCESS_TOKEN);

    const draft = nylas.drafts.build({
        subject: '!Aqui tienes tu videocurso!  '+ product,
        to: [{ email: email }],
        body: emailtemplate(user.name, user.surname, product),
      });
    
    // Sending the draft
    
    draft.send().then(message => {
      console.log(`${message.id} was sent`);
    });

    
    db.query(`UPDATE product SET activo=0 WHERE profile_id = ? AND product = ? AND transfer_code = ?`, [user.id, product, transfer_code]);
    return {message};
}


function buy(req, res) {
    console.log(req)
    validateCreate(req);
    const {
        name,
        surname,
        email,
        product,
        route,
        transfer_code
    } = req;
    const user_test = db.query(`SELECT * FROM profile WHERE email = ?`, [email]);
    const result = {};
    if (!user_test[0]) {
        result = db.run('INSERT INTO profile (name, surname, email ) VALUES (@name, @surname, @email)', {name, surname, email});
    }
    const product_test = db.query(`SELECT * FROM product WHERE transfer_code = ?`, [transfer_code]);
    if (!product_test[0]) {

        const user = db.query(`SELECT * FROM profile WHERE email = ?`, [email]);

        const profile_id = user[0].id;

        const activo = 1;

        const fecha = Date.now();

        const product_res = db.run('INSERT INTO product (profile_id, product, route, transfer_code, activo ) VALUES (@profil' +
                'e_id, @product, @route, @transfer_code, @activo)', {profile_id, product, route, transfer_code,activo});
    }
    let message = 'Error in creating profile';
    if (result.changes) {
        message = 'profile created successfully';
    }

    Nylas.config({
        clientId:process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });
    const nylas = Nylas.with(process.env.ACCESS_TOKEN);
    const draft = nylas.drafts.build({
        subject: '!Procesando su compra!  '+ product,
        to: [{ email: email }],
        body: emailtemplate(name, surname),
      });
    
    // Sending the draft
    
    draft.send().then(message => {
      console.log(`${message.id} was sent`);
    });
    const draft_admin = nylas.drafts.build({
        subject: '!Peticion de compra!  '+ product,
        to: [{ email: 'playeralfa22@gmail.com' }],
        body: emailtemplateadmin(name, surname, email, product, transfer_code),
      });
      
      // Sending the draft
      
      draft_admin.send().then(message => {
        console.log(`${message.id} was sent`);
      });
  
   
    return {message};
}
function emailtemplate(name, surname, product=null) {
    let plantilla  = '';
    let link  = '';
    if(product != null){
        if(product = 'Curso de Fotografía y edición Móvil'){
            link ='1';
        }else{
            link = '2';
        }
        plantilla = templatedownload(name, surname, product, link)
    }else {
        plantilla = templateconfirm(name, surname)
    }

   return plantilla;
}
function emailtemplateadmin(name, surname, email, product, transcode) {
    let plantilla = templateAlert(name, surname, email, product, transcode)
   return plantilla;
}

module.exports = {
    getMultiple,
    buy,
    getProducts,
    aprovePurchase
}