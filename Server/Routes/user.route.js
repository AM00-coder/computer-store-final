const express = require('express');
const usersRouter = express.Router();
const User = require('../Models/UserSchema');

// ✅ GET all users
usersRouter.get("/", async (req, res) => {
    let users = await User.find({}, { _id: 0 });
    res.status(200).send(users);
});

// ✅ GET user by email
usersRouter.get("/:email", async (req, res) => {
    let users = await User.find({ email: req.params.email });
    res.status(200).send(users);
});

// ✅ POST register
usersRouter.post("/register", async (req, res) => {
    let user = new User(req.body);
    await user.save();
    res.status(200).send(user);
});

// ✅ PUT update full user by name
usersRouter.put("/update/:name", async (req, res) => {
    let user = await User.updateOne({ name: req.params.name }, { $set: req.body });
    res.status(200).send(user);
});

// ✅ PUT update job by name
usersRouter.put("/updateJob/:name", async (req, res) => {
    let user = await User.updateOne({ name: req.params.name }, { $set: { job: req.body.job } });
    res.status(200).send(user);
});

// ✅ POST login 🔥 (add this!)
usersRouter.post('/login', async (req, res) => {
    const { mail, password } = req.body;

    try {
        const user = await User.findOne({ email: mail, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = usersRouter;
