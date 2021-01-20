const express = require("express");
const router = express.Router();
const path = require("path");
const productModel = require("../models/product");
const isAdmin = require("../middleware/isAdmin");
const isLoggedIn = require("../middleware/isLoggedIn");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID);

router.get("/view", (req, res) => {
    let cats;
    productModel
        .find()
        .then((prods) => {
            cats = prods.map((prod) => {
                return prod.category;
            });
            productModel
                .find()
                .then((prods) => {
                    let products = prods.map((prod) => {
                        return {
                            i: prod.pic,
                            n: prod.name,
                            p: prod.price,
                            b: prod.bestseller,
                            _id: prod._id
                        };
                    });
                    res.render("products/view", {
                        title: "View Products",
                        prods: products,
                        cats: cats
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

router.get("/add", isAdmin, (req, res) => {
    res.render("products/add", {
        title: "Add Product"
    });
});

router.post("/search", (req, res) => {
    let cats;
    productModel
        .find()
        .then((prods) => {
            cats = prods.map((prod) => {
                return prod.category;
            });
            let find = req.body.search.toString().trim();
            productModel
                .find({category: find})
                .then((prods) => {
                    let products = prods.map((prod) => {
                        return {
                            i: prod.pic,
                            n: prod.name,
                            p: prod.price,
                            b: prod.bestseller,
                            _id: prod._id
                        };
                    });
                    res.render("products/view", {
                        title: "View Products",
                        prods: products,
                        cats: cats
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

router.get("/cart/:id", (req, res) => {
    res.redirect("/user/login");
});

router.post("/cart/:id", isLoggedIn, (req, res) => {
    req.session.cart = req.params.id;
    req.session.qty = req.body.quantity;
    res.redirect("/products/cart");
});

router.get("/cart", isLoggedIn, (req, res) => {
    if (req.session.cart == null) {
        res.redirect("/products/view");
    } else {
        productModel
            .findById({_id: req.session.cart})
            .then((product) => {
                let price = product.price * req.session.qty;
                Math.round(price);
                req.session.cart = product;
                req.session.price = price;
                res.render("products/cart", {
                    title: "Cart",
                    n: product.name,
                    p: price,
                    d: product.description,
                    q: req.session.qty,
                    i: product.pic,
                    b: product.bestseller
                });
            })
            .catch((err) => console.log(err));
    }
});

router.post("/checkout", (req, res) => {
    let msg = {
        to: `${req.session.userInfo.email}`,
        from: "rmaharaj14@myseneca.ca",
        subject: `Amazon checkout for ${req.session.userInfo.name}`,
        html: `<h2> Your Amazon order: </h2>
        <p> Product: ${req.session.cart.name} </p> 
        <p> Quantity: ${req.session.qty} </p>
        <p> Total: $${req.session.price} </p>
        <p> Thank you for shopping with Amazon! </p>
        <p> Sent from Ricardo's Amazon web app </p>
        <p> As part of my WEB322 Assignment #3-5 </p>`
    };
    req.session.cart = null;
    sgMail
        .send(msg)
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => console.log(err));
});

router.post("/add", isAdmin, (req, res) => {
    let bestseller = false;
    if (req.body.bestseller == "on") {
        bestseller = true;
    }
    const newProd = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description.trim(),
        category: req.body.category,
        quantity: req.body.quantity,
        bestseller: bestseller
    };
    const prod = new productModel(newProd);
    prod.save()
        .then((prod) => {
            req.files.pic = `${prod._id}${path.parse(req.files.pic.name).ext}`;
            req.files.pic
                .mv(`public/img/products/${req.files.pic}`)
                .then(() => {
                    productModel
                        .updateOne({_id: prod._id}, {pic: req.files.pic})
                        .then(() => {
                            res.redirect("/products/view");
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

router.get("/view/:id", (req, res) => {
    productModel
        .findById(req.params.id)
        .then((product) => {
            res.render("products/details", {
                title: product.name,
                n: product.name,
                p: product.price,
                d: product.description,
                c: product.category,
                q: product.quantity,
                b: product.bestseller,
                i: product.pic,
                _id: product._id
            });
        })
        .catch((err) => console.log(err));
});

router.get("/edit", isAdmin, (req, res) => {
    productModel
        .find()
        .then((prods) => {
            let products = prods.map((prod) => {
                return {
                    i: prod.pic,
                    n: prod.name,
                    p: prod.price,
                    b: prod.bestseller,
                    _id: prod._id
                };
            });
            res.render("products/edit-view", {
                title: "Edit Products",
                prods: products
            });
        })
        .catch((err) => console.log(err));
});

router.get("/edit/:id", isAdmin, (req, res) => {
    productModel
        .findById(req.params.id)
        .then((product) => {
            res.render("products/edit", {
                title: `Editing: ${product.name}`,
                n: product.name,
                p: product.price,
                d: product.description,
                c: product.category,
                q: product.quantity,
                b: product.bestseller,
                i: product.pic,
                _id: product._id
            });
        })
        .catch((err) => console.log(err));
});

router.put("/update/:id", isAdmin, (req, res) => {
    let bestseller = false;
    if (req.body.bestseller == "on") {
        bestseller = true;
    }
    productModel
        .findById({_id: req.params.id})
        .then((prod) => {
            req.files.pic.name = `${prod._id}${
                path.parse(req.files.pic.name).ext
            }`;
            req.files.pic
                .mv(`public/img/products/${req.files.pic.name}`)
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    const prod = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description.trim(),
        category: req.body.category,
        quantity: req.body.quantity,
        bestseller: bestseller,
        pic: req.files.pic.name
    };
    productModel
        .updateOne({_id: req.params.id}, prod)
        .then(() => {
            res.redirect("/products/edit");
        })
        .catch((err) => console.log(err));
});

module.exports = router;
