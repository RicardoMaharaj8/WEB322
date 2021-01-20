// 6 products to display on home and products page
// { n: name, i: image, p: price, b: bestseller }
// No longer in use in Assignmnet 3-5 due to MongoDB

let products = {
    db: [],
    makedb() {
        this.db.push({
            n: "Echo Dot 3rd Generation",
            i: "img/products/echo_dot.jpg",
            p: "$69.99",
            b: true
        });

        this.db.push({
            n: "Fire TV Stick",
            i: "img/products/Fire_TV_Stick.jpg",
            p: "$49.99",
            b: true
        });

        this.db.push({
            n: "Samsung 860 EVO 500GB SATA 2.5' Internal SSD",
            i: "img/products/Samsung_SSD.jpg",
            p: "$89.99",
            b: true
        });

        this.db.push({
            n: "SanDisk Ultra Flair USB 3.0 128GB Flash Drive",
            i: "img/products/Sandisk_USB.jpg",
            p: "$25.99",
            b: true
        });

        this.db.push({
            n: "AMD Ryzen 5 3600X 6-Core",
            i: "img/products/ryzen.jpg",
            p: "$309.99",
            b: false
        });

        this.db.push({
            n: "Logitech MK270 Wireless Combo",
            i: "img/products/Logitech_Combo.jpg",
            p: "$39.99",
            b: false
        });
    },

    getdb() {
        return this.db;
    }
};

products.makedb();
module.exports = products;
