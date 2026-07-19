const express = require('express');
const app = express();


// const { adminAuth , userAuth } = require('./middlewares/');

// app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
    res.send({ firstName: "Sugam", lastName: "Parmar" });
});

app.get("/user/login", (req, res) => {
throw new Error("User login failed");
res.send({ message: "User login successful" });
})


app.use("/", (err,req, res, next) => {
    if(err) {
        res.status(500).send("Internal Server Error");zz
    }
})


app.listen(7777, () => {
    console.log('Server is running on port 7777');
});