const express = require("express");
const app = express();
const port = 3000;


// EJS SETUP:
app.set('view engine', 'ejs');
// STATIC FILES SETUP:
app.use(express.static("public"));


// CONNECT TO THE DATABASE & LISTEN:
app.use(express.urlencoded({ extended: true })); //this will helps to get submitted data of form in req.body object
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/school.db", (err) => {
    if (err) return console.error(err);
    console.log("school DB connected");
    app.listen(port, () => {
        console.log(`app listening on http://localhost:${port}`);
    })
});
module.exports.db = db



// ROUTES SETUP:

app.get("/", (req, res) => {
    res.redirect("/home")
});


// HOME:
app.get("/home", (req, res) => {
    res.render("Home", { title: "Students Data Manager" })
});


// ADD:
const Add = require("./routes/add-route")
app.use(Add)


// DELETE:
const Delete = require("./routes/delete-route")
app.use(Delete)


// EDIT:
const Edit = require("./routes/edit-route")
app.use(Edit)


// DISPLAY:
const Display = require("./routes/display-route")
app.use(Display)


// 404:
app.use((req, res) => {
    res.status(404).render("404", { title: "404" })
})