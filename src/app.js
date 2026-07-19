const express = require('express');
const app = express();

app.get("/user", (req, res) => {
    res.send({ firstName: "Sugam", lastName: "Parmar" });
});

app.get("/test", (req, res) => {
    res.send("Hello From the Server");
});

app.post("/user", (req,res) => {
//    saving data to the database logic goes here

    res.send("Post Request Received");
})



app.listen(7777, () => {
    console.log('Server is running on port 7777');
});