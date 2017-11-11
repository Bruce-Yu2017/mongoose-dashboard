

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var session = require('express-session');
app.use(session({secret: 'codingdojorocks'}));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');
var path = require('path');
app.set('views', path.join(__dirname, './views'));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongooseDashboard');

app.get("/", function(req, res) {
    Goose.find({}, function(req, goose) {
        // console.log(goose);
        res.render("index", {gooses: goose})
    })
})

app.get("/mongooses/new", function(req, res) {
    res.render("new");
})

var GooseSchema = new mongoose.Schema({
    name: {type: String},
    creater: {type:String}
}, {timestamps: true})
mongoose.model("Goose", GooseSchema);
var Goose = mongoose.model("Goose");
mongoose.Promise = global.Promise;

app.post("/mongooses", function(req, res) {
    var goose = new Goose(req.body);
    goose.save(function(err) {
        if(err) {
            res.redirect("/new");
        }
        else {
            res.redirect("/")
        }
    })
})

app.get("/mongooses/:id", function(req, res) {
    var goose = req.params.id;
    Goose.find({_id: goose}, function(req, goose) {
        console.log(goose);
        res.render("show", {gooses: goose})
    })
})

app.get("/mongooses/edit/:id", function(req, res) {
    var goose = req.params.id;
    Goose.findOne({_id: goose}, function(req, result) {
        console.log(goose);
        res.render("edit", {gooses: result})
    })
})

app.post("/mongooses/:id", function(req, res) {
    var gooseid = req.params.id;
    Goose.update({_id: gooseid}, req.body, function(err) {
        if(err) {
            console.log(err);
            res.redirect("/mongooses/edit/" + gooseid);
        }
        else {
            res.redirect("/")
        }
    })
})

app.post("/mongooses/destroy/:id", function(req, res) {
    var goose = req.params.id;
    Goose.remove({_id: goose}, function(err) {
        res.redirect("/")
    })
})

app.listen(8000, function() {
    console.log("successfully connect!")
})