// BUILD YOUR SERVER HERE
const express = require("express")
const db = require("./users/model")

const server = express()

server.use(express.json())

//Read users (GET) Returns an array 
server.get("/api/users", (req, res) => {
	res.json({ message: "Hello, World" })
})

//Read users (GET) Returns the user object with the specified id
server.get("/api/users/:id", (req, res) => {
	const users = db.find()
	res.json(users)
})

//Create new user (POST) Creates a user using the information sent inside the 'request body'
server.post("/api/users", (req, res) => {
	const newUser = db.createUser({
        id: req.body.id,
        name: req.body.name,
        bio: req.body.bio
	})

	res.status(201).json(newUser)
})

//Update a user (PUT) Updates the user with the specified `id` using data from the `request body`. Returns the modified user
server.put("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if (user) {
        const updatedUser = db.updateUser(user.id, {
            id: req.body.id,
            name: req.body.name,
            bio: req.body.bio
        })

        res.json(updatedUser)
    } else {
        res.status(404).json({
            message: "User not found"
        })
    }
})

//Delete user (DELETE) Removes the user with the specified `id` and returns the deleted user.
server.delete("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if (user) {
        db.deleteUser(user.id)
        console.log(user)

        req.status(204).end()
    } else {
        res.status(404).json({
            message: "User not found"
        })
    }
})

module.exports = server // EXPORT YOUR SERVER instead of {}
