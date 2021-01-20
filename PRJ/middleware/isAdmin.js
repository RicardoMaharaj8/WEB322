const isAdmin = (req, res, next) => {
    if (req.session.userInfo) {
        if (req.session.userInfo.type == "Admin") {
            next();
        }
    } else {
        res.redirect("/user/login");
    }
};

module.exports = isAdmin;
