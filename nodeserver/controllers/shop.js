const app = require('../app.js');
const db = app.get('db');

module.exports = {
    getAllProducts: (req, res) => {
        const offset = (parseInt(req.params.page) - 1) * 24;
        const limit = 24;
        const brand = req.query.brand;
        const os = req.query.os;
        const ram = req.query.ram;
        const processor = req.query.processor;
        const storage = req.query.storage;

        db.get_all_products(brand, os, ram, processor, storage, (err, products) => {
            res.json({
                total: products.length,
                data: products.splice(offset, limit) //for pagination 
            });
        })
    },
    getProductById: (req, res, next) => {
        const id = parseInt(req.params.productId);
        req.session.data = {};

        db.get_product(id, (err, product) => {
            req.session.data.productInfo = product;
            next();
        })
    },

    getSimilarById: (req, res, next) => {
        const price = parseInt(req.session.data.productInfo[0].price);
        const id = parseInt(req.params.productId);

        db.get_similar_product(price, id, (err, product) => {
            res.json({
                product: req.session.data.productInfo,
                similar: product.splice(0, 3)
            });
        })
    },
    addToCart: (req, res, next) => {
        const id = parseInt(req.body.productId);
        const quantity = parseInt(req.body.productQuantity);

        if (!req.user) res.json({ userLog: false })
        else {
            db.cart.insert({ product_id: id, product_quantity: quantity, customer_id: req.user.id }, function (err, response) {
                res.json({
                    userLog: true
                })
            })
        }
    },
    getFromCart: (req, res, next) => {
        if (!req.user) res.json({ userLog: false });
        else {
            db.cartview.find({ customer_id: req.user.id }, { order: "date_added desc" }, function (err, response) {
                res.json({
                    userLog: true,
                    data: response
                })
            })
        }
    },
    getInfo: (req, res, next) => {
        if (!req.user) res.json({ userLog: false })
        else {
            db.cartview.find({ customer_id: req.user.id }, { order: "date_added desc" }, function (err, response) {
                req.session.cart = response;
                db.customers.find({ id: req.user.id }, function (err, response) {
                    req.session.userInfo = response;
                    res.json({
                        data: req.session.cart,
                        userInfo: req.session.userInfo
                    })
                })
            })
        }
    },
    checkoutConfirm: (req, res, next) => {
        const userAddress = req.body.userAddress;
        const userCity = req.body.userCity;
        const userState = req.body.userState;
        const userZip = parseInt(req.body.userZip);

        if (!req.user) res.json({ userLog: false })
        else {
            db.cart.find({ customer_id: req.user.id }, function (err, cartRes) {
                for (var idx = 0; idx < cartRes.length; idx++) {
                    db.orders.insert({ customer_id: req.user.id, product_id: cartRes[idx].product_id, quantity: cartRes[idx].product_quantity, address: userAddress, city: userCity, state: userState, zip: userZip }, function (err, response) {
                        db.cart.destroy({ customer_id: req.user.id })
                    })
                }
                res.json({
                    orderSuccess: true
                })
            })
        }
    },
    getUserOrders: (req, res, next) => {
        if (!req.user) res.json({ userLog: false})
        else {
            db.ordersview.find({customer_id: req.user.id}, { order: "date_added desc" }, function (err, response){
                res.json({
                    data: response
                })
            })
        }
    }
}

