const express = require('express');
const app = express();

app.use("/",(req, res) =>{
res.send("Namaste")

})


app.use("/test",(req, res) =>{
res.send("Hello From the Server")

})

app.use("/hello",(req, res) =>{
res.send("Hello hello hello")

})


app.listen(7777, () => {
    console.log('Server is running on port 7777');
});