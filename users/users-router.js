const bcrypt = require('bcryptjs')
const express = require('express')

const Users = require('./user-modules.js')
const restricted = require('../data/restricted-middleware.js')


const router = express.Router();

router.get("/users", restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.send(err));
})

router.post("/register", (req, res) => {
    let user = req.body

    const hash = bcrypt.hashSync(user.password, 10)

    user.password = hash
    Users.add(user)
        .then(saved => {
            req.session.loggedIn = true

            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error);
          });
})

router.post("/login", (req, res) => {
    const { username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                req.session.loggedIn = true
                req.session.username = user.username;

                res.status(200).json({ message: `Welcome ${user.username}`});
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
              }
        })
        .catch(error => {
            res.status(500).json(error);
          });
});

router.get("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({
                    you: "can check out any time you like, but you can never leave"
                });
            } else {
                res.status(200).json({ you: "logged out successfully"});
            }
        });
    } else {
        res.status(200).json({ bye: "felicia"})
    }
})

module.exports = router