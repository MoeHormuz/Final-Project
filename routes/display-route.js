const express = require("express")
const router = express.Router()
const { db } = require("../app")
var Data = [];




// GET:
router.get("/display", (req, res) => {
    res.render("Display", { title: "Display Page" })
});



// POST:
router.post("/display", (req, res) => {
    let obj = req.body;
    let firstName = obj.firstName, lastName = obj.lastName, Class = obj.class

    db.all(`SELECT StudentId, FirstName, LastName, Age, Class, RegDate, LessonName, DepartmentName ` +
        `FROM Students JOIN Lessons ON Students.LessonId = Lessons.LessonId ` +
        `WHERE FirstName LIKE "${firstName}" AND LastName LIKE "${lastName}" AND Class LIKE "${Class}"`,
        (err, data) => {
            if (err) return console.error(err)
            Data = data;
            if (Data.length > 0) {
                console.log(`Student ${firstName} ${lastName} data has been successfully displayed`);
                res.redirect("/display-details")
            } else {
                res.redirect("/display-failed")
            }
        })
});



// DISPLAY-DETAILS
router.get("/display-details", (req, res) => {
    res.render("./details/display-details", {
        title: "Display Details",
        data: Data
    })
});

// DISPLAY-FAILED
router.get("/display-failed", (req, res) => {
    res.render("./details/display-failed", { title: "Display Failed" })
});





module.exports = router