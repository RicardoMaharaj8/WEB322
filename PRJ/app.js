// WEB322 Assignment 3-5

// dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const mongoose = require("mongoose");

// import keys
require("dotenv").config();

// js module import
let sections = require("./public/js/sections");
const productModel = require("./models/product");

// routes
const userRoute = require("./controllers/user");
const productRoute = require("./controllers/products");

// app object
const app = express();

// allow access to public folder assets
app.use(express.static("public"));

// use handlebars engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// body parser initalization
app.use(bodyParser.urlencoded({extended: false}));

// allow PUT and DELETE requests
app.use((req, res, next) => {
    if (req.query.method == "PUT") {
        req.method = "PUT";
    } else if (req.query.method == "DELETE") {
        req.method = "DELETE";
    }
    next();
});

// fileupload middleware
app.use(fileUpload());

// express-session middleware
app.use(
    session({
        secret: `${process.env.SECRET}`,
        resave: false,
        saveUninitialized: true
    })
);

// global user variable access for handlebars
app.use((req, res, next) => {
    res.locals.user = req.session.userInfo;
    next();
});

// home
app.get("/", (req, res) => {
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
            res.render("home", {
                title: "Home",
                secs: sections.getdb(),
                prods: products
            });
        })
        .catch((err) => console.log(err));
});

// use defined routes
app.use("/user", userRoute);
app.use("/products", productRoute);

// connect to MongoDB using mongoose
mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`MongoDB Connected`);
    })
    .catch((err) => console.log(err));

// start the web server on the defined PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Amazon Web App now running on port ${PORT}`);
});
