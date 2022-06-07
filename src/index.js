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

    return {message};
}

module.exports = {
    getMultiple,
    buy,
    getProducts
}