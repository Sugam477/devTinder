const express = require('express');
const app = express();

app.get("/user", (req, res) => {
    res.send({ firstName: "Sugam", lastName: "Parmar" });
});

app.get("/test/:userId/:name/:password", (req, res) => {
    console.log(req.params)
    console.log(req.query)
    res.send("Hello From the Server");
});

app.post("/user", (req,res) => {
//    saving data to the database logic goes here

    res.send("Post Request Received");
})



app.listen(7777, () => {
    console.log('Server is running on port 7777');
});