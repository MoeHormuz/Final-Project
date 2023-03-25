const express = require("express")
const router = express.Router()
const { db } = require("../app")
var oldFirstName, oldLastName, oldAge, oldClass, oldLessons;
var newFN, newLN;
var dataObj = {};
var DesignAndDatabase = [
    {
        "label": "Design",
        "value1": 1111,
        "text1": "Adobe",
        "value2": 2222,
        "text2": "Photoshop"
    },
    {
        "label": "Databases",
        "value1": 3333,
        "text1": "SQL",
        "value2": 4444,
        "text2": "MongoDB"
    },
];
var Programming = [
    {
        "label": "Programming",
        "value1": 5555,
        "text1": "JavaScript",
        "value2": 6666,
        "text2": "Python",
        "value3": 7777,
        "text3": "Ruby",
        "value4": 8888,
        "text4": "PHP"
    }
];




// GET:
router.get("/edit", (req, res) => {
    res.render("Edit", { title: "Editing Page" })
});



// FIRST POST:
router.post("/edit", (req, res) => {
    let obj = req.body;
    let firstName = obj.firstName, lastName = obj.lastName, age = obj.age, Class = obj.class, lessons = obj.lessons

    oldFirstName = firstName;
    oldLastName = lastName;
    oldAge = age;
    oldClass = Class;
    oldLessons = lessons;

    dataObj = {
        "firstName": firstName,
        "lastName": lastName,
        "age": age,
        "Class": Class,
        "lessons": lessons
    }

    db.all(`SELECT * FROM Students JOIN Lessons ON Students.LessonId = Lessons.LessonId ` +
        `WHERE FirstName LIKE "${firstName}" AND LastName LIKE "${lastName}" AND Age LIKE ${age} ` +
        `AND Class LIKE "${Class}" AND Students.LessonId LIKE ${lessons}`,
        (err, data) => {
            if (err) return console.error(err)

            if (data.length > 0) {
                res.redirect("/edit-data")
            } else {
                res.redirect("/edit-failed")
            }
        })
});



// EDIT-FAILED:
router.get("/edit-failed", (req, res) => {
    res.render("./details/edit-failed", { title: "Edit Failed" })
});



// EDIT-DATA:
router.get("/edit-data", (req, res) => {
    res.render("./details/edit-data", {
        title: "Edit Information",
        obj: dataObj,
        DD: DesignAndDatabase,
        P: Programming
    })
});


// SECOND POST:
router.post("/edit-data", (req, res) => {
    let obj = req.body;
    let newFirstName = obj.firstName, newLastName = obj.lastName, newAge = obj.age, newClass = obj.class, newLessons = obj.lessons

    newFN = newFirstName;
    newLN = newLastName;

    db.all(`SELECT * FROM Students JOIN Lessons ON Students.LessonId = Lessons.LessonId ` +
        `WHERE FirstName LIKE "${newFirstName}" AND LastName LIKE "${newLastName}" AND Age LIKE ${newAge} ` +
        `AND Class LIKE "${newClass}" AND Students.LessonId LIKE ${newLessons}`,
        (err, data) => {
            if (err) return console.error(err)

            if (data.length < 1) {
                db.run(`UPDATE Students SET FirstName = "${newFirstName}", LastName = "${newLastName}", Age = ${newAge}, Class = "${newClass}", LessonId = ${newLessons} ` +
                    `WHERE FirstName LIKE "${oldFirstName}" AND LastName LIKE "${oldLastName}" ` +
                    `AND Age LIKE ${oldAge} AND Class LIKE "${oldClass}" AND LessonId LIKE ${oldLessons}`,
                    (err) => {
                        if (err) return console.error(err)
                        console.log(`Student ${newFirstName} ${newLastName} data has been edited successfully`);
                        res.redirect("/edit-details")
                    })
            } else {
                res.redirect("/editing-failed")
            }
        })
})



// EDIT-DETAILS:
router.get("/edit-details", (req, res) => {
    res.render("./details/edit-details", {
        title: "Editing Details",
        firstName: newFN,
        lastName: newLN
    })
});



// EDITING-FAILED:
router.get("/editing-failed", (req, res) => {
    res.render("./details/editing-failed", { title: "Edit Failed" })
});





module.exports = router