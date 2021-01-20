const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String},
    price: {type: String},
    description: {type: String},
    category: {type: String},
    quantity: {type: String},
    bestseller: {type: Boolean, default: false},
    pic: {type: String},
    dateCreated: {type: Date, default: Date.now()}
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
