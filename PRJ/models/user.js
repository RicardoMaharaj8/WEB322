const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    pic: {type: String},
    dateCreated: {type: Date, default: Date.now()},
    type: {type: String, default: "User"}
});

userSchema.pre("save", function (next) {
    bcrypt
        .genSalt(10)
        .then((salt) => {
            bcrypt
                .hash(this.password, salt)
                .then((encryptedPassword) => {
                    this.password = encryptedPassword;
                    next();
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
