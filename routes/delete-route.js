const express = require("express")
const router = express.Router()
const { db } = require("../app")
var First_Name = "";
var Last_Name = "";
var Data = [];




// GET:
router.get("/delete", (req, res) => {
    res.render("Delete", { title: "Deletion Page" })
});



// POST:
router.post("/delete", (req, res) => {
    let obj = req.body;
    let firstName = obj.firstName, lastName = obj.lastName, age = obj.age, Class = obj.class, lessons = obj.lessons

    First_Name = firstName;
    Last_Name = lastName;

    db.all(`SELECT * FROM Students JOIN Lessons ON Students.LessonId = Lessons.LessonId ` +
        `WHERE FirstName LIKE "${firstName}" AND LastName LIKE "${lastName}" AND Age LIKE ${age} ` +
        `AND Class LIKE "${Class}" AND Students.LessonId LIKE ${lessons}`,
        (err, data) => {
            if (err) return console.error(err)
            Data = data;

            if (Data.length > 0) {
                db.run(`DELETE FROM Students WHERE FirstName LIKE "${firstName}" AND ` +
                    `LastName LIKE "${lastName}" AND Age LIKE ${age} AND Class LIKE "${Class}" AND LessonId LIKE ${lessons}`,
                    (err) => {
                        if (err) return console.error(err)
                        console.log(`Student ${firstName} ${lastName} has been deleted successfully`);
                        res.redirect("/delete-details")
                    })
            } else {
                res.redirect("/deletion-failed")
            }
        })
});



// DELETE-DETAILS:
router.get("/delete-details", (req, res) => {
    res.render("./details/delete-details", {
        title: "Deletion Details",
        firstName: First_Name,
        lastName: Last_Name
    })
});


// DELETION-FAILED:
router.get("/deletion-failed", (req, res) => {
    res.render("./details/deletion-failed", { title: "Deletion Failed" })
});


module.exports = router