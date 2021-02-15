const express = require("express")
const db = require("./users/model")

const server = express()
server.use(express.json())


server.get("/", (req, res) => {
    res.json({ message: "Hello, World" })
})

//Create new user (POST) Creates a user using the information sent inside the 'request body'
server.post("/api/users", (req, res) => {
    const newUser = db.insert({
        id: db.shortid,
        name: req.body.name,
        bio: req.body.bio,
    })
    newUser.then(() => {
        if (!req.body.name || !req.body.bio) {
            return res.status(400).json({ message: "Please provide name and bio for the user" })
        } else {
            res.status(201).json(newUser)
        }
    })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: " There was an error while saving the user to the database" })
        })

})

//Read users (GET) Returns an array 
server.get("/api/users", (req, res) => {
    const users = db.find()
    users
        .then((user) => {
            res.json(user)
        })
        .catch(() => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})

// Read users (GET) Returns the user object with specified id
server.get("/api/users/:id", (req, res) => {
    const users = db.findById(req.params.id)
    users.then((user) => {
        if (req.params.id) {
            res.json(user)
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
    })
        .catch(() => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

//Delete user (DELETE) Removes the user with the specified `id` and returns the deleted user.
server.delete("/api/users/:id", (req, res) => {
    const users = db.remove(req.params.id)
    users.then((user) => {
        if (req.params.id) {
            res.json(user)
        } else {
            { res.status(500).json({ message: "TThe user with the specified ID does not exist" }) }
        }
    })
        .catch(() => {
            res.status(500).json({ message: "The user could not be removed" })
        })
})

//Update a user (PUT) Updates the user with the specified `id` using data from the `request body`. Returns the modified user
server.put("/api/users/:id", (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    const users = db.update(id, req.body)
    users.then((user) => {
        if (!id) { res.status(404).json({ message: "The user with the specified ID does not exist" }) }
        else if (!name || !bio) { res.status(400).json({ message: "Please provide name and bio for the user" }) }
        else if (id && name && bio) { res.status(200).json(user) }
    })
        .catch(() => {
            res.status(500).json({ message: "The user could not be removed" })
        })
})

module.exports = server 
