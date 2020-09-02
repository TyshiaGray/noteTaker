// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var db = require("./db/db.json")
var fs = require("fs")
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});








app.get("/api/notes", function (req, res) {
    res.json(db)
});

app.post("/api/notes", function (req, res) {
    if (db.length){
        req.body.id = db[db.length - 1].id + 1
    }else{
        req.body.id = 1
    }
    console.log(req.body)
    db.push(req.body)
    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) throw err
        // sends status that everything is ok
        res.sendStatus(200)
    })

});

app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id
    console.log(id)
    var location = 0
    for (var i = 0; i < db.length; i++) {
        if (db[i].id === parseInt(id)) {
            location = i
        }
    }
    console.log(location)
    db.splice(location, 1)
    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) throw err
        // sends status that everything is ok
        res.sendStatus(200)
    })

});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
});
