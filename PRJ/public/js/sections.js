// 4 sections to display
// { n: name, i: image }
let sections = {
    db: [],
    makedb() {
        this.db.push({
            n: "Cell Phones & Accessories",
            i: "img/sections/Cell_Phones_Accessories.jpg"
        });

        this.db.push({
            n: "Shop Valentine's Day gifts",
            i: "img/sections/Valentines_Day_gifts.jpg"
        });

        this.db.push({
            n: "Nutrition & Wellness",
            i: "img/sections/Nutrition_Wellness.jpg"
        });

        this.db.push({
            n: "Shop deals in Tools",
            i: "img/sections/Shop_Deals_Tools.jpg"
        });
    },
    getdb() {
        return this.db;
    }
};

sections.makedb();
module.exports = sections;
