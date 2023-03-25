const express = require("express")
const router = express.Router()
const { db } = require("../app")
var First_Name = "";
var Last_Name = "";
var Data = [];




// GET:
router.get("/add", (req, res) => {
    res.render("Add", { title: "Addition Page" })
});


// POST:
router.post("/add", (req, res) => {
    let obj = req.body;
    let firstName = obj.firstName, lastName = obj.lastName, age = obj.age, Class = obj.class, lessons = obj.lessons
    let StudentId = Date.now();
    let RegDate = new Date().toLocaleDateString();

    First_Name = firstName;
    Last_Name = lastName;

    db.all(`SELECT * FROM Students JOIN Lessons ON Students.LessonId = Lessons.LessonId ` +
        `WHERE FirstName LIKE "${firstName}" AND LastName LIKE "${lastName}" AND Age LIKE ${age} ` +
        `AND Class LIKE "${Class}" AND Students.LessonId LIKE ${lessons}`,
        (err, data) => {
            if (err) return console.error(err)
            Data = data;

            if (Data.length < 1) {
                db.run(`INSERT INTO Students (StudentId, FirstName, LastName, Age, Class, RegDate, LessonId)` +
                    `VALUES (${StudentId}, "${firstName}", "${lastName}", ${age}, "${Class}", "${RegDate}", ${lessons})`,
                    (err) => {
                        if (err) return console.error(err)
                        console.log(`Student ${firstName} ${lastName} has been added successfully`);
                        res.redirect("/add-details")
                    })
            } else {
                res.redirect("/addition-failed")
            }
        })
});


// ADD-DETAILS:
router.get("/add-details", (req, res) => {
    res.render("./details/add-details", {
        title: "Addition Details",
        firstName: First_Name,
        lastName: Last_Name
    })
});

// ADDITION-FAILED:
router.get("/addition-failed", (req, res) => {
    res.render("./details/addition-failed", { title: "Addition Failed" })
});




module.exports = router