import express from "express";

const app = express()

app.use("/",(req, res) =>{
    res.send("hello from express server")
})
app.use("/about", (req, res) =>{
    res.send("about page")
})
app.listen(3009, () =>{
    console.log("sever is successfully listenig on port 3009")
}) 