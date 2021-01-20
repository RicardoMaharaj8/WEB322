const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const path = require("path");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID);

router.get("/register", (req, res) => {
    res.render("user/register", {
        title: "Register"
    });
});

router.post("/register", (req, res) => {
    let errs = [];

    if (req.body.name == "") {
        errs.push("Name cannot be empty");
    }
    if (req.body.email == "") {
        errs.push("Email cannot be empty");
    }
    if (!req.body.email.match(/.*@.*/)) {
        errs.push("Email must have an '@'");
    }
    if (req.body.password == "") {
        errs.push("Password cannot be empty");
    }
    if (req.body.password.length < 8) {
        errs.push("Password must be longer than 8 characters");
    }
    userModel
        .find({email: req.body.email})
        .then((user) => {
            if (user != null) {
                errs.push("That email has already been used on this site");
            }
        })
        .catch((err) => {
            console.log(err);
        });
    if (errs.length > 0) {
        res.render("user/register", {
            title: "Register",
            errs: errs,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        let fname = "user.png";
        if (req.files != null) {
            req.files.pic.name = `${Math.random()}${
                path.parse(req.files.pic.name).ext
            }`;
            req.files.pic
                .mv(`public/img/up/${req.files.pic.name}`)
                .catch((err) => console.log(err));
            fname = req.files.pic.name;
        }
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            pic: fname
        };
        const user = new userModel(newUser);
        user.save()
            .then((user) => {
                req.session.userInfo = user;
                let msg = {
                    to: `${user.email}`,
                    from: "rmaharaj14@myseneca.ca",
                    subject: `Welcome to Amazon ${user.name}`,
                    html: `<p> Welcome to Amazon ${user.name} </p>
                    <p> Sent from Ricardo's Amazon web app </p>
                    <p> As part of my WEB322 Assignment #3-5 </p>`
                };
                sgMail
                    .send(msg)
                    .then(() => {
                        res.redirect("/user/dash");
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }
});

router.get("/login", (req, res) => {
    res.render("user/login", {
        title: "Login"
    });
});

router.post("/login", (req, res) => {
    let errs = [];

    if (req.body.email == "") {
        errs.push("Email cannot be empty");
    }
    if (req.body.password == "") {
        errs.push("Password cannot be empty");
    }
    if (errs.length > 0) {
        res.render("user/login", {
            title: "Login",
            errs: errs,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        userModel
            .findOne({email: req.body.email})
            .then((user) => {
                if (user == null) {
                    errs.push("Email and/or password is incorrect");
                    res.render("user/login", {
                        title: "Login",
                        errs: errs,
                        email: req.body.email,
                        password: req.body.password
                    });
                } else {
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then((match) => {
                            if (match) {
                                req.session.userInfo = user;
                                res.redirect("/user/dash");
                            } else {
                                errs.push("Email and/or password is incorrect");
                                res.render("user/login", {
                                    title: "Login",
                                    errs: errs,
                                    email: req.body.email,
                                    password: req.body.password
                                });
                            }
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/user/login");
});

router.get("/dash", (req, res) => {
    if (req.session.userInfo) {
        if (req.session.userInfo.type == "Admin") {
            res.render("user/dash-admin", {
                title: "Dashboard"
            });
        } else {
            res.render("user/dash-user", {
                title: "Dashboard"
            });
        }
    } else {
        res.redirect("/user/login");
    }
});

module.exports = router;
