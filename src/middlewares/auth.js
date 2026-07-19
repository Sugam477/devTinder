const adminAuth = (req, res, next) => {
    const token = "1234567890";
    const isAuthorized = token === "123456780";

    if (isAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized Access");
    }

    const userAuth = (req, res, next) => {
        const token = "1234567890";
        const isAuthorized = token === "1234567890";

        if (isAuthorized) {
            next();
        } else {
            res.status(401).send("Unauthorized Access");
        }
    }

    module.exports = { adminAuth, userAuth }