const express = require('express')
const app = express()
let mongoose = require("mongoose");

let body_parser = require("body-parser");
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

mongoose.connect(`mongodb://${process.env.username}:${process.env.password}@${process.env.host}:27017`, { useNewUrlParser: true });
var db = mongoose.connection;

let route = require("./router");
app.use('/',route)

if (!db) {
	console.log("Error DB connection");
} else {
	console.log("DB connected");
}

app.get("/", (req, res) => {
	res.send("Gym Slot Booking Application");
});

app.listen(3000,()=>{
    console.log("Server Started")
})