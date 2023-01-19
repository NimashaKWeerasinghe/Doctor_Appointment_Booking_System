//Imports 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({server:server});

//mongoose.set('strictQuery', false);

//Databse Connection
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open',() => console.log('Database Connected') );

app.use(express.static(__dirname + '/assests/images'));
app.use(express.static(__dirname + '/assests/css'));

//Milddlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
}));

app.use((req,res,next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//Set Template Engine
app.set('view engine', "ejs");

//Route Prefix
app.use("", require('./routes/allRoutes'));

module.exports = server


app.get('/patientHome', (req,res) => {
    res.render("patientHome.ejs")
});

server.listen(PORT, () =>{
    console.log('Server started at http://localhost:5000');

});