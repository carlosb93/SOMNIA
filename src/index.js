const db = require('./db');
const config = require('./config');

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
    INNER JOIN profile ON product.profile_id = profile.id LIMIT ?,?`, [offset, config.listPerPage]);
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

        const activo = true;

        const fecha = Date.now();

        const product_res = db.run('INSERT INTO product (profile_id, product, route, transfer_code, activo ) VALUES (@profil' +
                'e_id, @product, @route, @transfer_code, @activo,@fecha)', {profile_id, product, route, transfer_code,activo,fecha});
    }
    let message = 'Error in creating profile';
    if (result.changes) {
        message = 'profile created successfully';
    }


    const send = require('gmail-send')({
        //const send = require('../index.js')({
          user: 'playeralfa22@gmail.com',
          // user: credentials.user,               // Your GMail account used to send emails
          pass: '93050807702',
          // pass: credentials.pass,               // Application-specific password
          to:   email,
          // to:   credentials.user,               // Send to yourself
          //                                       // you also may set array of recipients:
          //                                       // [ 'user1@gmail.com', 'user2@gmail.com' ]
          // from:    credentials.user,            // from: by default equals to user
          // replyTo: credentials.user,            // replyTo: by default `undefined`
          
          // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
          //                                       // (but no any processing will be done on them)
          
          subject: '!Aqui tienes tu videocurso!  '+ product,
          
          html:    emailtemplate(name, surname, product)           // HTML
          // files: [ filepath ],                  // Set filenames to attach (if you need to set attachment filename in email, see example below
        });
        
        

        
        
        
        console.log('sending test email');
        
        // Override any default option and send email
        
        send({ // Overriding default parameters
          subject: '!Aqui tienes tu videocurso!',         // Override value set as default
        }, function (err, res, full) {
          if (err) return console.log('* [example 1.1] send() callback returned: err:', err);
          console.log('* [example 1.1] send() callback returned: res:', res);
          // uncomment to see full response from Nodemailer:
          // console.log('* [example 1.2] send() callback returned: full:', full);
        });

   
    return {message};
}
function emailtemplate(name, surname, product) {

    const plantilla = `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <title>
    
        </title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            #outlook a {
                padding: 0;
            }
    
            .ReadMsgBody {
                width: 100%;
            }
    
            .ExternalClass {
                width: 100%;
            }
    
            .ExternalClass * {
                line-height: 100%;
            }
    
            body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
    
            p {
                display: block;
                margin: 13px 0;
            }
        </style>
        <!--[if !mso]><!-->
        <style type="text/css">
            @media only screen and (max-width:480px) {
                @-ms-viewport {
                    width: 320px;
                }
    
                @viewport {
                    width: 320px;
                }
            }
        </style>
    
    
        <style type="text/css">
            @media only screen and (min-width:480px) {
                .mj-column-per-100 {
                    width: 100% !important;
                }
            }
        </style>
    
    
        <style type="text/css">
        </style>
    
    </head>
    
    <body style="background-color:#f9f9f9;">
    
    
        <div style="background-color:#f9f9f9;">
    
    
    
    
            <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                    <tbody>
                        <tr>
                            <td
                                style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
    
    
            <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="background:#fff;background-color:#fff;width:100%;">
                    <tbody>
                        <tr>
                            <td
                                style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
    
                                <div class="mj-column-per-100 outlook-group-fix"
                                    style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
    
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                        style="vertical-align:bottom;" width="100%">
    
                                        <tr>
                                            <td align="center"
                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
    
                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                    role="presentation"
                                                    style="border-collapse:collapse;border-spacing:0px;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:64px;">
    
                                                                <img height="auto" src="https://i.imgur.com/KO1vcE9.png"
                                                                    style="border:0;display:block;outline:none;text-decoration:none;width:100%;"
                                                                    width="64" />
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="center"
                                                style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
    
                                                <div
                                                    style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                    !!! SOMNIA PUBLICITY !!!
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
    
                                                <div
                                                    style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                    Hello  ${name}  ${surname} !<br></br>
                                                    Gracias por comprar nuestro videocurso ${product}.Aqui esta tu link de
                                                    descarga:
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="center"
                                                style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
    
                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                    role="presentation" style="border-collapse:separate;line-height:100%;">
                                                    <tr>
                                                        <td align="center" bgcolor="#2F67F6" role="presentation"
                                                            style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;"
                                                            valign="middle">
                                                            <p
                                                                style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                Descargar
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
    
                                                <div
                                                    style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                    Saludos,<br><br> SOMNIA Publicity<br>
                                                    <a href="https://somniapublicity.herokuapp.com"
                                                        style="color:#2F67F6">somniapublicity.herokuapp.com</a>
                                                </div>
    
                                            </td>
                                        </tr>
    
                                    </table>
    
                                </div>
    
    
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
    
            <div style="Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                    <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
    
    
                                <div class="mj-column-per-100 outlook-group-fix"
                                    style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
    
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:bottom;padding:0;">
    
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                        width="100%">
    
                                                        <tr>
                                                            <td align="center"
                                                                style="font-size:0px;padding:0;word-break:break-word;">
    
    
    
                                                            </td>
                                                        </tr>
    
                                                        <tr>
                                                            <td align="center"
                                                                style="font-size:0px;padding:10px;word-break:break-word;">
    
    
    
                                                            </td>
                                                        </tr>
    
                                                    </table>
    
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>`;
   return plantilla;
}

module.exports = {
    getMultiple,
    buy,
    getProducts
}